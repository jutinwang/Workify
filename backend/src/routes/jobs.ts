import express from "express";
import { PrismaClient } from "@prisma/client";
import { searchJobs } from "./search/searchJobs";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/search", async (req, res) => {
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


export default router;
