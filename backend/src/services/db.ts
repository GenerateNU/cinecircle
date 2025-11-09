import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to Local PostgreSQL via Prisma');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
