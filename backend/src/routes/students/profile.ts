import { Router, Request, Response } from 'express';
import { Gender, PrismaClient } from '@prisma/client';
import { CompleteStudentProfileSchema } from '../../schema/studentProfile';
import { requireAuth, requireRole } from '../../middleware/requireAuth';

const router = Router();
const prisma = new PrismaClient();

// Complete student profile wizard
router.post('/', requireAuth, requireRole('STUDENT'), async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const validatedData = CompleteStudentProfileSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { student: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use transaction to ensure all data is saved together
        const result = await prisma.$transaction(async (tx) => {
            const studentProfile = await tx.studentProfile.upsert({
                where: { userId },
                update: {
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
                
                    gender: validatedData.demographics?.gender as Gender | undefined,
                    ethnicity: validatedData.demographics?.ethnicity || [],
                    optional: validatedData.demographics?.optional || [],
                },
                create: {
                    userId,
                    phoneNumber: validatedData.contact.phoneNumber,
                    linkedInUrl: validatedData.contact.linkedInUrl,
                    githubUrl: validatedData.contact.githubUrl,
                    resumeUrl: validatedData.files.resumeUrl || undefined,
                    transcript: validatedData.files.transcript || undefined,
                    coverLetter: validatedData.files.coverLetter || undefined,
                    
                    aboutMe: validatedData.aboutMe,
                    major: validatedData.major,
                    year: validatedData.year,
                
                    ...(validatedData.demographics?.gender && { 
                        gender: validatedData.demographics.gender 
                    }),
                    ethnicity: validatedData.demographics?.ethnicity || [],
                    optional: validatedData.demographics?.optional || [],
                    
                    bookmarks: [],
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
        const userId = req.user!.id;

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
        const userId = req.user!.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { student: true },
        });

        if (!user || !user.student) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const updatedProfile = await prisma.studentProfile.update({
            where: { userId },
            data: req.body,
        });

        return res.json({
            message: 'Profile updated successfully',
            profile: updatedProfile,
        });
    } catch (error) {
        console.error('Error updating student profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;