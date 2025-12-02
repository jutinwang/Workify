import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/requireAuth';

const router = Router();
const prisma = new PrismaClient();

// Apply admin authentication to all routes
router.use(requireAuth);
router.use(requireRole('ADMIN'));

// ============================================
// EMPLOYER ROUTES
// ============================================

// GET pending employers (not approved yet)
router.get('/employers/pending', async (req, res) => {
    try {
        const pendingEmployers = await prisma.user.findMany({
            where: {
                role: 'EMPLOYER',
                employer: {
                approved: false
                }
            },
            include: {
                employer: {
                    include: {
                        company: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(pendingEmployers);
    } catch (error) {
        console.error('Error fetching pending employers:', error);
        res.status(500).json({ error: 'Failed to fetch pending employers' });
    }
});

router.get('/employers', async (req, res) => {
    try {
        const employers = await prisma.user.findMany({
            where: {
                role: 'EMPLOYER'
            },
            include: {
                employer: {
                    include: {
                        company: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(employers);
    } catch (error) {
        console.error('Error fetching employers:', error);
        res.status(500).json({ error: 'Failed to fetch employers' });
    }
});

router.post('/employers/:id/approve', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { employer: true }
        });

        if (!user || user.role !== 'EMPLOYER') {
            return res.status(404).json({ error: 'Employer not found' });
        }

        if (!user.employer) {
            return res.status(400).json({ error: 'User has no employer profile' });
        }

        const updatedEmployer = await prisma.employerProfile.update({
            where: { id: user.employer.id },
            data: { approved: true }
        });

        res.json({ 
            message: 'Employer approved successfully',
            employer: updatedEmployer 
        });
    } catch (error) {
        console.error('Error approving employer:', error);
        res.status(500).json({ error: 'Failed to approve employer' });
    }
});

// POST decline/reject employer
router.post('/employers/:id/decline', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { employer: true }
        });

        if (!user || user.role !== 'EMPLOYER') {
            return res.status(404).json({ error: 'Employer not found' });
        }

        if (!user.employer) {
            return res.status(400).json({ error: 'User has no employer profile' });
        }

        // Delete the employer account (cascade will handle related data)
        await prisma.user.delete({
            where: { id: userId }
        });

        res.json({ 
            message: 'Employer declined and removed successfully',
            userId: userId 
        });
    } catch (error) {
        console.error('Error declining employer:', error);
        res.status(500).json({ error: 'Failed to decline employer' });
    }
});

router.get('/students', async (req, res) => {
    try {
        const students = await prisma.user.findMany({
            where: {
                role: 'STUDENT'
            },
            include: {
                student: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

router.get('/jobs', async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            include: {
                company: true,
                employer: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        applications: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// DELETE job posting
router.delete('/jobs/:id', async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);

        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Soft delete by updating status to DELETED
        const deletedJob = await prisma.job.update({
            where: { id: jobId },
            data: { postingStatus: 'DELETED' }
        });

        res.json({ 
            message: 'Job deleted successfully',
            job: deletedJob 
        });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

// POST suspend user
router.post('/users/:id/suspend', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'ADMIN') {
            return res.status(403).json({ error: 'Cannot suspend admin users' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { suspended: !user.suspended }
        });

        res.json({ 
            message: `User ${updatedUser.suspended ? 'suspended' : 'unsuspended'} successfully`,
            user: updatedUser 
        });
    } catch (error) {
        console.error('Error suspending user:', error);
        res.status(500).json({ error: 'Failed to suspend user' });
    }
});

// DELETE user (hard delete)
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'ADMIN') {
            return res.status(403).json({ error: 'Cannot delete admin users' });
        }

        // Cascade delete will handle related records
        await prisma.user.delete({
            where: { id: userId }
        });

        res.json({ 
            message: 'User deleted successfully',
            userId: userId 
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// GET admin dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const [
            totalStudents,
            totalEmployers,
            pendingEmployers,
            totalJobs,
            activeJobs,
            totalApplications
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'STUDENT' } }),
            prisma.user.count({ where: { role: 'EMPLOYER' } }),
            prisma.employerProfile.count({ where: { approved: false } }),
            prisma.job.count(),
            prisma.job.count({ where: { postingStatus: 'ACTIVE' } }),
            prisma.application.count()
        ]);

        res.json({
            totalStudents,
            totalEmployers,
            pendingEmployers,
            totalJobs,
            activeJobs,
            totalApplications
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default router;