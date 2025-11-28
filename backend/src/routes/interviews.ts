import { Router } from "express";
import { PrismaClient, Role, InterviewStatus } from "@prisma/client";
import { requireAuth, requireRole } from "../middleware/requireAuth";
import { BusyEvent, Slot, computeProposedSlotsFromBusy } from "../lib/interviewSlots";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

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

function getUserId(req: any): number {
    const sub = req.user?.sub;
    const id = Number(sub);
    if (!Number.isFinite(id)) {
        throw new Error("Unauthenticated");
    }
    return id;
}

function toLocalISOStringHelper(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

function parseAsLocalTime(dateStr: string): Date {
    // Remove 'Z' suffix if present to prevent UTC interpretation
    const cleanStr = dateStr.replace('Z', '');
    
    // Parse the datetime components
    const match = cleanStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    if (!match) {
        return new Date(dateStr); // Fallback to default parsing
    }
    
    const [, year, month, day, hour, minute, second] = match;
    return new Date(
        parseInt(year),
        parseInt(month) - 1, // months are 0-indexed
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
    );
}

// Generate slots for the next N days
function generateSlots(
    unavailable: { start: string; end: string }[],
    durationMinutes: number,
    daysAhead = 14
): { id: string; start: string; end: string }[] {
    const slots: { id: string; start: string; end: string }[] = [];

    const now = new Date();
    const startHour = 9;
    const endHour = 17;

    // Parse unavailable ranges - treat as local time, not UTC
    const unavailableRanges = unavailable
        .map((e) => {
            // Parse as local time by removing 'Z' if present or parsing carefully
            const s = parseAsLocalTime(e.start);
            const eEnd = parseAsLocalTime(e.end);
            if (Number.isNaN(s.getTime()) || Number.isNaN(eEnd.getTime())) return null;
            return { start: s, end: eEnd };
        })
        .filter(Boolean) as { start: Date; end: Date }[];


    for (let d = 0; d < daysAhead; d++) {
        const day = new Date(now);
        day.setDate(day.getDate() + d);

        // Skip weekends
        const dayOfWeek = day.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        // Set day boundaries using local time
        const dayStart = new Date(day);
        dayStart.setHours(startHour, 0, 0, 0);

        const dayEnd = new Date(day);
        dayEnd.setHours(endHour, 0, 0, 0);

        // Skip if entire day is in the past
        if (dayEnd <= now) continue;

        // Adjust start time if day is today
        const effectiveStart = new Date(Math.max(dayStart.getTime(), now.getTime()));

        // Get unavailable periods for this day
        const dayUnavailable = unavailableRanges
            .filter((u) => overlaps(effectiveStart, dayEnd, u.start, u.end))
            .map((u) => ({
                start: new Date(Math.max(u.start.getTime(), effectiveStart.getTime())),
                end: new Date(Math.min(u.end.getTime(), dayEnd.getTime())),
            }))
            .sort((a, b) => a.start.getTime() - b.start.getTime());

        // Merge overlapping unavailable periods
        const merged: { start: Date; end: Date }[] = [];
        for (const period of dayUnavailable) {
            if (merged.length === 0) {
                merged.push({ ...period });
            } else {
                const last = merged[merged.length - 1];
                if (period.start <= last.end) {
                    last.end = new Date(Math.max(last.end.getTime(), period.end.getTime()));
                } else {
                    merged.push({ ...period });
                }
            }
        }

        // Generate available intervals between unavailable periods
        const availableIntervals: { start: Date; end: Date }[] = [];
        let currentStart = effectiveStart;

        for (const busy of merged) {
            if (currentStart < busy.start) {
                availableIntervals.push({
                    start: currentStart,
                    end: busy.start,
                });
            }
            currentStart = busy.end;
        }

        // Add remaining time until end of day if available
        if (currentStart < dayEnd) {
            availableIntervals.push({
                start: currentStart,
                end: dayEnd,
            });
        }

        // Generate slots from available intervals
        for (const interval of availableIntervals) {
            let slotStart = new Date(interval.start);

            // Round up to next minute boundary
            if (slotStart.getSeconds() > 0 || slotStart.getMilliseconds() > 0) {
                slotStart = new Date(slotStart);
                slotStart.setMinutes(slotStart.getMinutes() + 1);
                slotStart.setSeconds(0, 0);
            }

            while (slotStart < interval.end) {
                const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

                // Check if slot fits in the interval
                if (slotEnd > interval.end) break;

                // Use local ISO string (no Z suffix)
                const startStr = toLocalISOStringHelper(slotStart);
                const endStr = toLocalISOStringHelper(slotEnd);
                const id = `${startStr}__${endStr}`;
                slots.push({
                    id,
                    start: startStr,
                    end: endStr,
                });

                // Move to next slot
                slotStart = new Date(slotEnd);
            }
        }
    }

    return slots;
}

// Helper function
function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
    return aStart < bEnd && bStart < aEnd;
}

const CreateInterviewRequestBody = z.object({
    jobId: z.number().int().positive(),
    studentId: z.number().int().positive(),
    durationMinutes: z.number().int().positive().max(240),
    note: z.string().max(5000).optional(),
});

const InterviewCreate = z.object({
    jobId: z.number().int().positive(), 
    studentId: z.number().int().positive(),
    durationMinutes: z.number().int().positive().max(240), 
    note: z.string().max(5000).optional(),
});

const SelectSlotBody = z.object({
    slotId: z.string().min(1),
});

// employer creates an interview request 

router.post("/", requireAuth, requireRole(Role.EMPLOYER),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const employerId = await getEmployerProfileId(userId);
            const input = InterviewCreate.parse(req.body);

            const student = await prisma.studentProfile.findUnique({
                where: { id: input.studentId },
                select: { id: true, userId: true },
            });

            if (!student) {
                return res.status(404).json({ error: "Student profile not found" });
            }

            // Optional: if jobId is provided, verify it belongs to this employer
            let jobSelect: any = null;
            if (input.jobId) {
                const job = await prisma.job.findFirst({
                    where: { id: input.jobId, employerId },
                    select: { id: true, title: true, companyId: true },
                });

                if (!job) {
                    return res.status(404).json({ error: "Job not found or you don't have access" });
                }
                jobSelect = job;
            }

            const interview = await prisma.interviewRequest.create({
                data: {
                    studentId: input.studentId,
                    employerId,
                    jobId: input.jobId ?? null,
                    durationMinutes: input.durationMinutes,
                    note: input.note ?? null,
                    status: InterviewStatus.PENDING,
                },
                select: {
                    id: true,
                    status: true,
                    durationMinutes: true,
                    note: true,
                    createdAt: true,
                    job: {
                        select: {
                            id: true,
                            title: true,
                            location: true,
                            company: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                    student: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });

            return res.status(201).json({ interview });
        } catch (e: any) {
        if (e?.name === "ZodError") {
            return res
            .status(400)
            .json({ error: "Invalid input", issues: e.issues });
        }
        if (e?.status === 404) {
            return res.status(404).json({ error: e.message });
        }
        next(e);
        }
    }
);

router.get("/student/interviews/:interviewId/slots", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const interviewId = Number(req.params.interviewId);

            if (!Number.isFinite(interviewId)) {
                return res.status(400).json({ error: "Invalid interview ID" });
            }

            const interview = await prisma.interviewRequest.findFirst({
                where: { id: interviewId, student: { userId } },
                select: {
                    id: true,
                    employerId: true,
                    status: true,
                    durationMinutes: true,
                },
            });

            if (!interview) {
                return res.status(404).json({ error: "Interview not found" });
            }

            if (!interview.durationMinutes) {
                return res.status(400).json({ error: "Interview duration is not set by employer." });
            }

            const employer = await prisma.employerProfile.findUnique({
                where: { id: interview.employerId },
                select: { unavailableTimes: true },
            });

            let unavailable = (employer?.unavailableTimes as any[]) || [];
            
            // Normalize unavailable times
            unavailable = unavailable.map((event: any) => {
                let start = event.start;
                let end = event.end;

                // convert UTC to local
                if (typeof start === 'string' && (start.includes('Z') || start.includes('.'))) {
                    const d = new Date(start);
                    start = toLocalISOStringHelper(d);
                }
                if (typeof end === 'string' && (end.includes('Z') || end.includes('.'))) {
                    const d = new Date(end);
                    end = toLocalISOStringHelper(d);
                }

                return { start, end };
            });

            console.log("convert")
            console.log(unavailable)

            console.log('Normalized unavailable times:', unavailable);

            const slots = generateSlots(unavailable, interview.durationMinutes);

            return res.json({ slots });
        } catch (e) {
            next(e);
        }
    }
);

router.patch("/student/interviews/:interviewId/select-slot", requireAuth, requireRole(Role.STUDENT),
    async (req, res, next) => {
        try {
            const userId = getUserId(req);
            const interviewId = Number(req.params.interviewId);

            if (!Number.isFinite(interviewId)) {
                return res.status(400).json({ error: "Invalid interview ID" });
            }

            const { slotId } = req.body as { slotId?: string };

            if (!slotId) {
                return res.status(400).json({ error: "slotId is required" });
            }

            const interview = await prisma.interviewRequest.findFirst({
                where: { id: interviewId, student: { userId } },
                select: {
                    id: true,
                    employerId: true,
                    durationMinutes: true,
                },
            });

            if (!interview) {
                return res.status(404).json({ error: "Interview not found" });
            }

            if (!interview.durationMinutes) {
                return res.status(400).json({ error: "Interview duration is not set by employer." });
            }

            const employer = await prisma.employerProfile.findUnique({
                where: { id: interview.employerId },
                select: { unavailableTimes: true },
            });

            const unavailable = (employer?.unavailableTimes as any[]) || [];

            // regenerate slots and find the one chosen
            const slots = generateSlots(unavailable, interview.durationMinutes);

            const chosen = slots.find((s) => s.id === slotId);
            if (!chosen) {
                return res.status(400).json({ error: "Selected slot is no longer available. Please refresh and pick another time." });
            }

            const chosenStart = new Date(chosen.start);
            const chosenEnd = new Date(chosen.end);

            const updated = await prisma.interviewRequest.update({
                where: { id: interviewId },
                data: {
                    status: InterviewStatus.SCHEDULED,
                    chosenStart,
                    chosenEnd,
                },
                select: {
                    id: true,
                    status: true,
                    chosenStart: true,
                    chosenEnd: true,
                },
            });

            return res.json(updated);
        } catch (e) {
            next(e);
        }
    }
);

export default router;