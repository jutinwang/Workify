import { Router, Request, Response } from 'express';
import { Gender, PrismaClient, Ethnicity, IdentityFlag } from '@prisma/client';
import { CompleteStudentProfileSchema } from '../../schema/studentProfile';
import { requireAuth, requireRole } from '../../middleware/requireAuth';
import { z } from "zod";
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

const UpdateStudentProfileSchema = z.object({
    gender: z.string().optional(),
    ethnicity: z.array(z.string()).optional(),
    optional: z.array(z.string()).optional(),
});

const UpdateAccountInfoSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().regex(/@uottawa\.ca$/, 'Email must be a uOttawa email (@uottawa.ca)').transform(s => s.trim().toLowerCase()).optional(),
    phoneNumber: z.string().optional(),
});

const ChangePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

const DeleteAccountSchema = z.object({
    password: z.string(),
    confirmation: z.literal('DELETE'),
});

const GENDER_MAP: Record<string, Gender> = {
    Man: Gender.MAN,
    Woman: Gender.WOMAN,
    "Non-binary": Gender.NON_BINARY,
    "Two-Spirit": Gender.TWO_SPIRIT,
    "Prefer not to say": Gender.PREFER_NOT_TO_SAY
};

// Complete student profile wizard
router.post('/', requireAuth, requireRole('STUDENT'), async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.sub);
        if (!Number.isFinite(userId)) {
            return res.status(401).json({ error: 'No user in auth context' });
        }

        const validatedData = CompleteStudentProfileSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { student: true },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Use transaction to ensure all data is saved together
        const result = await prisma.$transaction(async (tx) => {
            const profileData = {
                phoneNumber: validatedData.contact.phoneNumber,
                linkedInUrl: validatedData.contact.linkedInUrl,
                githubUrl: validatedData.contact.githubUrl,
                portfolio: validatedData.contact.portfolio,

                resumeUrl: validatedData.files.resumeUrl || undefined,
                transcript: validatedData.files.transcript || undefined,
                coverLetter: validatedData.files.coverLetter || undefined,

                aboutMe: validatedData.aboutMe,
                major: validatedData.major,
                year: validatedData.year,

                ...(validatedData.demographics && {
                    gender: validatedData.demographics.gender as Gender,
                    ethnicity: validatedData.demographics.ethnicity,
                    optional: validatedData.demographics.optional || [],
                }),
            };

            const studentProfile = await tx.studentProfile.upsert({
                where: { userId },
                update: profileData,
                create: {
                    userId,
                    ...profileData,
                    bookmarks: [],
                    ...(!validatedData.demographics && {
                        gender: 'PREFER_NOT_TO_SAY' as Gender,
                        ethnicity: [],
                        optional: [],
                    }),
                },
            });

            if (user.student) {
                await tx.education.deleteMany({
                    where: { studentId: user.student.id },
                });
            }

            const educationEntries = await Promise.all(
                validatedData.education.map((edu) =>
                    tx.education.create({
                        data: {
                            studentId: studentProfile.id,
                            program: edu.program,
                            yearOfStudy: edu.yearOfStudy,
                            gradDate: edu.gradDate ? new Date(edu.gradDate) : undefined,
                            schoolName: edu.schoolName,
                        },
                    })
                )
            );

            if (user.student) {
                await tx.experience.deleteMany({
                    where: { userId: user.student.id },
                });
            }

            const experienceEntries = await Promise.all(
                validatedData.experience.map((exp) =>
                    tx.experience.create({
                        data: {
                            userId: studentProfile.id,
                            title: exp.title,
                            company: exp.company,
                            startDate: new Date(exp.startDate),
                            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
                            description: exp.description,
                        },
                    })
                )
            );

            return {
                profile: studentProfile,
                education: educationEntries,
                experience: experienceEntries,
            };
        });

        return res.status(201).json({
            message: 'Profile completed successfully',
            data: result,
        });

    } catch (error: any) {
        console.error('Error creating student profile:', error);
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.errors
            });
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get complete student profile
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.sub);

        if (!Number.isFinite(userId)) {
            return res.status(401).json({ error: 'No user in auth context' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                student: {
                    include: {
                        educations: true,
                        experience: true,
                    },
                },
            },
        });

        if (!user || !user.student) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        return res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            profile: user.student,
            education: user.student.educations,
            experience: user.student.experience,
        });
    } catch (error) {
        console.error('Error fetching student profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Partial update
router.patch('/', requireAuth, requireRole('STUDENT'), async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.sub);

        if (!Number.isFinite(userId)) {
            return res.status(401).json({ error: 'No user in auth context' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { student: true },
        });

        if (!user || !user.student) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const raw = UpdateStudentProfileSchema.parse(req.body);

        const normalizeEnum = (val?: string | null) => val ? val.toUpperCase().replace(/\s+/g, "_") : undefined; // "Prefer not to say" -> "PREFER_NOT_TO_SAY"

        const genderEnum = raw.gender ? (normalizeEnum(raw.gender) as Gender) : undefined;

        const ethnicityEnums = (raw.ethnicity ?? []).map((e) => normalizeEnum(e) as Ethnicity);

        const optionalEnums = (raw.optional ?? []).map((f) => normalizeEnum(f) as IdentityFlag);

        const updated = await prisma.studentProfile.update({
            where: { userId },
            data: {
                ...(genderEnum && { gender: genderEnum }),
                ...(ethnicityEnums.length && { ethnicity: ethnicityEnums }),
                ...(optionalEnums.length && { optional: optionalEnums }),
            },
        });

        return res.json({
            message: 'Profile updated successfully',
            profile: updated,
        });
    } catch (error) {
        console.error('Error updating student profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Update account information (name, email, phone)
router.patch('/account/profile', requireAuth, requireRole('STUDENT'), async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.sub);

        if (!Number.isFinite(userId)) {
            return res.status(401).json({ error: 'No user in auth context' });
        }

        const validation = UpdateAccountInfoSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.issues
            });
        }

        const data = validation.data;

        // Check if email is already taken
        if (data.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser && existingUser.id !== userId) {
                return res.status(409).json({ error: 'Email already in use' });
            }
        }

        // Perform updates in a transaction
        await prisma.$transaction(async (tx) => {
            const userUpdate: any = {};
            const profileUpdate: any = {};

            if (data.name !== undefined) userUpdate.name = data.name;
            if (data.email !== undefined) userUpdate.email = data.email;
            if (data.phoneNumber !== undefined) profileUpdate.phoneNumber = data.phoneNumber;

            if (Object.keys(userUpdate).length > 0) {
                await tx.user.update({
                    where: { id: userId },
                    data: userUpdate,
                });
            }

            if (Object.keys(profileUpdate).length > 0) {
                await tx.studentProfile.update({
                    where: { userId },
                    data: profileUpdate,
                });
            }
        });

        return res.json({
            message: 'Account information updated successfully',
        });
    } catch (error) {
        console.error('Error updating account info:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password
router.patch('/account/password', requireAuth, requireRole('STUDENT'), async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.sub);

        if (!Number.isFinite(userId)) {
            return res.status(401).json({ error: 'No user in auth context' });
        }

        const validation = ChangePasswordSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.error.issues
            });
        }

        const { currentPassword, newPassword } = validation.data;

        // Verify current password
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return res.json({
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete account
router.delete('/account', requireAuth, requireRole('STUDENT'), async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.sub);

        if (!Number.isFinite(userId)) {
            return res.status(401).json({ error: 'No user in auth context' });
        }

        const validation = DeleteAccountSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                error: 'Validation failed. Password and confirmation required.',
                details: validation.error.issues
            });
        }

        const { password } = validation.data;

        // Verify password
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Delete user (cascade will delete student profile and related data)
        await prisma.user.delete({
            where: { id: userId },
        });

        return res.json({
            message: 'Account deleted successfully',
            deleted: true,
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;