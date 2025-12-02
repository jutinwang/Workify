import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export type JobSearchParams = {
    title?: string | null;
    tags?: string[] | null;
    studentId?: number | null;
};

function normalizeTags(tags?: string[] | null): string[] {
    if (!tags) return [];
    return tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
}


export async function searchJobs(params: JobSearchParams) {
    const { title, tags, studentId } = params;

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
    
    const jobs = await prisma.job.findMany({
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

    // If studentId is provided, sort unapplied jobs first
    if (studentId) {
        const jobIds = jobs.map(j => j.id);
        const applications = await prisma.application.findMany({
            where: {
                studentId,
                jobId: { in: jobIds },
            },
            select: {
                jobId: true,
                appliedAt: true,
            },
        });

        const appliedMap = new Map(applications.map(app => [app.jobId, app.appliedAt]));

        // Sort: unapplied jobs first (by createdAt desc), then applied jobs (by appliedAt desc)
        return jobs.sort((a, b) => {
            const aApplied = appliedMap.has(a.id);
            const bApplied = appliedMap.has(b.id);

            if (aApplied === bApplied) {
                // Both applied or both unapplied - sort by date
                if (aApplied) {
                    // Both applied - sort by appliedAt descending
                    const aDate = appliedMap.get(a.id)!.getTime();
                    const bDate = appliedMap.get(b.id)!.getTime();
                    return bDate - aDate;
                } else {
                    // Both unapplied - sort by createdAt descending
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }
            }

            // One applied, one unapplied - unapplied comes first
            return aApplied ? 1 : -1;
        });
    }

    return jobs;
}
