import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export type JobSearchParams = {
    title?: string | null;
    tags?: string[] | null;
};

function normalizeTags(tags?: string[] | null): string[] {
    if (!tags) return [];
    return tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
}


export async function searchJobs(params: JobSearchParams) {
    const { title, tags } = params;

    const where: any = {};

    if (title && title.trim().length > 0) {
            where.title = {
            contains: title.trim(),
            mode: "insensitive",
        };
    }

    const normalizedTags = normalizeTags(tags);
    if (normalizedTags.length > 0) {
        where.tags = {
            some: {
                name: { in: normalizedTags },
            },
        };
    }
    
    return prisma.job.findMany({
        where,
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
                },
            },
            employer: {
                select: {
                    id: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
