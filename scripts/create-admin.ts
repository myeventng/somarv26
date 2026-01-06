import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@somarv26.com';
  const password = 'AdminSomarv2026!';

  await prisma.account.deleteMany({ where: { user: { email } } });
  await prisma.user.deleteMany({ where: { email } });

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, name: 'Admin', role: 'admin' },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      accountId: email,
      providerId: 'credential',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin created');
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
