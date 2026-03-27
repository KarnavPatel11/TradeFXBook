import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@tradefxbook.com' },
    update: {},
    create: {
      email: 'demo@tradefxbook.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      timezone: 'UTC',
      baseCurrency: 'USD',
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // Create demo trading account
  const account = await prisma.tradingAccount.upsert({
    where: { id: 'demo-account-1' },
    update: {},
    create: {
      id: 'demo-account-1',
      userId: user.id,
      nickname: 'Main FTMO 100k',
      platform: 'MT5',
      broker: 'FTMO',
      server: 'FTMO-Server',
      login: '12345678',
      currency: 'USD',
      balance: 105000,
      equity: 105420,
    },
  });

  console.log(`Created trading account with id: ${account.id}`);

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
