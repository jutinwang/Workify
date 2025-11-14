import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export type JobSearchParams = {
    title?: string | null;
    tags?: string[] | null;
};

export async function searchJobs(params: JobSearchParams) {
    const { title, tags } = params;

    const where: any = {};

    if (title && title.trim().length > 0) {
            where.title = {
            contains: title.trim(),
            mode: "insensitive",
        };
    }

    if (tags && tags.length > 0) {
        where.tags = {
            hasEvery: tags,
        };
    }
    
    return prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
}
