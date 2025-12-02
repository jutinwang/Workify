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

const SaveSearchBody = z.object({
    name: z.string().min(1).max(100),
    filters: z.object({
        searchTerm: z.string().optional(),
        yearFilter: z.array(z.string()).optional(),
        programFilter: z.array(z.string()).optional(),
        statusFilter: z.string().optional(),
        hasExperienceFilter: z.boolean().nullable().optional(),
        graduationDateFilter: z.string().optional(),
        sortBy: z.string().optional(),
        showShortlistedOnly: z.boolean().optional(),
    }),
});

// POST /employers/saved-searches - Save a search
router.post("/", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const input = SaveSearchBody.parse(req.body);

            const savedSearch = await prisma.employerSavedSearch.create({
                data: {
                    employerId,
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

// GET /employers/saved-searches - Get all saved searches
router.get("/", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);

            const savedSearches = await prisma.employerSavedSearch.findMany({
                where: { employerId },
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

// DELETE /employers/saved-searches/:searchId - Delete a saved search
router.delete("/:searchId", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const searchId = Number(req.params.searchId);

            if (!Number.isFinite(searchId)) {
                return res.status(400).json({ error: "Invalid search ID" });
            }

            const savedSearch = await prisma.employerSavedSearch.findFirst({
                where: {
                    id: searchId,
                    employerId,
                },
            });

            if (!savedSearch) {
                return res.status(404).json({ error: "Saved search not found" });
            }

            await prisma.employerSavedSearch.delete({
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
