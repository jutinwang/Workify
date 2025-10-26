import { z } from "zod";
import * as Prisma from "@prisma/client";

export const Gender = z.nativeEnum(Prisma.$Enums.Gender);
export const Ethnicity = z.nativeEnum(Prisma.$Enums.Ethnicity);
export const IdentityFlag = z.nativeEnum(Prisma.$Enums.IdentityFlag);

export const ExperienceInput = z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    startDate: z.string().datetime().or(z.string().min(1)), 
    endDate: z.string().datetime().or(z.string()).optional(),
    description: z.string().optional(),
});

export const RegisterStudentSchema = z.object({
    // base user fields
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional(),
  
    role: Prisma.$Enums.Role.STUDENT,

    // student-specific
    resumeUrl: z.string().url(),
    linkedInUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
  
    gender: Gender,
    ethnicity: z.array(Ethnicity).nonempty(),
    optional: z.array(IdentityFlag).default([]),
  
    experiences: z.array(ExperienceInput).default([]),
});
  
