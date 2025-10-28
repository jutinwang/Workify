import { Router } from "express";
import { PrismaClient, Role, Gender, Ethnicity, IdentityFlag } from "@prisma/client";
import { signToken } from "../lib/jwt";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();
const router = Router();

const RegisterStudentBody = z.object({
    email: z.string().email().transform(s => s.trim().toLowerCase()),
    password: z.string().min(8),
    name: z.string().min(1),

    major: z.string().optional(),
    year: z.number().int().positive().optional(),
    resumeUrl: z.string().url().optional(),
    linkedInUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    phoneNumber: z.string().optional(),
    transcript: z.string().optional(),
    aboutMe: z.string().optional(),

    gender: z.nativeEnum(Gender).default(Gender.PREFER_NOT_TO_SAY),
    ethnicity: z.array(z.nativeEnum(Ethnicity)).default([]),
    optionalFlags: z.array(z.nativeEnum(IdentityFlag)).default([]),
});


router.post("/students/register", async (req, res, next) => {
    try {
        const input = RegisterStudentBody.parse(req.body);

        // Unique email check
        const exists = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } });

        if (exists) return res.status(409).json({ error: "Email already registered" });

        const hashed = await bcrypt.hash(input.password, 12);

        const user = await prisma.user.create({
            data: {
                email: input.email,
                password: hashed,
                name: input.name,
                role: Role.STUDENT, 

                student: {
                    create: {
                        major: input.major ?? null,
                        year: input.year ?? null,
                        resumeUrl: input.resumeUrl ?? null,
                        linkedInUrl: input.linkedInUrl ?? null,
                        githubUrl: input.githubUrl ?? null,
                        phoneNumber: input.phoneNumber ?? null,
                        transcript: input.transcript ?? null,
                        aboutMe: input.aboutMe ?? null,
                        gender: input.gender,
                        ethnicity: input.ethnicity,
                        optional: input.optionalFlags,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                student: {
                    select: {
                        id: true, major: true, year: true, resumeUrl: true,
                        linkedInUrl: true, githubUrl: true, phoneNumber: true,
                        gender: true, ethnicity: true, optional: true,
                    },
                },
            },
        });

        return res.status(201).json({ user });
    } catch (e: any) {
        if (e?.code === "P2002") return res.status(409).json({ error: "Email already registered" });
        if (e?.name === "ZodError") return res.status(400).json({ error: "Invalid input", issues: e.issues });
        next(e);
    }
});

const LoginBody = z.object({
    email: z.string().email().transform(s => s.trim().toLowerCase()),
    password: z.string().min(1, "Password is required"),
});

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = LoginBody.parse(req.body);

        const INVALID = () => res.status(401).json({ error: "Invalid email or password" });

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                student: {
                    select: {
                        id: true,
                        major: true,
                        year: true,
                        resumeUrl: true,
                        linkedInUrl: true,
                        githubUrl: true,
                        phoneNumber: true,
                        gender: true,
                        ethnicity: true,
                        optional: true,
                    },
                },
            },
        });

        if (!user) return INVALID();

        // Compare password
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return INVALID();

        const token = signToken({
            sub: String(user.id),
            email: user.email,
            role: user.role,
        });

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                student: user.student ?? null,
            },
        });
    } catch (e: any) {
        if (e?.name === "ZodError") {
            return res.status(400).json({ error: "Invalid input", issues: e.issues });
        }
        next(e);
    }
});


export default router;