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

async function getStudentProfileId(userId: number): Promise<number> {
    const profile = await prisma.studentProfile.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!profile) {
        throw Object.assign(new Error("Student profile not found"), { status: 404 });
    }
    return profile.id;
}

const ApplicationCreate = z.object({
    jobId: z.number().int().positive(),
    coverLetter: z.string().max(20000).optional(),
});

const ApplicationUpdate = z.object({
    coverLetter: z.string().max(20000).optional(),
});

const ApplicationQueryParams = z.object({
    status: z.nativeEnum(ApplicationStatus).optional(),
    limit: z.coerce.number().int().positive().max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

router.post("/", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const input = ApplicationCreate.parse(req.body);

            const job = await prisma.job.findUnique({
                where: { id: input.jobId },
                select: {
                    id: true,
                    title: true,
                    company: { select: { id: true, name: true } },
                },
            });

            if (!job) {
                return res.status(404).json({ error: "Job not found" });
            }

            const existing = await prisma.application.findUnique({
                where: {
                    jobId_studentId: {
                        jobId: input.jobId,
                        studentId: studentId,
                    },
                },
                select: { id: true },
            });

            if (existing) {
                return res.status(409).json({ error: "You have already applied to this job" });
            }

            const application = await prisma.application.create({
                data: {
                    studentId,
                    jobId: input.jobId,
                    coverLetter: input.coverLetter ?? null,
                    status: ApplicationStatus.PENDING,
                },
                select: {
                    id: true,
                    status: true,
                    appliedAt: true,
                    coverLetter: true,
                    job: {
                        select: {
                            id: true,
                            title: true,
                            location: true,
                            type: true,
                            salary: true,
                            company: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            return res.status(201).json({ application });
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

router.get("/", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const query = ApplicationQueryParams.parse(req.query);

            const where: any = { studentId };
            if (query.status) {
                where.status = query.status;
            }

            const [applications, total] = await Promise.all([
                prisma.application.findMany({
                    where,
                    orderBy: { appliedAt: "desc" },
                    take: query.limit,
                    skip: query.offset,
                    select: {
                        id: true,
                        status: true,
                        appliedAt: true,
                        updatedAt: true,
                        shortlisted: true,
                        job: {
                            select: {
                                id: true,
                                title: true,
                                location: true,
                                type: true,
                                length: true,
                                salary: true,
                                company: {
                                    select: {
                                        id: true,
                                        name: true,
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

router.get("/:applicationId", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const applicationId = Number(req.params.applicationId);

            if (!Number.isFinite(applicationId)) {
                return res.status(400).json({ error: "Invalid application ID" });
            }

            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    studentId: studentId,
                },
                select: {
                    id: true,
                    status: true,
                    appliedAt: true,
                    updatedAt: true,
                    shortlisted: true,
                    coverLetter: true,
                    job: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            location: true,
                            length: true,
                            type: true,
                            salary: true,
                            qualification: true,
                            benefits: true,
                            tags: {
                                select: {
                                    id: true,
                                    name: true,
                                    displayName: true,
                                },
                            },
                            company: {
                                select: {
                                    id: true,
                                    name: true,
                                    url: true,
                                    about: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!application) {
                return res.status(404).json({ error: "Application not found" });
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

router.patch("/:applicationId", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const applicationId = Number(req.params.applicationId);
            const input = ApplicationUpdate.parse(req.body);

            if (!Number.isFinite(applicationId)) {
                return res.status(400).json({ error: "Invalid application ID" });
            }

            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    studentId: studentId,
                },
                select: { id: true, status: true },
            });

            if (!application) {
                return res.status(404).json({ error: "Application not found" });
            }

            if (application.status !== ApplicationStatus.PENDING) {
                return res.status(400).json({
                    error: "Cannot edit application after it has been reviewed",
                });
            }

            const updated = await prisma.application.update({
                where: { id: applicationId },
                data: input,
                select: {
                    id: true,
                    status: true,
                    coverLetter: true,
                    updatedAt: true,
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

router.post("/:applicationId/withdraw", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const applicationId = Number(req.params.applicationId);

            if (!Number.isFinite(applicationId)) {
                return res.status(400).json({ error: "Invalid application ID" });
            }

            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    studentId: studentId,
                },
                select: { id: true, status: true },
            });

            if (!application) {
                return res.status(404).json({ error: "Application not found" });
            }

            if (application.status === ApplicationStatus.ACCEPTED || application.status === ApplicationStatus.REJECTED) {
                return res.status(400).json({
                    error: `Cannot withdraw application with status: ${application.status}`,
                });
            }

            // Note: You mentioned adding WITHDRAWN status in schema.prisma
            // For now, using REJECTED to mark withdrawn applications
            // TODO: Add WITHDRAWN to ApplicationStatus enum and use here
            const updated = await prisma.application.update({
                where: { id: applicationId },
                data: { status: ApplicationStatus.REJECTED },
                select: {
                    id: true,
                    status: true,
                    updatedAt: true,
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

router.delete("/:applicationId", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const applicationId = Number(req.params.applicationId);

            if (!Number.isFinite(applicationId)) {
                return res.status(400).json({ error: "Invalid application ID" });
            }

            // Verify ownership and status
            const application = await prisma.application.findFirst({
                where: {
                    id: applicationId,
                    studentId: studentId,
                },
                select: { id: true, status: true },
            });

            if (!application) {
                return res.status(404).json({ error: "Application not found" });
            }

            if (application.status !== ApplicationStatus.PENDING) {
                return res.status(400).json({
                    error: "Can only delete applications that are still pending",
                });
            }

            await prisma.application.delete({
                where: { id: applicationId },
            });

            return res.status(204).send();
        } catch (e: any) {
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

router.get("/stats/summary", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);

            const [total, pending, reviewed, shortlisted, interview, offer, accepted, rejected] =
                await Promise.all([
                    prisma.application.count({ where: { studentId } }),
                    prisma.application.count({
                        where: { studentId, status: ApplicationStatus.PENDING },
                    }),
                    prisma.application.count({
                        where: { studentId, status: ApplicationStatus.REVIEWED },
                    }),
                    prisma.application.count({
                        where: { studentId, status: ApplicationStatus.SHORTLISTED },
                    }),
                    prisma.application.count({
                        where: { studentId, status: ApplicationStatus.INTERVIEW },
                    }),
                    prisma.application.count({
                        where: { studentId, status: ApplicationStatus.OFFER },
                    }),
                    prisma.application.count({
                        where: { studentId, status: ApplicationStatus.ACCEPTED },
                    }),
                    prisma.application.count({
                        where: { studentId, status: ApplicationStatus.REJECTED },
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