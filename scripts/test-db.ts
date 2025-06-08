import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Successfully connected to database');

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);

    // Test creating a test user
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
      },
    });
    console.log('✅ Successfully created test user:', testUser);

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log('✅ Successfully cleaned up test user');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }); 