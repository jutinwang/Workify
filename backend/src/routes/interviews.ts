import { Router } from "express";
import { PrismaClient, Role, InterviewStatus } from "@prisma/client";
import { requireAuth, requireRole } from "../middleware/requireAuth";
import { BusyEvent, Slot, computeProposedSlotsFromBusy } from "../lib/interviewSlots";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

function getUserId(req: any): number {
    const sub = req.user?.sub;
    const id = Number(sub);
    if (!Number.isFinite(id)) {
        throw Object.assign(new Error("Unauthenticated"), { status: 401 });
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

const CreateInterviewRequestBody = z.object({
    jobId: z.number().int().positive(),
    studentId: z.number().int().positive(),
    durationMinutes: z.number().int().positive().max(240),
    note: z.string().max(5000).optional(),
});

const SelectSlotBody = z.object({
    slotId: z.string().min(1),
});

// employer creates an interview request 

router.post("/",requireAuth,requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const input = CreateInterviewRequestBody.parse(req.body);

            const job = await prisma.job.findFirst({
                where: { id: input.jobId, employerId },
                select: {
                    id: true,
                    title: true,
                    company: { select: { id: true, name: true } },
                },
            });

            if (!job) {
                return res.status(404).json({ error: "Job not found or you don't have access" });
            }

            const application = await prisma.application.findFirst({
                where: {
                    jobId: input.jobId,
                    studentId: input.studentId,
                },
                select: { id: true },
            });

            const employer = await prisma.employerProfile.findUnique({
                where: { id: employerId },
                select: { unavailableTimes: true },
            });

            const busy = (employer?.unavailableTimes as BusyEvent[]) || [];
            const proposedSlots = computeProposedSlotsFromBusy(busy,input.durationMinutes);

            if (proposedSlots.length === 0) {
                return res.status(400).json({
                    error: "No available slots could be generated with the current availability and duration.",
                });
            }

            const interview = await prisma.interviewRequest.create({
                data: {
                    studentId: input.studentId,
                    employerId,
                    jobId: input.jobId,
                    applicationId: application?.id ?? null,
                    status: InterviewStatus.PENDING,
                    durationMinutes: input.durationMinutes,
                    note: input.note ?? null,
                    availability: busy,
                    proposedSlots,
                },
                select: {
                    id: true,
                    status: true,
                    durationMinutes: true,
                    note: true,
                    proposedSlots: true,
                    createdAt: true,
                    student: {
                        select: {
                            id: true,
                            user: { select: { name: true, email: true } },
                        },
                    },
                    job: {
                        select: {
                            id: true,
                            title: true,
                            company: { select: { id: true, name: true } },
                        },
                    },
                },
            });

            return res.status(201).json({ interview });
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

//studnet gets a single interview request

router.get("/student/interviews/:id",requireAuth,requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const id = Number(req.params.id);

            if (!Number.isFinite(id)) {
                return res.status(400).json({ error: "Invalid interview ID" });
            }

            const interview = await prisma.interviewRequest.findFirst({
                where: { id, studentId },
                select: {
                    id: true,
                    status: true,
                    durationMinutes: true,
                    note: true,
                    proposedSlots: true,
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

            if (!interview) {
                return res.status(404).json({ error: "Interview not found" });
            }

            return res.json({ interview });
        } catch (e: any) {
            if (e?.status === 404) {
                return res.status(404).json({ error: e.message });
            }
            next(e);
        }
    }
);

//student chooses a slot 


router.patch("/student/interviews/:id/select-slot",requireAuth,requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const studentId = await getStudentProfileId(userId);
            const id = Number(req.params.id);
            const input = SelectSlotBody.parse(req.body);

            if (!Number.isFinite(id)) {
                return res.status(400).json({ error: "Invalid interview ID" });
            }

            const interview = await prisma.interviewRequest.findFirst({
                where: { id, studentId },
                select: {
                    id: true,
                    status: true,
                    proposedSlots: true,
                },
            });

            if (!interview) {
                return res.status(404).json({ error: "Interview not found" });
            }

            if (interview.status !== InterviewStatus.PENDING) {
                return res.status(400).json({ error: "Interview is not in a pending state" });
            }

            const slots = (interview.proposedSlots as Slot[]) || [];
            const slot = slots.find((s) => s.id === input.slotId);

            if (!slot) {
                return res.status(400).json({ error: "Invalid slot" });
            }

            const chosenStart = new Date(slot.start);
            const chosenEnd = new Date(slot.end);

            const updated = await prisma.interviewRequest.update({
                where: { id: interview.id },
                data: {
                    chosenStart,
                    chosenEnd,
                    status: InterviewStatus.SCHEDULED,
                },
                select: {
                    id: true,
                    status: true,
                    chosenStart: true,
                    chosenEnd: true,
                    job: {
                        select: {
                            id: true,
                            title: true,
                            company: { select: { id: true, name: true } },
                        },
                    },
                },
            });

            return res.json({ interview: updated });
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

export default router;
