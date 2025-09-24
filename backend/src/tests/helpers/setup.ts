import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import { resolve } from 'path';
import routes from '../../routes/index';

// Load the same .env file as the main app
dotenv.config({ path: resolve(__dirname, '../../../../', '.env') });

// Test configuration
export const getTestConfig = () => {
  const requiredEnvVars = ['DATABASE_URL', 'DIRECT_URL', 'PORT'];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    server: { port: process.env.PORT! },
    database: {
      url: process.env.DATABASE_URL!,
      directUrl: process.env.DIRECT_URL!,
    },
    auth: { jwtSecret: process.env.JWT_SECRET_KEY || 'test_jwt_secret' },
  };
};

// Database utilities - properly reset test data
export const resetTestDatabase = async (
  prisma: PrismaClient
): Promise<void> => {
  try {
    console.log('Resetting test database...');

    // Clear all test data
    await prisma.health.deleteMany({});

    console.log('Database reset complete');
  } catch (error) {
    console.error('Error resetting test database:', error);
    throw error;
  }
};

// Database seeding
export const seedTestDatabase = async (prisma: PrismaClient): Promise<void> => {
  try {
    console.log('Starting database seeding...');

    // Seed basic health records for testing
    await prisma.health.createMany({
      data: [
        {
          ex_col: {
            status: 'healthy',
            component: 'api',
            message: 'System is running normally',
            timestamp: new Date().toISOString(),
          },
        },
        {
          ex_col: {
            status: 'warning',
            component: 'database',
            message: 'Minor issues detected',
            timestamp: new Date().toISOString(),
          },
        },
        {
          ex_col: {
            status: 'healthy',
            component: 'cache',
            message: 'Cache performing well',
            timestamp: new Date().toISOString(),
          },
        },
      ],
    });
    console.log('Seeded health records');

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding test database:', error);
    throw error;
  }
};

// Test utilities
export const createTestHealth = async (
  prisma: PrismaClient,
  data: Partial<any> = {}
): Promise<any> => {
  return await prisma.health.create({
    data: {
      ex_col: data.ex_col || {
        status: 'healthy',
        component: 'test',
        message: 'Test health record',
        timestamp: new Date().toISOString(),
      },
      ...data,
    },
  });
};

export const cleanupTable = async (
  prisma: PrismaClient,
  tableName: string
): Promise<void> => {
  try {
    switch (tableName) {
      case 'health':
        await prisma.health.deleteMany({});
        break;
      default:
        await prisma.$executeRawUnsafe(`DELETE FROM "${tableName}";`);
    }
  } catch (error) {
    console.error(`Error cleaning up table ${tableName}:`, error);
    throw error;
  }
};

// Test app management
let testApp: Express;
let testPrisma: PrismaClient;

/**
 * Initialize and configure the test application
 */
export const startTestApp = async (): Promise<{
  app: Express;
  prisma: PrismaClient;
}> => {
  console.log('Starting test app...');

  if (testApp && testPrisma) {
    console.log('Reusing existing test app');
    return { app: testApp, prisma: testPrisma };
  }

  try {
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

    // Initialize Prisma client for testing
    console.log('Creating Prisma client...');
    testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // Connect to the database
    console.log('Connecting to database...');
    await testPrisma.$connect();
    console.log('Database connected');

    // Reset and seed the database
    console.log('Resetting database...');
    await resetTestDatabase(testPrisma);
    console.log('Seeding database...');
    await seedTestDatabase(testPrisma);
    console.log('Database setup complete');

    // Create Express app
    console.log('Creating Express app...');
    testApp = express();

    // Configure middleware
    testApp.use(cors());
    testApp.use(express.json());

    // Add a test context to make prisma available to routes
    testApp.locals.prisma = testPrisma;

    // Add health check endpoint
    testApp.get('/', (_req, res) => {
      res.json({
        status: 'success',
        message: 'CineCircle test API is running',
        environment: 'test',
      });
    });

    // Register routes
    testApp.use(routes);

    console.log('Test app setup complete');
    return { app: testApp, prisma: testPrisma };
  } catch (error) {
    console.error('Error in startTestApp:', error);
    throw error;
  }
};

/**
 * Clean up test application and database connections
 */
export const stopTestApp = async (): Promise<void> => {
  if (testPrisma) {
    await testPrisma.$disconnect();
  }
};

/**
 * Reset the test database
 */
export const resetTestApp = async (): Promise<void> => {
  if (testPrisma) {
    await resetTestDatabase(testPrisma);
    await seedTestDatabase(testPrisma);
  }
};
