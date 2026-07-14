import { PrismaClient } from '@smart-work-tracking/database';
import { env } from '../config/env';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: env.DATABASE_URL
      ? { db: { url: env.DATABASE_URL } }
      : undefined,
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function checkDatabaseConnection(): Promise<'up' | 'down' | 'skipped'> {
  if (!env.DATABASE_URL) {
    return 'skipped';
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'up';
  } catch {
    return 'down';
  }
}
