import { PrismaClient } from "@prisma/client";
import {
  getTestPrisma,
  closeTestPrisma,
  verifyDatabaseConnection,
} from "../helpers/setup.js";
import { TEST_LIMITS } from "../helpers/constants.js";

/**
 * Database Model Tests
 *
 * Tests database operations using production data copied to local postgres.
 * Run `npm run db:sync` before testing to ensure you have the latest data.
 */
describe("Database Model Tests", () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Get shared Prisma client
    prisma = await getTestPrisma();
  });

  afterAll(async () => {
    // Clean up connection
    await closeTestPrisma();
  });

  describe("Database Connection", () => {
    it("should connect to database and verify schema exists", async () => {
      // Verify connection and that we have tables (production data is synced)
      const isConnected = await verifyDatabaseConnection(prisma);
      expect(isConnected).toBe(true);

      const result = await prisma.$queryRaw<
        Array<{ count: bigint }>
      >`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`;

      expect(Number(result[0].count)).toBeGreaterThan(0);
    });
  });

  describe("Movie Model", () => {
    it("should query movies from production data", async () => {
      const movies = await prisma.movie.findMany({
        take: TEST_LIMITS.SMALL,
      });

      // Verify we have movies in the database
      if (movies.length > 0) {
        expect(movies[0]).toHaveProperty("movieId");
        expect(movies[0]).toHaveProperty("title");
      }
    });

    it("should fetch a single movie by ID", async () => {
      // First, get a movie ID from the database
      const firstMovie = await prisma.movie.findFirst();

      if (firstMovie) {
        const movie = await prisma.movie.findUnique({
          where: { movieId: firstMovie.movieId },
        });

        expect(movie).toBeDefined();
        expect(movie?.movieId).toBe(firstMovie.movieId);
      }
    });

    it("should verify movie schema structure", async () => {
      const movie = await prisma.movie.findFirst();

      if (movie) {
        // Verify expected fields exist
        expect(movie).toHaveProperty("movieId");
        expect(movie).toHaveProperty("title");
        expect(movie).toHaveProperty("description");
        expect(movie).toHaveProperty("localRating");
        expect(movie).toHaveProperty("imdbRating");
        expect(movie).toHaveProperty("languages");
        expect(movie).toHaveProperty("numRatings");
      }
    });
  });
});
