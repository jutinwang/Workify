import express from "express";
import { PrismaClient, Role } from "@prisma/client";
import { searchJobs } from "./search/searchJobs";
import { requireAuth, requireRole } from "../middleware/requireAuth";
import { maybeAuth } from "../middleware/maybeAuth";

const prisma = new PrismaClient();
const router = express.Router();

function getUserId(req: any): number {
    const sub = req.user?.sub;
    const id = Number(sub);
    if (!Number.isFinite(id)) {
        throw new Error("Unauthenticated");
    }
    return id;
}

async function getStudentProfileId(userId: number): Promise<number | null> {
    const profile = await prisma.studentProfile.findUnique({
        where: { userId },
        select: { id: true },
    });
    return profile?.id || null;
}

router.get("/search", maybeAuth, async (req, res) => {
    try {
        const { title, tags } = req.query;

        let tagList: string[] | null = null;
        if (typeof tags === "string" && tags.trim().length > 0) {
            tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
        }

        const jobs = await searchJobs({
            title: typeof title === "string" ? title.trim() : null,
            tags: tagList,
        });

        // Add applied status if user is authenticated as a student
        let studentId: number | null = null;
        if (req.user?.role === Role.STUDENT) {
            try {
                const userId = getUserId(req);
                studentId = await getStudentProfileId(userId);
            } catch (e) {
                // If we can't get student profile, just continue without applied status
            }
        }

        // If we have a studentId, fetch their applications for these jobs
        if (studentId) {
            const jobIds = jobs.map(j => j.id);
            const applications = await prisma.application.findMany({
                where: {
                    studentId,
                    jobId: { in: jobIds },
                },
                select: {
                    jobId: true,
                    status: true,
                    appliedAt: true,
                },
            });

            const appliedMap = new Map(applications.map(app => [app.jobId, app]));

            const jobsWithStatus = jobs.map(job => ({
                ...job,
                hasApplied: appliedMap.has(job.id),
                applicationStatus: appliedMap.get(job.id) || null,
            }));

            return res.json(jobsWithStatus);
        }

        res.json(jobs);
    } catch (err) {
        console.error("Error searching jobs:", err);
        res.status(500).json({ error: "Failed to search jobs" });
    }
});

router.get("/:jobId", async (req, res, next) => {
    try {
        const jobId = Number(req.params.jobId);

        if (!Number.isFinite(jobId)) {
            return res.status(400).json({ error: "Invalid job ID" });
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
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
                        size: true,
                        _count: {
                            select: {
                                jobs: true,
                            },
                        }
                    },
                },
                employer: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        return res.json({ job });
    } catch (e) {
        next(e);
    }
});

router.get("/:jobId/applied", requireAuth, requireRole(Role.STUDENT), async (req, res, next) => {
    try {
        const jobId = Number(req.params.jobId);

        if (!Number.isFinite(jobId)) {
            return res.status(400).json({ error: "Invalid job ID" });
        }

        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);

        if (!studentId) {
            return res.status(404).json({ error: "Student profile not found" });
        }

        const application = await prisma.application.findUnique({
            where: {
                jobId_studentId: {
                    jobId: jobId,
                    studentId: studentId,
                },
            },
            select: {
                id: true,
                status: true,
                appliedAt: true,
            },
        });

        return res.json({
            applied: !!application,
            application: application || null,
        });
    } catch (e: any) {
        if (e?.status === 404) {
            return res.status(404).json({ error: e.message });
        }
        next(e);
    }
});


export default router;
