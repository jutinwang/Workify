import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { requireAuth, requireRole } from '../../middleware/requireAuth';

const router = Router();
const prisma = new PrismaClient();

const completeProfileSchema = z.object({
    companyId: z.number().optional(),
    companyName: z.string().min(1).optional(),
    companyUrl: z.string().url().optional(),
    companySize: z.string().optional(),
    companyAbout: z.string().optional(),
    companyCareersPage: z.string().url().optional(),
    companyLinkedInUrl: z.string().url().optional(),
    workEmail: z.string().email().optional(),
    workPhone: z.string().optional(),
    availability: z.string().optional(),
    notificationMethod: z.string().optional(),
    profilePhotoUrl: z.string().url().optional(),
});

const updateProfileSchema = z.object({
    companyId: z.number().optional(),
    workEmail: z.string().email().optional(),
    workPhone: z.string().optional(),
    availability: z.string().optional(),
    notificationMethod: z.string().optional(),
    profilePhotoUrl: z.string().url().optional(),
    name: z.string().min(1).optional(),
    email: z.string().email().transform(s => s.trim().toLowerCase()).optional(),
    password: z.string().min(8).optional(),
});

const deleteAccountSchema = z.object({
    password: z.string(),
    confirmation: z.literal('DELETE'),
});

const getEmployerProfile = async (req: Request, res: Response, next: Function) => {
    try {
        const userId = req.user?.sub;
        
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const employer = await prisma.employerProfile.findUnique({
            where: { userId },
        });

        if (!employer) {
            return res.status(404).json({ error: 'Employer profile not found' });
        }

        req.employerProfile = employer;
        next();
    } catch (error) {
        console.error('Error fetching employer profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

router.use(requireAuth);
router.use(requireRole('EMPLOYER'));

router.patch('/complete-profile', getEmployerProfile, async (req: Request, res: Response) => {
    try {
        const validation = completeProfileSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validation.error.issues 
            });
        }

        const data = validation.data;
        let companyId = data.companyId;

        if (data.companyName && !companyId) {
            const company = await prisma.company.create({
                data: {
                    name: data.companyName,
                    url: data.companyUrl ?? null,
                    size: data.companySize ?? null,
                    about: data.companyAbout ?? null,
                    careersPage: data.companyCareersPage ?? null,
                    linkedInUrl: data.companyLinkedInUrl ?? null,
                },
            });
            
            companyId = company.id;
        }

        const updatedProfile = await prisma.employerProfile.update({
            where: { id: req.employerProfile.id },
            data: {
                companyId,
                workEmail: data.workEmail,
                workPhone: data.workPhone,
                availability: data.availability,
                notificationMethod: data.notificationMethod,
                profilePhotoUrl: data.profilePhotoUrl,
            },
            include: {
                company: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        res.status(200).json({
            message: 'Profile completed successfully',
            profile: updatedProfile,
        });
    } catch (error) {
        console.error('Error completing profile:', error);
        res.status(500).json({ error: 'Failed to complete profile' });
    }
});

router.get('/profile', getEmployerProfile, async (req: Request, res: Response) => {
    try {
        const profile = await prisma.employerProfile.findUnique({
            where: { id: req.employerProfile.id },
            include: {
                company: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                    },
                jobs: {
                    include: {
                        applications: true,
                        tags: true,
                    },
                },
                interviews: {
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        res.status(200).json({ profile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.patch('/profile', getEmployerProfile, async (req: Request, res: Response) => {
    try {
        const validation = updateProfileSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: validation.error.issues 
            });
        }

        const data = validation.data;

        const employerUpdate: any = {};
        const userUpdate: any = {};

        // Employer profile fields
        if (data.companyId !== undefined) employerUpdate.companyId = data.companyId;
        if (data.workEmail !== undefined) employerUpdate.workEmail = data.workEmail;
        if (data.workPhone !== undefined) employerUpdate.workPhone = data.workPhone;
        if (data.availability !== undefined) employerUpdate.availability = data.availability;
        if (data.notificationMethod !== undefined) employerUpdate.notificationMethod = data.notificationMethod;
        if (data.profilePhotoUrl !== undefined) employerUpdate.profilePhotoUrl = data.profilePhotoUrl;

        // User fields
        if (data.name !== undefined) userUpdate.name = data.name;
        if (data.email !== undefined) {
            // Check if email is already taken
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });
            
            if (existingUser && existingUser.id !== req.user!.sub) {
                return res.status(409).json({ error: 'Email already in use' });
            }
            
            userUpdate.email = data.email;
        }

        if (data.password !== undefined) {
            userUpdate.password = await bcrypt.hash(data.password, 12);
        }

        // Perform updates in a transaction
        const result = await prisma.$transaction(async (tx) => {
            if (Object.keys(userUpdate).length > 0) {
                await tx.user.update({
                where: { id: req.user!.sub },
                data: userUpdate,
                });
            }

            // Update employer profile if there are employer changes
            if (Object.keys(employerUpdate).length > 0) {
                await tx.employerProfile.update({
                where: { id: req.employerProfile.id },
                data: employerUpdate,
                });
            }

            // Fetch updated profile
            return tx.employerProfile.findUnique({
                where: { id: req.employerProfile.id },
                include: {
                    company: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            profile: result,
        }); 
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.delete('/account', getEmployerProfile, async (req: Request, res: Response) => {
    try {
        const validation = deleteAccountSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Validation failed. Password and confirmation required.', 
                details: validation.error.issues 
            });
        }

        const { password } = validation.data;

        // Verify password
        const user = await prisma.user.findUnique({
            where: { id: req.user!.sub },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Delete user (cascade will delete employer profile and related data)
        await prisma.user.delete({
            where: { id: req.user!.sub },
        });

        res.status(200).json({ 
            message: 'Account deleted successfully',
            deleted: true,
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

router.get('/stats', getEmployerProfile, async (req: Request, res: Response) => {
    try {
        const [jobCount, applicationCount, interviewCount, activeJobs] = await Promise.all([
            prisma.job.count({
                where: { employerId: req.employerProfile.id },
            }),
            prisma.application.count({
                where: {
                    job: {
                        employerId: req.employerProfile.id,
                    },
                },
            }),
            prisma.interviewRequest.count({
                where: { employerId: req.employerProfile.id },
            }),
            prisma.job.count({
                where: {
                    employerId: req.employerProfile!.id,
                    updatedAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                    },
                },
            }),
        ]);

        res.status(200).json({
            stats: {
                totalJobs: jobCount,
                totalApplications: applicationCount,
                totalInterviews: interviewCount,
                activeJobsLast30Days: activeJobs,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

export default router;

declare global {
    namespace Express {
        interface Request {
            employerProfile: {
                id: number;
                userId: number;
                companyId: number | null;
            };
        }
    }
}