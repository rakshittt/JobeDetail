import { execSync } from 'child_process';
import { join } from 'path';

const prismaPath = join(process.cwd(), 'node_modules/.bin/prisma');

try {
  // Generate Prisma Client
  execSync(`${prismaPath} generate`, {
    stdio: 'inherit',
  });
} catch (error) {
  console.error('Error generating Prisma Client:', error);
  // Don't throw error during build
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
    console.warn('Continuing build despite Prisma generation error');
  } else {
    process.exit(1);
  }
} 