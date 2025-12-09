// ============================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const JOB_TITLES = [
    "Software Engineer Co-op",
    "Backend Developer Co-op",
    "Data Analyst Co-op",
    "UX Designer Co-op",
    "Full Stack Developer Co-op",
    "Frontend Developer Co-op",
    "Mobile Developer Co-op",
    "DevOps Engineer Co-op",
    "QA Engineer Co-op",
    "Machine Learning Engineer Co-op",
    "Cloud Engineer Co-op",
    "Security Engineer Co-op",
    "Database Administrator Co-op",
    "Site Reliability Engineer Co-op",
    "Game Developer Co-op",
    "AI Research Co-op",
    "Data Engineer Co-op",
    "Solutions Architect Co-op",
    "Platform Engineer Co-op",
    "Embedded Systems Developer Co-op",
    "Automation Engineer Co-op",
    "API Developer Co-op",
    "UI/UX Engineer Co-op",
    "Software Test Engineer Co-op",
    "Infrastructure Engineer Co-op"
];

const JOB_LOCATIONS = [
    "Remote",
    "Ottawa, ON",
    "Toronto, ON",
    "Montreal, QC",
    "Vancouver, BC",
    "Calgary, AB",
    "Waterloo, ON",
    "Mississauga, ON",
    "Edmonton, AB",
    "Winnipeg, MB",
    "Halifax, NS",
    "Kitchener, ON",
    "Markham, ON",
    "Remote",
    "Victoria, BC",
    "Quebec City, QC",
    "Burnaby, BC",
    "Regina, SK",
    "Remote",
    "Kanata, ON",
    "Burlington, ON",
    "Remote",
    "Saskatoon, SK",
    "Gatineau, QC",
    "Remote"
];

const JOB_LENGTHS = [
    "4 months",
    "8 months",
    "12 months",
    "16 months",
    "4 months",
    "8 months",
    "4 months",
    "12 months",
    "4 months",
    "8 months",
    "16 months",
    "4 months",
    "12 months",
    "4 months",
    "8 months",
    "4 months",
    "12 months",
    "8 months",
    "4 months",
    "16 months",
    "4 months",
    "8 months",
    "4 months",
    "12 months",
    "4 months"
];

const TAGS = [
    "first co-op friendly",
    "backend",
    "data scientist",
    "react",
    "software engineering",
    "please work",
    "postgresql",
    "database",
    "prisma",
    "hello",
    "ml",
    "react",
    "database",
    "rich text",
    "technology",
    "ai",
    "government",
    "banking & finance",
    "retail & e-commerce",
    "telecommunications",
    "backend developer",
    "cybersecurity analyst",
    "data scientist",
    "healthcare",
    "software developer"
];

async function main() {
    console.log('Starting seed...');

    console.log("Seeding admin...");
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

    console.log("Seeding company...");

    const company = await prisma.company.upsert({
        where: { companyId: "test" },
        update: {},
        create: {
            name: 'Workify Ottawa',
            companyId: "test",
            url: "",
            size: "100-500",
            about: "It's Workify, you know us!",
            careersPage: "",
            linkedInUrl: ""
        }
    });

    console.log('Company created:', {
        id: company.id,
        name: company.name
    });

    console.log("Seeding employers...");

    const hashedPasswordEmployer = await bcrypt.hash("Password123!", 10);

    // Create employer user
    const employerUser1 = await prisma.user.upsert({
        where: { email: "test1@email.com" },
        update: {},
        create: {
            email: "test1@email.com",
            password: hashedPasswordEmployer,
            name: "Alex Smith",
            role: "EMPLOYER",
            employer: {
                create: {
                    companyId: company.id,
                    notificationMethod: "Email",
                    workEmail: "test1@email.com",
                    workPhone: "6137891111",
                    approved: true,
                }
            }
        },
        include: {
            employer: true
        }
    });

    console.log(`Created employer: ${employerUser1.name} (${employerUser1.email})`);

    const employerUser2 = await prisma.user.upsert({
        where: { email: "test2@email.com" },
        update: {},
        create: {
            email: "test2@email.com",
            password: hashedPasswordEmployer,
            name: "Jordan Johnson",
            role: "EMPLOYER",
            employer: {
                create: {
                    companyId: company.id,
                    notificationMethod: "Email",
                    workEmail: "test2@email.com",
                    workPhone: "6137891112",
                    approved: true,
                }
            }
        },
        include: {
            employer: true
        }
    });

    console.log(`Created employer: ${employerUser2.name} (${employerUser2.email})`);

    const employerUser3 = await prisma.user.upsert({
        where: { email: "test3@email.com" },
        update: {},
        create: {
            email: "test3@email.com",
            password: hashedPasswordEmployer,
            name: "Taylor Brown",
            role: "EMPLOYER",
            employer: {
                create: {
                    companyId: company.id,
                    notificationMethod: "Email",
                    workEmail: "test3@email.com",
                    workPhone: "6137891113",
                    approved: true,
                }
            }
        },
        include: {
            employer: true
        }
    });

    console.log(`Created employer: ${employerUser3.name} (${employerUser3.email})`);

    const employerUser4 = await prisma.user.upsert({
        where: { email: "test4@email.com" },
        update: {},
        create: {
            email: "test4@email.com",
            password: hashedPasswordEmployer,
            name: "Morgan Williams",
            role: "EMPLOYER",
            employer: {
                create: {
                    companyId: company.id,
                    notificationMethod: "Email",
                    workEmail: "test4@email.com",
                    workPhone: "6137891114",
                    approved: true,
                }
            }
        },
        include: {
            employer: true
        }
    });

    console.log(`Created employer: ${employerUser4.name} (${employerUser4.email})`);

    const employerUser5 = await prisma.user.upsert({
        where: { email: "test5@email.com" },
        update: {},
        create: {
            email: "test5@email.com",
            password: hashedPasswordEmployer,
            name: "Casey Davis",
            role: "EMPLOYER",
            employer: {
                create: {
                    companyId: company.id,
                    notificationMethod: "Email",
                    workEmail: "test5@email.com",
                    workPhone: "6137891115",
                    approved: true,
                }
            }
        },
        include: {
            employer: true
        }
    });

    console.log(`Created employer: ${employerUser5.name} (${employerUser5.email})`);
    
    console.log("Employer seeding complete!");

    console.log("Seeding job...");

    const employers = [employerUser1, employerUser2, employerUser3, employerUser4, employerUser5]
    for (let i = 0; i < 25; i++) {
        const employerIndex = Math.floor(i / 5);
        const salary = `${50 + (i % 5) * 10}k - ${70 + (i % 5) * 10}k`;
        
        await prisma.job.create({
            data: {
                companyId: company.id,
                employerId: employers[employerIndex].employer!.id,
                description: "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"Exciting opportunity to join our team!\"}]}]",
                title: JOB_TITLES[i],
                location: JOB_LOCATIONS[i],
                salary: `[{\"type\":\"paragraph\",\"children\":[{\"text\":\"${salary}\"}]}]`,
                benefits: "[{\"type\":\"numbered-list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"Competitive Salary\"}]},{\"type\":\"list-item\",\"children\":[{\"text\":\"Health Benefits\"}]}]}]",
                length: JOB_LENGTHS[i],
                qualification: "[{\"type\":\"bulleted-list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"Relevant experience or education\"}]}]}]",
                responsibilities: "[{\"type\":\"bulleted-list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"Collaborate with team members\"}]}]}]",
                tags: {
                    connectOrCreate: {
                        where: { name: TAGS[i] },
                        create: { 
                            name: TAGS[i],
                            displayName: TAGS[i]
                        }
                    }
                }
            }
        });

        console.log(`Created job ${i + 1}/25: ${JOB_TITLES[i]} (Employer ${employerIndex + 1})`);
    }

    console.log("Seeding user...");

    const hashedStudentPassword = await bcrypt.hash('Student123!', 10);
    const StudentUser = await prisma.user.upsert({
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
        },
        include: {
            student: true
        }
    });

    console.log('Student user created:', {
        id: StudentUser.id,
        email: StudentUser.email,
        role: StudentUser.role
    });



    console.log('Seed completed successfully!');
}

main().catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});