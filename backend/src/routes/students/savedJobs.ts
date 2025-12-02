import { Router } from "express";
import { PrismaClient, Role } from "@prisma/client";
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

const SaveJobBody = z.object({
    jobId: z.number().int().positive(),
});

// POST /students/saved-jobs - Save a job
router.post("/", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const input = SaveJobBody.parse(req.body);

            // Check if job exists
            const job = await prisma.job.findUnique({
                where: { id: input.jobId },
                select: { id: true, title: true },
            });

            if (!job) {
                return res.status(404).json({ error: "Job not found" });
            }

            // Check if already saved
            const existing = await prisma.savedJob.findUnique({
                where: {
                    studentId_jobId: {
                        studentId,
                        jobId: input.jobId,
                    },
                },
            });

            if (existing) {
                return res.status(409).json({ error: "Job already saved" });
            }

            // Save the job
            const savedJob = await prisma.savedJob.create({
                data: {
                    studentId,
                    jobId: input.jobId,
                },
                select: {
                    id: true,
                    savedAt: true,
                    job: {
                        select: {
                            id: true,
                            title: true,
                            location: true,
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

            return res.status(201).json({ savedJob });
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

// GET /students/saved-jobs - Get all saved jobs
router.get("/", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);

            const savedJobs = await prisma.savedJob.findMany({
                where: { studentId },
                orderBy: { savedAt: "desc" },
                select: {
                    id: true,
                    savedAt: true,
                    job: {
                        select: {
                            id: true,
                            title: true,
                            location: true,
                            salary: true,
                            length: true,
                            description: true,
                            createdAt: true,
                            updatedAt: true,
                            postingStatus: true,
                            company: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            tags: {
                                select: {
                                    id: true,
                                    name: true,
                                    displayName: true,
                                },
                            },
                        },
                    },
                },
            });

            return res.json({ savedJobs });
        } catch (e: any) {
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

// DELETE /students/saved-jobs/:jobId - Unsave a job
router.delete("/:jobId", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const jobId = Number(req.params.jobId);

            if (!Number.isFinite(jobId)) {
                return res.status(400).json({ error: "Invalid job ID" });
            }

            const savedJob = await prisma.savedJob.findUnique({
                where: {
                    studentId_jobId: {
                        studentId,
                        jobId,
                    },
                },
            });

            if (!savedJob) {
                return res.status(404).json({ error: "Saved job not found" });
            }

            await prisma.savedJob.delete({
                where: {
                    studentId_jobId: {
                        studentId,
                        jobId,
                    },
                },
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

export default router;
