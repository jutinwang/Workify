import { z } from 'zod';

export const ContactSchema = z.object({
    phoneNumber: z.string().optional(),
    linkedInUrl: z.string().url().optional().or(z.literal('')),
    githubUrl: z.string().url().optional().or(z.literal('')),
    portfolio: z.string().url().optional().or(z.literal('')),
});

export const EducationSchema = z.object({
    program: z.string(),
    yearOfStudy: z.number().int().min(1).max(6).optional(),
    gradDate: z.string().optional(),
    schoolName: z.string(),
});

export const ExperienceSchema = z.object({
    title: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string().optional(),
});

export const FilesSchema = z.object({
    resumeUrl: z.string().url().optional().or(z.literal('')),
    transcript: z.string().url().optional().or(z.literal('')),
    coverLetter: z.string().url().optional().or(z.literal('')),
});

export const DemographicsSchema = z.object({
    gender: z.enum(['WOMAN', 'MAN', 'NON_BINARY', 'TWO_SPIRIT', 'PREFER_NOT_TO_SAY']),
    ethnicity: z.array(z.enum(['BLACK', 'EAST_ASIAN', 'SOUTH_ASIAN', 'SOUTHEAST_ASIAN', 'MENA', 'LATINX', 'WHITE', 'MIXED', 'PREFER_NOT_TO_SAY'])),
    optional: z.array(z.enum(['INDIGENOUS', 'DISABILITY', 'VETERAN'])).optional().default([]),
}).optional();

export const CompleteStudentProfileSchema = z.object({
    contact: ContactSchema,
    education: z.array(EducationSchema).min(1, 'At least one education entry required'),
    experience: z.array(ExperienceSchema).default([]),
    files: FilesSchema,
    aboutMe: z.string().optional(),
    demographics: DemographicsSchema,
    major: z.string().optional(),
    year: z.number().int().min(1).max(6).optional(),
});