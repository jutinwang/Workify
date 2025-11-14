import { Router } from "express";
import { PrismaClient, Role, Gender, Ethnicity, IdentityFlag, Prisma } from "@prisma/client";
import { signToken } from "../../lib/jwt";
import bcrypt from "bcrypt";
import { requireAuth, requireRole } from "../../middleware/requireAuth";
import { getUserId } from "../students/users";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

function normalizeTags(tags: string[]): string[] {
  return tags.map(t => t.trim().toLowerCase());
}

function prepareTagsForCreate(rawTags: string[] | undefined) {
    const original = (rawTags ?? [])
        .map(t => t.trim())
        .filter(Boolean); 

    const normalized = original.map(t => t.toLowerCase());

    return { original, normalized };
}

const CreateJobBody = z.object({
    title: z.string().min(3),
    description: z.any(),
    location: z.string().min(1).optional(),
    type: z.string().min(1).optional(), 
    salary: z.string().min(1).optional(),
    requirements: z.string().min(1).optional(),
    companyId: z.number().int().positive().optional(),
    tags: z.array(z.string().min(1)).optional(),
});

const UpdateJobBody = CreateJobBody.partial();

router.post( "/me/jobs", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const input = CreateJobBody.parse(req.body);

            const userId = getUserId(req);
            const employer = await prisma.employerProfile.findUnique({
                where: { userId },
                select: { id: true, companyId: true }
            });

            if (!employer) {
                return res.status(404).json({ error: "Employer profile not found" });
            }

            const companyId = input.companyId ?? employer.companyId ?? null;
            if (!companyId) {
                return res.status(400).json({
                    error:"companyId is required. Provide companyId in the request or link a company to your employer profile first.",
                });
            }

            const { original, normalized } = prepareTagsForCreate(input.tags);

            const job = await prisma.job.create({
                data: {
                    title: input.title,
                    description: input.description,
                    location: input.location ?? null,
                    type: input.type ?? null,
                    salary: input.salary ?? null,
                    requirements: input.requirements ?? null,

                    company: { connect: { id: companyId } },
                    employer: { connect: { id: employer.id } },

                    tags: {
                        connectOrCreate: normalized.map((name, i) => ({
                            where: { name },
                            create: {
                                name,
                                displayName: original[i],
                            },
                        })),
                    },
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    location: true,
                    type: true,
                    salary: true,
                    requirements: true,
                    createdAt: true,
                    updatedAt: true,
                    company: { select: { id: true, name: true } },
                    employer: { select: { id: true } },
                },
            });

            return res.status(201).json({job});

        } catch (e: any) {
            if (e?.name === "ZodError") {
                return res.status(400).json({ error: "Invalid input", issues: e.issues });
            }
            // Foreign key errors (e.g., bad companyId)
            if (e?.code === "P2003") {
                return res.status(400).json({ error: "Invalid relation (companyId or employerId not found)" });
            }
            next(e);
        }
    }
);

router.patch("/me/jobs/:jobId", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const jobId = Number(req.params.jobId);
            const input = UpdateJobBody.parse(req.body);

            if (!Number.isFinite(jobId)) {
                return res.status(400).json({ error: "Invalid job ID" });
            }

            const employer = await prisma.employerProfile.findUnique({
                where: { userId },
                select: { id: true },
            });

            if (!employer) {
                return res.status(404).json({ error: "Employer profile not found" });
            }

            // Verify the employer owns this job
            const job = await prisma.job.findFirst({
                where: { id: jobId, employerId: employer.id },
                select: { id: true },
            });

            if (!job) {
                return res.status(404).json({ error: "Job not found or you don't have permission to edit it" });
            }

            const { tags, ...rest } = input as z.infer<typeof UpdateJobBody>;

            const data: Prisma.JobUpdateInput = {...rest};

            if (tags !== undefined) {
                const { original, normalized } = prepareTagsForCreate(tags);

                data.tags = {
                    set: [],
                    connectOrCreate: normalized.map((name, i) => ({
                        where: { name },
                            create: {
                                name,
                                displayName: original[i],
                        },
                    })),
                };
            }

            const updated = await prisma.job.update({
                where: { id: jobId },
                data,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    location: true,
                    type: true,
                    salary: true,
                    requirements: true,
                    updatedAt: true,
                    tags: { select: { id: true, name: true } },
                },
            });

            return res.json({ job: updated });
        } catch (e: any) {
            if (e?.name === "ZodError") {
                return res.status(400).json({ error: "Invalid input", issues: e.issues });
            }
            next(e);
        }
    }
);

router.delete("/me/jobs/:jobId", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const jobId = Number(req.params.jobId);

            if (!Number.isFinite(jobId)) {
                return res.status(400).json({ error: "Invalid job ID" });
            }

            const employer = await prisma.employerProfile.findUnique({
                where: { userId },
                select: { id: true },
            });

            if (!employer) {
                return res.status(404).json({ error: "Employer profile not found" });
            }

            const job = await prisma.job.findFirst({
                where: { id: jobId, employerId: employer.id },
                select: { id: true },
            });

            if (!job) {
                return res.status(404).json({ error: "Job not found or you don't have permission to delete it" });
            }

            await prisma.job.delete({ where: { id: jobId } });

            return res.status(204).send();
        } catch (e) {
            next(e);
        }
    }
);


export default router;