import request from "supertest";
import express, { NextFunction } from "express";
import { createApp } from "../../app"; 
import { prisma } from "../../services/db";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../helpers/constants";
import { AuthenticatedRequest } from "../../middleware/auth";

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
  
describe("User Profile API Tests", () => {
  let app: express.Express;
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_USER_EMAIL = "testuser@example.com";
  const TEST_USER_ROLE = "USER";

  const generateToken = () => {
    return jwt.sign(
      { id: TEST_USER_ID, email: TEST_USER_EMAIL, role: TEST_USER_ROLE },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );
  };

  const authHeader = () => ({
    Authorization: `Bearer ${generateToken()}`,
  });

  beforeAll(async () => {
    app = createApp();
    await prisma.userProfile.deleteMany({ where: { userId: TEST_USER_ID } });
  });

  afterAll(async () => {
    await prisma.userProfile.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.$disconnect();
  });

  describe("GET /api/user/profile", () => {
    const test_profile = {
            userId: TEST_USER_ID,
            username: "initialuser",
            primaryLanguage: "English",
            secondaryLanguage: ["Hindi", "Spanish"],
            country: "USA",
            city: "Boston",
            favoriteGenres: ["Action", "Comedy"],
            updatedAt: new Date(),
          };

      it("should return user profile for authenticated user", async () => {
        // Ensure user profile exists
        await prisma.userProfile.create({
          data: test_profile
        });
  
        const res = await request(app)
          .get("/api/user/profile")
          .set(authHeader())
          .expect(HTTP_STATUS.OK)
          .expect("Content-Type", /json/);

        // Check profile fields
        expect(res.body.userProfile).toHaveProperty("username");
        expect(res.body.userProfile).toHaveProperty("primaryLanguage");
        expect(res.body.userProfile).toHaveProperty("secondaryLanguage");
        expect(res.body.userProfile).toHaveProperty("country");
        expect(res.body.userProfile).toHaveProperty("city");
        expect(res.body.userProfile).toHaveProperty("favoriteGenres");

        // Check field contents
        expect(res.body.userProfile).toMatchObject({
            userId: TEST_USER_ID,
            username: "initialuser",
            primaryLanguage: "English",
            secondaryLanguage: ["Hindi", "Spanish"],
            country: "USA",
            city: "Boston",
            favoriteGenres: ["Action", "Comedy"],
        })
      });
  });

  describe("ensureUserProfile Middleware", () => {
    beforeEach(async () => {
      // Clean up before each test
      await prisma.userProfile.deleteMany({ where: { userId: TEST_USER_ID } });
    });

    afterEach(async () => {
      // Clean up after each test
      await prisma.userProfile.deleteMany({ where: { userId: TEST_USER_ID } });
    });

    it("should create a minimal profile if one does not exist", async () => {
      // Verify no profile exists
      const beforeProfile = await prisma.userProfile.findUnique({
        where: { userId: TEST_USER_ID },
      });
      expect(beforeProfile).toBeNull();

      // Make any authenticated request to trigger ensureUserProfile
      await request(app)
        .get("/api/user/profile")
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      // Verify profile was created
      const afterProfile = await prisma.userProfile.findUnique({
        where: { userId: TEST_USER_ID },
      });

      expect(afterProfile).not.toBeNull();
      expect(afterProfile?.userId).toBe(TEST_USER_ID);
      expect(afterProfile?.onboardingCompleted).toBe(false);
      expect(afterProfile?.username).toBeNull();
      expect(afterProfile?.country).toBeNull();
      expect(afterProfile?.city).toBeNull();
      expect(afterProfile?.profilePicture).toBeNull();
    });

    it("should not create a profile if one already exists", async () => {
      // Create an existing profile
      const existingProfile = await prisma.userProfile.create({
        data: {
          userId: TEST_USER_ID,
          username: "existinguser",
          onboardingCompleted: true,
          country: "Canada",
          city: "Toronto",
        },
      });

      // Make an authenticated request
      await request(app)
        .get("/api/user/profile")
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      // Verify profile was not modified
      const afterProfile = await prisma.userProfile.findUnique({
        where: { userId: TEST_USER_ID },
      });

      expect(afterProfile?.username).toBe("existinguser");
      expect(afterProfile?.onboardingCompleted).toBe(true);
      expect(afterProfile?.country).toBe("Canada");
      expect(afterProfile?.city).toBe("Toronto");
      expect(afterProfile?.createdAt).toEqual(existingProfile.createdAt);
    });

    it("should return 401 if user is not authenticated", async () => {
      const res = await request(app)
        .get("/api/user/profile")
        // No auth header
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(res.body).toHaveProperty("message", "User not authenticated");

      // Verify no profile was created
      const profile = await prisma.userProfile.findUnique({
        where: { userId: TEST_USER_ID },
      });
      expect(profile).toBeNull();
    });

    it("should allow subsequent requests to access the minimal profile", async () => {
      // First request creates minimal profile
      await request(app)
        .get("/api/user/profile")
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      // Second request should work with existing profile
      const res = await request(app)
        .get("/api/user/profile")
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body.userProfile).toMatchObject({
        userId: TEST_USER_ID,
        onboardingCompleted: false,
        username: null,
      });
    });

    it("should create profile before allowing profile updates", async () => {
      // Verify no profile exists
      const beforeProfile = await prisma.userProfile.findUnique({
        where: { userId: TEST_USER_ID },
      });
      expect(beforeProfile).toBeNull();

      // Try to update profile (should trigger ensureUserProfile first)
      const res = await request(app)
        .put("/api/user/profile")
        .set(authHeader())
        .send({
          username: "newuser",
          country: "USA",
          onboardingCompleted: true,
        })
        .expect(HTTP_STATUS.OK);

      // Verify profile was created and updated
      expect(res.body.data).toMatchObject({
        username: "newuser",
        country: "USA",
        onboardingCompleted: true,
      });

      // Verify in database
      const afterProfile = await prisma.userProfile.findUnique({
        where: { userId: TEST_USER_ID },
      });
      expect(afterProfile?.username).toBe("newuser");
      expect(afterProfile?.onboardingCompleted).toBe(true);
    });
  });

  describe("PUT /api/user/profile", () => {

    it("should update user profile fields", async () => {
      const payload = {
        userId: TEST_USER_ID,
        username: "updateduser",
        secondaryLanguage: ["en", "fr"],
        favoriteGenres: ["sci-fi", "comedy"],
        favoriteMovies: ["Inception", "The Matrix"],
      };

      const res = await request(app)
        .put("/api/user/profile")
        .send(payload)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty("message", "Profile updated");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toMatchObject(payload);
    });
  });

  describe("DELETE /api/user/profile", () => {

    it("should delete the user profile", async () => {
      const res = await request(app)
        .delete("/api/user/profile")
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty("message", "User profile deleted");

      const deleted = await prisma.userProfile.findUnique({
        where: { userId: TEST_USER_ID },
      });

      expect(deleted).toBeNull();
    });
  });

  describe("GET /api/user/ratings", () => {
    beforeAll(async () => {
        await prisma.userProfile.create({
          data: {
            userId: TEST_USER_ID,
            username: "testuser",
            updatedAt: new Date(), // Add updatedAt
          },
        });
      
        await prisma.rating.createMany({
          data: [
            {
              id: 'rating-1',
              userId: TEST_USER_ID,
              movieId: "movie-1",
              stars: 4,
              date: new Date(),
            },
            {
              id: 'rating-2',
              userId: TEST_USER_ID,
              movieId: "movie-2",
              stars: 5,
              date: new Date(),
            },
          ],
        });
      });
      

    afterAll(async () => {
      await prisma.rating.deleteMany({
        where: { userId: TEST_USER_ID },
      });
    });

    it("should return ratings for the user", async () => {
      const res = await request(app)
        .get(`/api/user/ratings?user_id=${TEST_USER_ID}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty("message", "User ratings retrieved");
      expect(res.body.ratings).toBeInstanceOf(Array);
      expect(res.body.ratings.length).toBeGreaterThan(0);
    });

    it("should return 400 for missing user_id", async () => {
      const res = await request(app)
        .get(`/api/user/ratings`)
        .set(authHeader())
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(res.body).toHaveProperty("message", "Missing or invalid 'user_id' parameter");
    });
  });

  describe("GET /api/user/comments", () => {
    beforeAll(async () => {
        await prisma.userProfile.upsert({
            where: { userId: TEST_USER_ID },
            update: {},
            create: {
              userId: TEST_USER_ID,
              username: "testuser",
              updatedAt: new Date(), // Add updatedAt
            },
          });
      
        // Create a post
        const post = await prisma.post.create({
          data: {
            id: 'post-1',
            userId: TEST_USER_ID,
            content: 'Test content',
            type: 'SHORT',
          },
        });
      
        // Create a rating
        const rating = await prisma.rating.create({
          data: {
            id: 'rating-comment-1',
            userId: TEST_USER_ID,
            movieId: "movie-1",
            stars: 5,
            date: new Date(),
          },
        });
      
        // Create comments
        await prisma.comment.createMany({
          data: [
            {
              id: 'comment-1',
              userId: TEST_USER_ID,
              ratingId: rating.id,
              postId: post.id,
              content: 'Awesome!',
              createdAt: new Date(),
            },
            {
              id: 'comment-2',
              userId: TEST_USER_ID,
              ratingId: rating.id,
              postId: post.id,
              content: 'Loved it!',
              createdAt: new Date(),
            },
          ],
        });
      });
      

    afterAll(async () => {
      await prisma.comment.deleteMany({ where: { userId: TEST_USER_ID } });
      await prisma.rating.deleteMany({ where: { userId: TEST_USER_ID } });
      await prisma.post.deleteMany({ where: { id: 'post-1' } });
    });

    it("should return comments for the user", async () => {
      const res = await request(app)
        .get(`/api/user/comments?user_id=${TEST_USER_ID}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty("message", "User comments retrieved");
      expect(res.body.comments).toBeInstanceOf(Array);
      expect(res.body.comments.length).toBeGreaterThan(0);
    });

    it("should return 400 for missing user_id", async () => {
      const res = await request(app)
        .get(`/api/user/comments`)
        .set(authHeader())
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(res.body).toHaveProperty("message", "Missing or invalid 'user_id' parameter");
    });
  });

});
jest.mock('../../services/db', () => {
  const userProfiles = new Map<string, any>();
  const ratings = new Map<string, any>();
  const comments = new Map<string, any>();
  const posts = new Map<string, any>();

  const clone = (record: any) => (record ? structuredClone(record) : record);
  const matchesWhere = (record: any, where: Record<string, any> = {}) =>
    Object.entries(where).every(([key, value]) => {
      if (value && typeof value === 'object' && 'in' in value) {
        return value.in.includes(record[key]);
      }
      return record[key] === value;
    });

  const userProfileModel = {
    deleteMany: jest.fn(async ({ where }: any = {}) => {
      let count = 0;
      for (const [userId, profile] of Array.from(userProfiles.entries())) {
        if (!where || matchesWhere(profile, where)) {
          userProfiles.delete(userId);
          count += 1;
        }
      }
      return { count };
    }),
    create: jest.fn(async ({ data }: any) => {
      userProfiles.set(data.userId, { ...data });
      return clone(userProfiles.get(data.userId));
    }),
    findUnique: jest.fn(async ({ where: { userId } }: any) =>
      clone(userProfiles.get(userId) ?? null),
    ),
    update: jest.fn(async ({ where: { userId }, data }: any) => {
      const existing = userProfiles.get(userId);
      if (!existing) {
        const error: any = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      const updated = { ...existing, ...data };
      userProfiles.set(userId, updated);
      return clone(updated);
    }),
    delete: jest.fn(async ({ where: { userId } }: any) => {
      const existing = userProfiles.get(userId);
      if (!existing) {
        const error: any = new Error('Record not found');
        error.code = 'P2025';
        throw error;
      }
      userProfiles.delete(userId);
      return clone(existing);
    }),
    upsert: jest.fn(async ({ where: { userId }, create, update }: any) => {
      const existing = userProfiles.get(userId);
      if (existing) {
        const updated = { ...existing, ...update };
        userProfiles.set(userId, updated);
        return clone(updated);
      }
      userProfiles.set(userId, { ...create });
      return clone(userProfiles.get(userId));
    }),
  };

  const ratingModel = {
    createMany: jest.fn(async ({ data }: any) => {
      data.forEach((item: any) => {
        const id = item.id ?? `rating-${crypto.randomUUID()}`;
        ratings.set(id, { ...item, id });
      });
      return { count: data.length };
    }),
    create: jest.fn(async ({ data }: any) => {
      const id = data.id ?? `rating-${crypto.randomUUID()}`;
      ratings.set(id, { ...data, id });
      return clone(ratings.get(id));
    }),
    deleteMany: jest.fn(async ({ where }: any = {}) => {
      let count = 0;
      for (const [id, record] of Array.from(ratings.entries())) {
        if (!where || matchesWhere(record, where)) {
          ratings.delete(id);
          count += 1;
        }
      }
      return { count };
    }),
    findMany: jest.fn(async ({ where, orderBy, include }: any = {}) => {
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
      return results.map((record) => {
        const base = { ...record };
        if (include?.Comment) {
          base.Comment = Array.from(comments.values())
            .filter((comment) => comment.ratingId === record.id)
            .map(clone);
        }
        return base;
      });
    }),
  };

  const commentModel = {
    createMany: jest.fn(async ({ data }: any) => {
      data.forEach((item: any) => {
        const id = item.id ?? `comment-${crypto.randomUUID()}`;
        comments.set(id, { ...item, id });
      });
      return { count: data.length };
    }),
    deleteMany: jest.fn(async ({ where }: any = {}) => {
      let count = 0;
      for (const [id, record] of Array.from(comments.entries())) {
        if (!where || matchesWhere(record, where)) {
          comments.delete(id);
          count += 1;
        }
      }
      return { count };
    }),
    findMany: jest.fn(async ({ where, orderBy, include }: any = {}) => {
      let results = Array.from(comments.values());
      if (where) {
        results = results.filter((record) => matchesWhere(record, where));
      }
      if (orderBy?.createdAt === 'desc') {
        results.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        );
      }
      return results.map((record) => {
        const base = { ...record };
        if (include?.Rating) {
          base.Rating = clone(ratings.get(record.ratingId) ?? null);
        }
        if (include?.Post) {
          base.Post = clone(posts.get(record.postId) ?? null);
        }
        return base;
      });
    }),
  };

  const postModel = {
    create: jest.fn(async ({ data }: any) => {
      const id = data.id ?? `post-${crypto.randomUUID()}`;
      posts.set(id, { ...data, id });
      return clone(posts.get(id));
    }),
    deleteMany: jest.fn(async ({ where }: any = {}) => {
      let count = 0;
      for (const [id, record] of Array.from(posts.entries())) {
        if (!where || matchesWhere(record, where)) {
          posts.delete(id);
          count += 1;
        }
      }
      return { count };
    }),
  };

  return {
    prisma: {
      userProfile: userProfileModel,
      rating: ratingModel,
      comment: commentModel,
      post: postModel,
      $disconnect: jest.fn(async () => {
        userProfiles.clear();
        ratings.clear();
        comments.clear();
        posts.clear();
      }),
    },
  };
});
