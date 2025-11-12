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