// ============================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey"];
const LAST_NAMES = ["Smith", "Johnson", "Brown", "Williams", "Davis"];

async function main() {
    console.log('Starting seed...');
    const hashedPassword = await bcrypt.hash('TEJWAB4900', 10);
    
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@workify.ca' },
        update: {},
        create: {
            email: 'admin@workify.ca',
            password: hashedPassword,
            name: 'Admin',
            role: 'ADMIN',
            admin: {
                create: {}
            }
        },
        include: {
            admin: true
        }
    });

    console.log('Admin user created:', {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
    });

    const company = await prisma.company.upsert({
        where: { companyId: "test" },
        update: {},
        create: {
            name: 'Workify Ottawa',
            companyId: "test",
            url: "",
            size: "",
            about: "",
            careersPage: "",
            linkedInUrl: ""
        }
    });

    console.log('Company created:', {
        id: company.id,
        name: company.name
    });

    console.log('Company seed completed successfully!');

    console.log("Seeding employers...");

    for (let i = 0; i < 5; i++) {
        const firstName = FIRST_NAMES[i];
        const lastName = LAST_NAMES[i];

        const email = `test${i}@email.com`;

        const hashedPassword = await bcrypt.hash("Password123!", 10);

        // Create employer user
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {},
            create: {
                email: email,
                password: hashedPassword,
                name: firstName + " " + lastName,
                role: "EMPLOYER",
                employer: {
                    create: {
                        companyId: company.id,
                        notificationMethod: "Email",
                        workEmail: email,
                        workPhone: "6137891111",
                        approved: true,
                    }
                }
            }
        });

        console.log(`Created employer: ${firstName} ${lastName} (${email})`);
    }
    console.log("Employer seeding complete!");

    console.log("Seeding user...");

    const hashedStudentPassword = await bcrypt.hash('Student123!', 10);

    const user = await prisma.user.upsert({
        where: { email: "jgang123@uottawa.ca" },
        update: {},
        create: {
            email: "jgang123@uottawa.ca",
            password: hashedStudentPassword,
            name: "Justin Gang",
            role: "STUDENT",
            student: {
                create: {
                    major: 'Computer Science',
                    year: 4,
                    resumeUrl: "",
                    ethnicity: ["PREFER_NOT_TO_SAY"],
                    gender: "PREFER_NOT_TO_SAY",
                    githubUrl: "",
                    linkedInUrl: "",
                    aboutMe: "4th year computer science student a burn passion for programming and being the best developer I can be",
                    phoneNumber: "6136136161",
                    educations: {
                        create: {
                            program: "Honours Bachelor of Computer Science",
                            yearOfStudy: 4,
                            schoolName: "University of Ottawa"
                        }
                    },
                    experience: {
                        create: {
                            title: "Software Engineer COOP",
                            company: "Palantir",
                            startDate: new Date("2024-05-15T12:00:00Z"),
                            endDate: new Date("2024-08-15T12:00:00Z"),
                            description: "I coded a lot"
                        }
                    },
                }
            }
        }
    });

    console.log("Student seeding complete!");

    console.log('Seed completed successfully!');
}

main().catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});