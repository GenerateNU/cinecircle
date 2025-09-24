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

  describe('Health Model', () => {
    it('should create and find health records', async () => {
      const testData = {
        status: 'testing',
        component: 'database',
        details: { message: 'Test health check' },
      };

      const health = await prisma.health.create({
        data: {
          ex_col: testData,
        },
      });

      expect(health.id).toBeDefined();
      expect(typeof health.id).toBe('bigint');
      expect(health.ex_col).toEqual(testData);
      expect(health.created_at).toBeInstanceOf(Date);

      // Find health record
      const foundHealth = await prisma.health.findUnique({
        where: { id: health.id },
      });

      expect(foundHealth).toBeDefined();
      expect(foundHealth?.ex_col).toEqual(testData);

      // Cleanup
      await prisma.health.delete({
        where: { id: health.id },
      });
    });

    it('should handle null ex_col', async () => {
      const health = await prisma.health.create({
        data: {},
      });

      expect(health.id).toBeDefined();
      expect(health.ex_col).toBeNull();
      expect(health.created_at).toBeInstanceOf(Date);

      // Cleanup
      await prisma.health.delete({
        where: { id: health.id },
      });
    });
  });

  describe('Complex Operations', () => {
    it('should handle transactions correctly', async () => {
      const uniqueMarker = `transaction-test-${Date.now()}`;

      await prisma.$transaction(async tx => {
        const health1 = await tx.health.create({
          data: {
            ex_col: {
              type: 'transaction_test',
              marker: uniqueMarker,
              index: 1,
            },
          },
        });

        const health2 = await tx.health.create({
          data: {
            ex_col: {
              type: 'transaction_test',
              marker: uniqueMarker,
              index: 2,
            },
          },
        });

        expect(health1.id).toBeDefined();
        expect(health2.id).toBeDefined();

        // Both operations succeed together
        return { health1, health2 };
      });

      // Verify both records exist
      const healthRecords = await prisma.health.findMany({
        where: {
          ex_col: {
            path: ['marker'],
            equals: uniqueMarker,
          },
        },
      });

      expect(healthRecords).toHaveLength(2);

      // Cleanup
      for (const health of healthRecords) {
        await prisma.health.delete({ where: { id: health.id } });
      }
    });

    it('should rollback transactions on error', async () => {
      const uniqueMarker = `rollback-test-${Date.now()}`;

      await expect(
        prisma.$transaction(async tx => {
          await tx.health.create({
            data: {
              ex_col: { type: 'rollback_test', marker: uniqueMarker },
            },
          });

          // Force an error
          throw new Error('Forced transaction error');
        })
      ).rejects.toThrow('Forced transaction error');

      // Verify health record was not created due to rollback
      const healthRecords = await prisma.health.findMany({
        where: {
          ex_col: {
            path: ['marker'],
            equals: uniqueMarker,
          },
        },
      });

      expect(healthRecords).toHaveLength(0);
    });
  });
});
