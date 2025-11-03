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

const RegisterEmployerBody = z.object({
    // user core
    email: z.string().email().transform(s => s.trim().toLowerCase()),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(1, "Name is required"),

    // employer profile optional fields
    workPhone: z.string().optional(),
    workEmail: z.string().email().optional(),
    profilePhotoUrl: z.string().url().optional(),
    notificationMethod: z.string().optional(), 
    availability: z.string().optional(),

    // company linkage (choose one):
    companyId: z.number().int().positive().optional(), 
    companyName: z.string().min(1).optional(), 
    companyUrl: z.string().url().optional(),
    companySize: z.string().optional(),
    companyAbout: z.string().optional(),
    companyCareersPage: z.string().url().optional(),
    companyLinkedInUrl: z.string().url().optional(),
});

router.post("/employers/register", async (req, res, next) => {
    try {
        const input = RegisterEmployerBody.parse(req.body);

        const exists = await prisma.user.findUnique({
            where: { email: input.email },
            select: { id: true },
        });

        if (exists) return res.status(409).json({ error: "Email already registered" });

        const hashed = await bcrypt.hash(input.password, 12);

        let companyConnect:
            | { connect: { id: number } }
            | { connect: { id: number } }
            | undefined;

        if (input.companyId) {
            companyConnect = { connect: { id: input.companyId } };
        } else if (input.companyName) {
            
            // Create a new company row, then connect
            const company = await prisma.company.create({
                data: {
                    name: input.companyName,
                    url: input.companyUrl ?? null,
                    size: input.companySize ?? null,
                    about: input.companyAbout ?? null,
                    careersPage: input.companyCareersPage ?? null,
                    linkedInUrl: input.companyLinkedInUrl ?? null,
                },
                select: { id: true },
            });
            companyConnect = { connect: { id: company.id } };
        }

        const user = await prisma.user.create({
            data: {
                email: input.email,
                password: hashed,
                name: input.name,
                role: Role.EMPLOYER,
                employer: {
                    create: {
                        // attach company if available
                        ...(companyConnect ? { company: companyConnect } : {}),

                        workPhone: input.workPhone ?? null,
                        workEmail: input.workEmail ?? null,
                        profilePhotoUrl: input.profilePhotoUrl ?? null,
                        notificationMethod: input.notificationMethod ?? null,
                        availability: input.availability ?? null,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                employer: {
                    select: {
                        id: true,
                        company: { select: { id: true, name: true, url: true, size: true, linkedInUrl: true } },
                        workPhone: true,
                        workEmail: true,
                        profilePhotoUrl: true,
                        notificationMethod: true,
                        availability: true,
                    },
                },
            },
        });


        let token = signToken({ id: user.id, email: user.email, role: user.role });

        return res.status(201).json({ user, token });
    } catch (e: any) {
        if (e?.code === "P2002") return res.status(409).json({ error: "Email already registered" });
        if (e?.name === "ZodError") return res.status(400).json({ error: "Invalid input", issues: e.issues });
        next(e);
    }
});


export default router;