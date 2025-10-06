import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { resolve } from "path";

/**
 * Test Setup for E2E Testing with Prod Data
 *
 * This setup assumes you have production data synced to your local postgres.
 * Run `npm run db:sync` to copy production data before running tests.
 *
 */

// Load the same .env file as the main app (backend/.env)
// __dirname is backend/src/tests/helpers, so we go up 3 levels to reach backend/
dotenv.config({ path: resolve(__dirname, "../../../", ".env") });

// Test configuration
export const getTestConfig = () => {
  const requiredEnvVars = ["DATABASE_URL", "DIRECT_URL"];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    database: {
      url: process.env.DATABASE_URL!,
      directUrl: process.env.DIRECT_URL!,
    },
  };
};

// Shared Prisma client for tests
let testPrisma: PrismaClient | null = null;

/**
 * Get or create a Prisma client for testing
 * Reuses the same connection across tests
 */
export const getTestPrisma = async (): Promise<PrismaClient> => {
  if (!testPrisma) {
    testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    await testPrisma.$connect();
  }
  return testPrisma;
};

/**
 * Close the Prisma connection
 * Should be called in afterAll() hooks
 */
export const closeTestPrisma = async (): Promise<void> => {
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }
};

/**
 * Verify database connectivity
 */
export const verifyDatabaseConnection = async (
  prisma: PrismaClient,
): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};
