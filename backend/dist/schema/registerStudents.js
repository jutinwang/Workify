"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterStudentSchema = exports.ExperienceInput = exports.IdentityFlag = exports.Ethnicity = exports.Gender = void 0;
const zod_1 = require("zod");
exports.Gender = zod_1.z.enum([
    "WOMAN",
    "MAN",
    "NON_BINARY",
    "TWO_SPIRIT",
    "PREFER_NOT_TO_SAY",
]);
exports.Ethnicity = zod_1.z.enum([
    "BLACK",
    "EAST_ASIAN",
    "SOUTH_ASIAN",
    "SOUTHEAST_ASIAN",
    "MENA",
    "LATINX",
    "WHITE",
    "MIXED",
    "PREFER_NOT_TO_SAY",
]);
exports.IdentityFlag = zod_1.z.enum([
    "INDIGENOUS",
    "DISABILITY",
    "VETERAN",
]);
exports.ExperienceInput = zod_1.z.object({
    title: zod_1.z.string().min(1),
    company: zod_1.z.string().min(1),
    startDate: zod_1.z.string().datetime().or(zod_1.z.string().min(1)), // accept ISO string
    endDate: zod_1.z.string().datetime().or(zod_1.z.string()).optional(),
    description: zod_1.z.string().optional(),
});
exports.RegisterStudentSchema = zod_1.z.object({
    // base user fields
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().optional(),
    // role will be forced to STUDENT in handler (or you can allow and validate)
    role: zod_1.z.literal("STUDENT").optional(),
    // student-specific
    resumeUrl: zod_1.z.string().url(),
    linkedInUrl: zod_1.z.string().url().optional(),
    githubUrl: zod_1.z.string().url().optional(),
    gender: exports.Gender,
    ethnicity: zod_1.z.array(exports.Ethnicity).nonempty(), // at least one
    optional: zod_1.z.array(exports.IdentityFlag).default([]), // zero or more
    experiences: zod_1.z.array(exports.ExperienceInput).default([]),
});
