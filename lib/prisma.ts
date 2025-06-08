import { PrismaClient } from '@prisma/client';
import { SUBSCRIPTION_PLANS } from './plan';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Handle Prisma connection errors
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error);
  // Don't throw the error during build time
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
    console.warn('Continuing build despite database connection error');
  } else {
    throw error;
  }
});
