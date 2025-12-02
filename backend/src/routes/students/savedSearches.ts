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

const SaveSearchBody = z.object({
    name: z.string().min(1).max(100),
    filters: z.object({
        searchTerm: z.string().optional(),
        locations: z.array(z.string()).optional(),
        datePosted: z.string().optional(),
        postingTags: z.array(z.string()).optional(),
    }),
});

// POST /students/saved-searches - Save a search
router.post("/", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const input = SaveSearchBody.parse(req.body);

            const savedSearch = await prisma.savedSearch.create({
                data: {
                    studentId,
                    name: input.name,
                    filters: input.filters,
                },
                select: {
                    id: true,
                    name: true,
                    filters: true,
                    createdAt: true,
                },
            });

            return res.status(201).json({ savedSearch });
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

// GET /students/saved-searches - Get all saved searches
router.get("/", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);

            const savedSearches = await prisma.savedSearch.findMany({
                where: { studentId },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    filters: true,
                    createdAt: true,
                },
            });

            return res.json({ savedSearches });
        } catch (e: any) {
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

// DELETE /students/saved-searches/:searchId - Delete a saved search
router.delete("/:searchId", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const searchId = Number(req.params.searchId);

            if (!Number.isFinite(searchId)) {
                return res.status(400).json({ error: "Invalid search ID" });
            }

            const savedSearch = await prisma.savedSearch.findFirst({
                where: {
                    id: searchId,
                    studentId,
                },
            });

            if (!savedSearch) {
                return res.status(404).json({ error: "Saved search not found" });
            }

            await prisma.savedSearch.delete({
                where: { id: searchId },
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
