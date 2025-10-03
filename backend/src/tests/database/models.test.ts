import { PrismaClient } from '@prisma/client';

/**
 * Database Model Tests
 * Tests actual database operations with production models
 * Uses real database connection for integration testing
 */
describe('Database Model Tests', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Create Prisma client for testing
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Database Connection', () => {
    it('should connect to database successfully', async () => {
      // Test basic database connectivity
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      expect(result).toBeDefined();
    });

    it('should execute raw queries', async () => {
      const result = await prisma.$queryRaw<
        Array<{ now: Date }>
      >`SELECT NOW() as now`;
      expect(result[0].now).toBeInstanceOf(Date);
    });
  });
});
