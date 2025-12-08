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
        where: { id: 3 },
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

        const email = `${firstName.toLowerCase()}_${lastName.toLowerCase()}123@workifyOttawa.ca`;

        const hashedPassword = await bcrypt.hash("Password123!", 10);

        // Create employer user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: "EMPLOYER",
            }
        });

        // Create employer profile
        await prisma.employerProfile.create({
            data: {
                userId: user.id,
                companyId: company.id, // Adjust if your PK is companyId instead of id
                approved: true,
                jobTitle: "",
                department: "",
                phoneNumber: "",
                officeLocation: ""
            }
        });

        console.log(`Created employer: ${firstName} ${lastName} (${email})`);
    }

    console.log("Employer seeding complete!");


    console.log('Seed completed successfully!');
}

main().catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});