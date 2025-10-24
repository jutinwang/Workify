import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema
const studentRegistrationSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required'),
    major: z.string().optional(),
    year: z.number().int().min(1).max(6).optional(),
    resumeUrl: z.string().url().optional(),
    linkedInUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    gender: z.enum(['WOMAN', 'MAN', 'NON_BINARY', 'TWO_SPIRIT', 'PREFER_NOT_TO_SAY']),
    ethnicity: z.array(z.enum([
        'BLACK', 'EAST_ASIAN', 'SOUTH_ASIAN', 'SOUTHEAST_ASIAN', 
        'MENA', 'LATINX', 'WHITE', 'MIXED', 'PREFER_NOT_TO_SAY'
    ])).min(1, 'At least one ethnicity must be selected'),
    optional: z.array(z.enum(['INDIGENOUS', 'DISABILITY', 'VETERAN'])).optional().default([])
});

type StudentRegistrationInput = z.infer<typeof studentRegistrationSchema>;

router.post('/register', async (req: Request, res: Response) => {
    try {
        const validatedData: StudentRegistrationInput = studentRegistrationSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email }
        });

        if (existingUser) {
            return res.status(409).json({ 
                error: 'User with this email already exists' 
            });
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                role: 'STUDENT',
                student: {
                create: {
                    major: validatedData.major,
                    year: validatedData.year,
                    resumeUrl: validatedData.resumeUrl,
                    linkedInUrl: validatedData.linkedInUrl,
                    githubUrl: validatedData.githubUrl,
                    gender: validatedData.gender,
                    ethnicity: validatedData.ethnicity,
                    optional: validatedData.optional
                }
                }
            },
            include: {
                student: true
            }
        });

        const { password, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'Student account created successfully',
            user: userWithoutPassword
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: error.issues 
            });
        }

        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Failed to create student account' 
        });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const studentId = parseInt(req.params.id);

        const student = await prisma.user.findUnique({
            where: { 
                id: studentId,
                role: 'STUDENT'
            },
            include: {
                student: {
                include: {
                    Experience: true
                }
                }
            }
        });

        if (!student) {
            return res.status(404).json({ 
                error: 'Student not found' 
            });
        }

        const { password, ...studentWithoutPassword } = student;

        res.json(studentWithoutPassword);

    } catch (error) {
            console.error('Error fetching student:', error);
            res.status(500).json({ 
            error: 'Failed to fetch student profile' 
        });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const studentId = parseInt(req.params.id);

        const updateSchema = studentRegistrationSchema.partial().omit({ 
            email: true, 
            password: true 
        });

        const validatedData = updateSchema.parse(req.body);

        const updatedUser = await prisma.user.update({
            where: { id: studentId },
            data: {
                name: validatedData.name,
                student: {
                update: {
                    major: validatedData.major,
                    year: validatedData.year,
                    resumeUrl: validatedData.resumeUrl,
                    linkedInUrl: validatedData.linkedInUrl,
                    githubUrl: validatedData.githubUrl,
                    gender: validatedData.gender,
                    ethnicity: validatedData.ethnicity,
                    optional: validatedData.optional
                }
                }
            },
            include: {
                student: true
            }
        });

        const { password, ...userWithoutPassword } = updatedUser;

        res.json({
            message: 'Student profile updated successfully',
            user: userWithoutPassword
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: error.issues 
            });
        }

        console.error('Update error:', error);
        res.status(500).json({ 
            error: 'Failed to update student profile' 
        });
    }
});

export default router;