import { PrismaClient } from '@prisma/client';

// Use globalThis instead of global
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Create an async function to handle the raw SQL query
async function resetAutoIncrement() {
  await prisma.$executeRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
}

// Call the function to reset auto-increment
if (process.env.NODE_ENV === 'development') {
  resetAutoIncrement().catch((e) => {
    console.error('Failed to reset auto-increment:', e);
  });
}

export default prisma;
