// ============================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');
    const hashedPassword = await bcrypt.hash('TEJWAB4900', 10);
    
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@workify' },
        update: {},
        create: {
            email: 'admin@workify',
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

    console.log('Seed completed successfully!');
}

main().catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});