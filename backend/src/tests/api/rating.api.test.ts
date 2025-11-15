import request from "supertest";
import express, { NextFunction } from "express";
import { createApp } from "../../app";
import { prisma } from "../../services/db";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../helpers/constants";
import { AuthenticatedRequest } from "../../middleware/auth";

jest.mock('../../services/db', () => {
  let idCounter = 1;
  const ratings = new Map<string, any>();
  const userProfiles = new Map<string, any>();

  const clone = (record: any) => (record ? { ...record } : record);
  const matchesWhere = (record: any, where: Record<string, any> = {}) =>
    Object.entries(where).every(([key, value]) => record[key] === value);

  const ratingModel = {
    create: jest.fn(async ({ data }) => {
      const id = data.id ?? `rating-${idCounter++}`;
      const record = { ...data, id };
      ratings.set(id, record);
      return clone(record);
    }),
    createMany: jest.fn(async ({ data }) => {
      data.forEach((item: any) => {
        const id = item.id ?? `rating-${idCounter++}`;
        const record = { ...item, id };
        ratings.set(id, record);
      });
      return { count: data.length };
    }),
    findMany: jest.fn(async ({ where, orderBy }: any = {}) => {
      let results = Array.from(ratings.values());
      if (where) {
        results = results.filter((record) => matchesWhere(record, where));
      }
      if (orderBy?.date === 'desc') {
        results.sort(
          (a, b) =>
            new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
        );
      }
      return results.map(clone);
    }),
    findUnique: jest.fn(async ({ where: { id } }: any) => clone(ratings.get(id) ?? null)),
    deleteMany: jest.fn(async ({ where }: any) => {
      let count = 0;
      for (const [id, record] of Array.from(ratings.entries())) {
        if (!where || matchesWhere(record, where)) {
          ratings.delete(id);
          count += 1;
        }
      }
      return { count };
    }),
    delete: jest.fn(async ({ where: { id } }: any) => {
      const record = ratings.get(id);
      if (!record) {
        const error: any = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      ratings.delete(id);
      return clone(record);
    }),
    update: jest.fn(async ({ where: { id }, data }: any) => {
      const record = ratings.get(id);
      if (!record) {
        const error: any = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      const updated = { ...record, ...data };
      ratings.set(id, updated);
      return clone(updated);
    }),
  };

  const userProfileModel = {
    findUnique: jest.fn(async ({ where: { userId } }: any) =>
      clone(userProfiles.get(userId) ?? null),
    ),
    create: jest.fn(async ({ data }: any) => {
      const record = { ...data };
      userProfiles.set(record.userId, record);
      return clone(record);
    }),
    update: jest.fn(async ({ where: { userId }, data }: any) => {
      const record = userProfiles.get(userId);
      if (!record) {
        const error: any = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      const updated = { ...record, ...data };
      userProfiles.set(userId, updated);
      return clone(updated);
    }),
    delete: jest.fn(async ({ where: { userId } }: any) => {
      const record = userProfiles.get(userId);
      if (!record) {
        const error: any = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      userProfiles.delete(userId);
      return clone(record);
    }),
  };

  return {
    prisma: {
      rating: ratingModel,
      userProfile: userProfileModel,
      $disconnect: jest.fn(async () => {
        ratings.clear();
        userProfiles.clear();
      }),
    },
  };
});

jest.mock('../../middleware/auth', () => ({
  authenticateUser: (req: AuthenticatedRequest, res: any, next: NextFunction) => {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    req.user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'testuser@example.com',
      role: 'USER',
    };
    next();
  },
}));

describe("Ratings API Tests", () => {
  let app: express.Express;
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_MOVIE_ID = "movie-1";

  const generateToken = () => {
    return jwt.sign(
      { id: TEST_USER_ID, email: "testuser@example.com", role: "USER" },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );
  };

  const authHeader = () => ({
    Authorization: `Bearer ${generateToken()}`,
  });

  beforeAll(async () => {
    app = createApp();
    await prisma.rating.deleteMany({ where: { userId: TEST_USER_ID } });
  });

  afterAll(async () => {
    await prisma.rating.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.$disconnect();
  });

  describe("POST /api/ratings", () => {
    it("should create a rating for authenticated user", async () => {
      const payload = {
        movieId: TEST_MOVIE_ID,
        stars: 5,
        comment: "Great movie!",
        tags: ["action", "thriller"],
        votes: 0,
      };

      const res = await request(app)
        .post("/api/ratings")
        .send(payload)
        .set(authHeader())
        .expect(HTTP_STATUS.CREATED)
        .expect("Content-Type", /json/);

      expect(res.body).toHaveProperty("message", "Rating created successfully");
      expect(res.body.rating).toMatchObject({
        userId: TEST_USER_ID,
        movieId: TEST_MOVIE_ID,
        stars: 5,
        comment: "Great movie!",
        tags: ["action", "thriller"],
        votes: 0,
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      const payload = {
        movieId: TEST_MOVIE_ID,
        stars: 4,
        comment: "Nice!",
        votes: 0,
      };

      const res = await request(app)
        .post("/api/ratings")
        .send(payload)
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(res.body).toHaveProperty("message", "User not authenticated");
    });

    it("should return 400 for invalid stars value", async () => {
      const payload = {
        movieId: TEST_MOVIE_ID,
        stars: 10,
        comment: "Invalid stars",
        votes: 0,
      };

      const res = await request(app)
        .post("/api/ratings")
        .send(payload)
        .set(authHeader())
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(res.body).toHaveProperty("message", "Stars must be between 0 and 5");
    });
  });

  describe("GET /api/ratings", () => {
    beforeAll(async () => {
      await prisma.rating.createMany({
        data: [
          {
            id: 'rating-1',
            userId: TEST_USER_ID,
            movieId: "movie-2",
            stars: 4,
            date: new Date(),
            votes: 0, 
          },
          {
            id: 'rating-2',
            userId: TEST_USER_ID,
            movieId: "movie-3",
            stars: 3,
            date: new Date(),
            votes: 0, 
          },
        ],
      });
    });

    afterAll(async () => {
      await prisma.rating.deleteMany({ where: { userId: TEST_USER_ID } });
    });

    it("should return ratings for authenticated user", async () => {
      const res = await request(app)
        .get("/api/ratings")
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty("message");
      expect(res.body.ratings).toBeInstanceOf(Array);
      expect(res.body.ratings.length).toBeGreaterThan(0);
      res.body.ratings.forEach((rating: any) => {
        expect(rating.userId).toBe(TEST_USER_ID);
      });
    });
  });

  describe("DELETE /api/ratings/:id", () => {
    let ratingId: string;

    beforeAll(async () => {
      const rating = await prisma.rating.create({
        data: {
          userId: TEST_USER_ID,
          movieId: "movie-4",
          stars: 2,
          comment: "Not my favorite",
          date: new Date(),
          votes: 0,
        },
      });
      ratingId = rating.id;
    });

    it("should delete a rating for authenticated user", async () => {
      const res = await request(app)
        .delete(`/api/ratings/${ratingId}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty("message", "Rating deleted");

      const deleted = await prisma.rating.findUnique({ where: { id: ratingId } });
      expect(deleted).toBeNull();
    });

    it("should return 404 for non-existent rating", async () => {
      const res = await request(app)
        .delete(`/api/ratings/non-existent-id`)
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(res.body).toHaveProperty("message", "Rating not found");
    });
  });
});
