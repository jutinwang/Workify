import { Router } from "express";
import { PrismaClient, Role, ApplicationStatus } from "@prisma/client";
import { requireAuth, requireRole } from "../../middleware/requireAuth";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

function getUserId(req: any): number {
    const sub = req.user?.sub;
    const id = Number(sub);
    if (!Number.isFinite(id)) {
        throw new Error("Unauthenticated");
    }
    return id;
}

async function getEmployerProfileId(userId: number): Promise<number> {
    const profile = await prisma.employerProfile.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!profile) {
        throw Object.assign(new Error("Employer profile not found"), { status: 404 });
    }
    return profile.id;
}

const UpdateApplicationStatus = z.object({
    status: z.nativeEnum(ApplicationStatus),
    shortlisted: z.boolean().optional(),
});

const BulkUpdateApplications = z.object({
    applicationIds: z.array(z.number().int().positive()).min(1).max(100),
    status: z.nativeEnum(ApplicationStatus),
});

const ApplicationQueryParams = z.object({
    status: z.nativeEnum(ApplicationStatus).optional(),
    shortlisted: z.coerce.boolean().optional(),
    search: z.string().optional(), // Search by student name
    limit: z.coerce.number().int().positive().max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

router.get("/jobs/:jobId/applications", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const jobId = Number(req.params.jobId);
            const query = ApplicationQueryParams.parse(req.query);

            if (!Number.isFinite(jobId)) {
                return res.status(400).json({ error: "Invalid job ID" });
            }

            // Verify employer owns this job
            const job = await prisma.job.findFirst({
                where: { id: jobId, employerId },
                select: { id: true, title: true },
            });

            if (!job) {
                return res.status(404).json({ error: "Job not found or you don't have access" });
            }

            const where: any = { jobId };
            if (query.status) {
                where.status = query.status;
            }
            if (query.shortlisted !== undefined) {
                where.shortlisted = query.shortlisted;
            }
            if (query.search) {
                where.student = {
                    user: {
                        name: {
                            contains: query.search,
                            mode: "insensitive",
                        },
                    },
                };
            }

            const [applications, total] = await Promise.all([
                prisma.application.findMany({
                    where,
                    orderBy: [
                        { shortlisted: "desc" },
                        { appliedAt: "desc" },
                    ],
                    take: query.limit,
                    skip: query.offset,
                    select: {
                        id: true,
                        status: true,
                        shortlisted: true,
                        appliedAt: true,
                        updatedAt: true,
                        coverLetter: true,
                        student: {
                            select: {
                                id: true,
                                major: true,
                                year: true,
                                resumeUrl: true,
                                linkedInUrl: true,
                                githubUrl: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                                experience: {
                                    orderBy: { startDate: "desc" },
                                    select: {
                                        id: true,
                                        title: true,
                                        company: true,
                                        startDate: true,
                                        endDate: true,
                                        description: true,
                                    },
                                },
                                educations: {
                                    orderBy: { gradDate: "desc" },
                                    select: {
                                        id: true,
                                        program: true,
                                        schoolName: true,
                                        yearOfStudy: true,
                                        gradDate: true,
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma.application.count({ where }),
            ]);

            return res.json({
                job: {
                    id: job.id,
                    title: job.title,
                },
                applications,
                pagination: {
                    total,
                    limit: query.limit,
                    offset: query.offset,
                    hasMore: query.offset + query.limit < total,
                },
            });
        } catch (e: any) {
            if (e?.name === "ZodError") {
                return res.status(400).json({ error: "Invalid query parameters", issues: e.issues });
            }
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

router.get("/applications", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const query = ApplicationQueryParams.parse(req.query);

            // Build where clause
            const where: any = {
                job: { employerId },
            };
            if (query.status) {
                where.status = query.status;
            }
            if (query.shortlisted !== undefined) {
                where.shortlisted = query.shortlisted;
            }
            if (query.search) {
                where.student = {
                    user: {
                        name: {
                            contains: query.search,
                            mode: "insensitive",
                        },
                    },
                };
            }

            const [applications, total] = await Promise.all([
                prisma.application.findMany({
                    where,
                    orderBy: [
                        { shortlisted: "desc" },
                        { appliedAt: "desc" },
                    ],
                    take: query.limit,
                    skip: query.offset,
                    select: {
                        id: true,
                        status: true,
                        shortlisted: true,
                        appliedAt: true,
                        updatedAt: true,
                        job: {
                            select: {
                                id: true,
                                title: true,
                                location: true,
                            },
                        },
                        student: {
                            select: {
                                id: true,
                                major: true,
                                year: true,
                                resumeUrl: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma.application.count({ where }),
            ]);

            return res.json({
                applications,
                pagination: {
                    total,
                    limit: query.limit,
                    offset: query.offset,
                    hasMore: query.offset + query.limit < total,
                },
            });
        } catch (e: any) {
            if (e?.name === "ZodError") {
                return res.status(400).json({ error: "Invalid query parameters", issues: e.issues });
            }
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

router.get("/applications/:applicationId", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const applicationId = Number(req.params.applicationId);

            if (!Number.isFinite(applicationId)) {
                return res.status(400).json({ error: "Invalid application ID" });
            }

            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    job: { employerId },
                },
                select: {
                    id: true,
                    status: true,
                    shortlisted: true,
                    appliedAt: true,
                    updatedAt: true,
                    coverLetter: true,
                    job: {
                        select: {
                            id: true,
                            title: true,
                            location: true,
                            type: true,
                        },
                    },
                    student: {
                        select: {
                            id: true,
                            major: true,
                            year: true,
                            resumeUrl: true,
                            linkedInUrl: true,
                            githubUrl: true,
                            phoneNumber: true,
                            aboutMe: true,
                            gender: true,
                            ethnicity: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                            experience: {
                                orderBy: { startDate: "desc" },
                                select: {
                                    id: true,
                                    title: true,
                                    company: true,
                                    startDate: true,
                                    endDate: true,
                                    description: true,
                                },
                            },
                            educations: {
                                orderBy: { gradDate: "desc" },
                                select: {
                                    id: true,
                                    program: true,
                                    schoolName: true,
                                    yearOfStudy: true,
                                    gradDate: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!application) {
                return res.status(404).json({ error: "Application not found or you don't have access" });
            }

            return res.json({ application });
        } catch (e: any) {
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

router.patch("/applications/:applicationId", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const applicationId = Number(req.params.applicationId);
            const input = UpdateApplicationStatus.parse(req.body);

            if (!Number.isFinite(applicationId)) {
                return res.status(400).json({ error: "Invalid application ID" });
            }

            // Verify employer owns the job this application is for
            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    job: { employerId },
                },
                select: { id: true },
            });

            if (!application) {
                return res.status(404).json({ error: "Application not found or you don't have access" });
            }

            const updated = await prisma.application.update({
                where: { id: applicationId },
                data: {
                    status: input.status,
                    ...(input.shortlisted !== undefined && { shortlisted: input.shortlisted }),
                },
                select: {
                    id: true,
                    status: true,
                    shortlisted: true,
                    updatedAt: true,
                    student: {
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });

            return res.json({ application: updated });
        } catch (e: any) {
            if (e?.name === "ZodError") {
                return res.status(400).json({ error: "Invalid input", issues: e.issues });
            }
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

// Bulk update application statuses
router.patch("/applications/bulk", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const input = BulkUpdateApplications.parse(req.body);

            // Verify all applications belong to employer's jobs
            const applications = await prisma.application.findMany({
                where: {
                    id: { in: input.applicationIds },
                    job: { employerId },
                },
                select: { id: true },
            });

            if (applications.length !== input.applicationIds.length) {
                return res.status(400).json({
                    error: "Some applications not found or you don't have access",
                });
            }

            const result = await prisma.application.updateMany({
                where: { id: { in: input.applicationIds } },
                data: { status: input.status },
            });

            return res.json({
                updated: result.count,
                status: input.status,
            });
        } catch (e: any) {
            if (e?.name === "ZodError") {
                return res.status(400).json({ error: "Invalid input", issues: e.issues });
            }
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

router.post("/applications/:applicationId/shortlist", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const applicationId = Number(req.params.applicationId);

            if (!Number.isFinite(applicationId)) {
                return res.status(400).json({ error: "Invalid application ID" });
            }

            // Verify and get current shortlist status
            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    job: { employerId },
                },
                select: { id: true, shortlisted: true },
            });

            if (!application) {
                return res.status(404).json({ error: "Application not found or you don't have access" });
            }

            // Toggle shortlist
            const updated = await prisma.application.update({
                where: { id: applicationId },
                data: { shortlisted: !application.shortlisted },
                select: {
                    id: true,
                    shortlisted: true,
                    status: true,
                },
            });

            return res.json({ application: updated });
        } catch (e: any) {
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

router.get("/stats/applications", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);

            const [
                total,
                pending,
                reviewed,
                shortlisted,
                shortlistedCount,
                interview,
                offer,
                accepted,
                rejected,
            ] = await Promise.all([
                prisma.application.count({ where: { job: { employerId } } }),
                prisma.application.count({
                    where: { job: { employerId }, status: ApplicationStatus.PENDING },
                }),
                prisma.application.count({
                    where: { job: { employerId }, status: ApplicationStatus.REVIEWED },
                }),
                prisma.application.count({
                    where: { job: { employerId }, status: ApplicationStatus.SHORTLISTED },
                }),
                prisma.application.count({
                    where: { job: { employerId }, shortlisted: true },
                }),
                prisma.application.count({
                    where: { job: { employerId }, status: ApplicationStatus.INTERVIEW },
                }),
                prisma.application.count({
                    where: { job: { employerId }, status: ApplicationStatus.OFFER },
                }),
                prisma.application.count({
                    where: { job: { employerId }, status: ApplicationStatus.ACCEPTED },
                }),
                prisma.application.count({
                    where: { job: { employerId }, status: ApplicationStatus.REJECTED },
                }),
            ]);

            return res.json({
                stats: {
                    total,
                    byStatus: {
                        pending,
                        reviewed,
                        shortlisted,
                        interview,
                        offer,
                        accepted,
                        rejected,
                    },
                    shortlistedCount,
                },
            });
        } catch (e: any) {
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

// Get application statistics for a specific job
router.get("/jobs/:jobId/stats", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const jobId = Number(req.params.jobId);

            if (!Number.isFinite(jobId)) {
                return res.status(400).json({ error: "Invalid job ID" });
            }

            const job = await prisma.job.findFirst({
                where: { id: jobId, employerId },
                select: { id: true, title: true },
            });

            if (!job) {
                return res.status(404).json({ error: "Job not found or you don't have access" });
            }

            const [
                total,
                pending,
                reviewed,
                shortlisted,
                shortlistedCount,
                interview,
                offer,
                accepted,
                rejected,
            ] = await Promise.all([
                prisma.application.count({ where: { jobId } }),
                prisma.application.count({
                    where: { jobId, status: ApplicationStatus.PENDING },
                }),
                prisma.application.count({
                    where: { jobId, status: ApplicationStatus.REVIEWED },
                }),
                prisma.application.count({
                    where: { jobId, status: ApplicationStatus.SHORTLISTED },
                }),
                prisma.application.count({
                    where: { jobId, shortlisted: true },
                }),
                prisma.application.count({
                    where: { jobId, status: ApplicationStatus.INTERVIEW },
                }),
                prisma.application.count({
                    where: { jobId, status: ApplicationStatus.OFFER },
                }),
                prisma.application.count({
                    where: { jobId, status: ApplicationStatus.ACCEPTED },
                }),
                prisma.application.count({
                    where: { jobId, status: ApplicationStatus.REJECTED },
                }),
            ]);

            return res.json({
                job: {
                    id: job.id,
                    title: job.title,
                },
                stats: {
                    total,
                    byStatus: {
                        pending,
                        reviewed,
                        shortlisted,
                        interview,
                        offer,
                        accepted,
                        rejected,
                    },
                    shortlistedCount,
                },
            });
        } catch (e: any) {
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

export default router;