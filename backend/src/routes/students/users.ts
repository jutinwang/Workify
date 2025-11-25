import { Router } from "express";
import { Prisma, PrismaClient, Role, ApplicationStatus, Gender, Ethnicity, IdentityFlag, InterviewStatus } from "@prisma/client";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/requireAuth";

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth, requireRole(Role.STUDENT)); // ensuring these endpoints can only be accessed by a user with the student role

const ResumeUrlBody = z.object({
    resumeUrl: z.string().url(),
});

const ExperienceCreate = z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    description: z.string().max(4000).optional(),
});

const ExperiencePatch = ExperienceCreate.partial();

const ApplicationCreate = z.object({
    jobId: z.number().int().positive(),
    coverLetter: z.string().max(20000).optional(),
});

const InterviewRespond = z.object({
    decision: z.enum(["accept", "decline", "propose"]),
    availability: z
        .array(z.object({ start: z.coerce.date(), end: z.coerce.date() }))
        .optional(),
});

const appSelect = {
    id: true,
    status: true,
    job: { select: { id: true, title: true, company: true, location: true } },
} satisfies Prisma.ApplicationSelect;

export function getUserId(req: Express.Request): number {
    const u: any = req.user ?? {};
    const id = Number(u.id ?? u.userId ?? u.sub);
    if (!Number.isFinite(id)) throw new Error("Unauthenticated");;
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

router.put("/me/resume-url", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const { resumeUrl } = ResumeUrlBody.parse(req.body);

        const updated = await prisma.studentProfile.upsert({
            where: { userId },
            create: {
                user: { connect: { id: userId } },
                resumeUrl,
                gender: "PREFER_NOT_TO_SAY",
                ethnicity: ["PREFER_NOT_TO_SAY"],
                optional: [],
            },
            update: { resumeUrl },
            select: { id: true, resumeUrl: true },
        });

        res.json(updated);
    } catch (e) {
        next(e);
    }
});

router.get("/me/experiences", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);

        const experiences = await prisma.experience.findMany({
            where: { student: { id: studentId } },
            orderBy: { startDate: "desc" },
        });
        res.json(experiences);
    } catch (e) {
        next(e);
    }
});

router.post("/me/experiences", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);
        const input = ExperienceCreate.parse(req.body);

        const created = await prisma.experience.create({
            data: {
                ...input,
                student: { connect: { id: studentId } },
            },
            });
        res.status(201).json(created);
    } catch (e) {
        next(e);
    }
});

router.patch("/me/experiences/:experienceId", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);
        const experienceId = Number(req.params.experienceId);
        const input = ExperiencePatch.parse(req.body);

        await prisma.experience.findFirstOrThrow({
            where: { id: experienceId, student: { id: studentId } },
            select: { id: true },
        });

        const updated = await prisma.experience.update({
            where: { id: experienceId },
            data: input,
        });
        res.json(updated);
    } catch (e) {
        next(e);
    }
});

router.delete("/me/experiences/:experienceId", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);
        const experienceId = Number(req.params.experienceId);

        await prisma.experience.findFirstOrThrow({
            where: { id: experienceId, student: { id: studentId } },
            select: { id: true },
        });

        await prisma.experience.delete({ where: { id: experienceId } });
        res.status(204).send();
    } catch (e) {
        next(e);
    }
});

router.get("/me/applications", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);

        const apps = await prisma.application.findMany({
            where: { student: { id: studentId } }, 
            orderBy: [{ id: "desc" }],
            select: {
                id: true,
                status: true,
                job: { select: { id: true, title: true, company: true, location: true } },
            },
        });
        res.json(apps);
    } catch (e) {
        next(e);
    }
});

router.post("/me/applications", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);
        const input = ApplicationCreate.parse(req.body);

        const created = await prisma.application.create({
            data: {
                studentId,
                jobId: input.jobId,
                coverLetter: input.coverLetter ?? null,
            },
            select: appSelect,
        });
        res.status(201).json(created);
    } catch (e) {
        next(e);
    }
});

router.post("/me/applications/:applicationId/withdraw", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);
        const applicationId = Number(req.params.applicationId);

        await prisma.application.findFirstOrThrow({
            where: { id: applicationId, studentId },
            select: { id: true },
        });

        const updated = await prisma.application.update({
            where: { id: applicationId },
            data: { status: ApplicationStatus.PENDING}, //Add a WITHDRAWN state in the prisma files to fix this
            select: { id: true, status: true },
        });
        res.json(updated);
    } catch (e) {
        next(e);
    }
});

router.get("/me/interviews", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);

        const interviews = await prisma.interviewRequest.findMany({
            where: { studentId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                status: true,
                durationMinutes: true,
                note: true,
                chosenStart: true,
                chosenEnd: true,
                createdAt: true,
                job: {
                    select: {
                        id: true,
                        title: true,
                        company: { select: { id: true, name: true } },
                    },
                },
                employer: {
                    select: {
                        id: true,
                        company: { select: { id: true, name: true } },
                    },
                },
            },
        });

        res.json(interviews);
    } catch (e) {
        next(e);
    }
});

// Student responds to interview request
router.patch("/me/interviews/:interviewId/respond", async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const studentId = await getStudentProfileId(userId);
        const interviewId = Number(req.params.interviewId);
        const input = InterviewRespond.parse(req.body);

        if (!Number.isFinite(interviewId)) {
            return res.status(400).json({ error: "Invalid interview ID" });
        }

        const interview = await prisma.interviewRequest.findFirst({
            where: { id: interviewId, studentId },
            select: { id: true, status: true },
        });

        if (!interview) {
            return res.status(404).json({ error: "Interview not found" });
        }

        let data: any = {};

        // Right now we only support decline here.
        if (input.decision === "decline") {
            data.status = InterviewStatus.CANCELLED;
        }

        const updated = await prisma.interviewRequest.update({
            where: { id: interviewId },
            data,
            select: {
                id: true,
                status: true,
                durationMinutes: true,
                note: true,
                chosenStart: true,
                chosenEnd: true,
            },
        });

        res.json(updated);
    } catch (e) {
        next(e);
    }
});


export default router;