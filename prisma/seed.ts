import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('Please define ADMIN_EMAIL and ADMIN_PASSWORD in your .env file');
  }

  // Hash the admin password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Use `upsert` to create the admin user if it doesn't exist
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      onboardingComplete: true,
    },
    create: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      onboardingComplete: true,
    },
  });

  console.log(`Admin user created/updated: ${admin.email}`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });