import express from "express";
import { searchJobs } from "./search/searchJobs";

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

export default router;
