import { prisma } from "../../services/db";
import { AuthenticatedRequest } from "../../middleware/auth";
import { HTTP_STATUS } from "../helpers/constants";
import { NextFunction } from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../../app";
import express from "express";

jest.mock('../../middleware/auth', () => ({
    authenticateUser: (req: AuthenticatedRequest, res: any, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      req.user = {
        id: TEST_USER_ID,
        email: TEST_USER_EMAIL,
        role: TEST_USER_ROLE,
      };
      next();
    },
  }));
  
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_USER_EMAIL = "testuser@example.com";
  const TEST_USER_ROLE = "USER";
  const FOLLOWED_USER_ID = "123e4567-e89b-12d3-a456-426614174001"; 
  
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

let app: express.Express;

beforeAll(async () => {
  app = createApp();
});


describe("GET /api/feed", () => {
    beforeAll(async () => {
      // Ensure profile exists
      await prisma.userProfile.upsert({
        where: { userId: TEST_USER_ID },
        update: {},
        create: {
          userId: TEST_USER_ID,
          username: "testuser_feed",
          updatedAt: new Date(),
        },
      });
  
      // Follow another user
      await prisma.userProfile.create({
        data: {
          userId: FOLLOWED_USER_ID,
          username: "otheruser",
          updatedAt: new Date(),
        },
      });
  
      await prisma.userFollow.create({
        data: {
          id: "follow-1",
          followerId: TEST_USER_ID,
          followingId: FOLLOWED_USER_ID,
        },
      });
  
      // Create a rating and post from followed user
      await prisma.rating.create({
        data: {
          id: "rating-feed-1",
          userId: FOLLOWED_USER_ID,
          movieId: "movie-10",
          stars: 5,
          date: new Date(),
        },
      });
  
      await prisma.post.create({
        data: {
          id: "post-feed-1",
          userId: FOLLOWED_USER_ID,
          content: "New post from followed user",
          type: "SHORT",
          createdAt: new Date(),
        },
      });
    });
  
    afterAll(async () => {
      await prisma.comment.deleteMany({ where: { userId: TEST_USER_ID } });
      await prisma.post.deleteMany({ where: { userId: FOLLOWED_USER_ID } });
      await prisma.rating.deleteMany({ where: { userId: FOLLOWED_USER_ID } });
      await prisma.userFollow.deleteMany({ where: { followerId: TEST_USER_ID } });
      await prisma.userProfile.deleteMany({
        where: {
          userId: { in: [FOLLOWED_USER_ID, TEST_USER_ID] },
        },
      });
    });
  
    it("should return personalized feed", async () => {
      const res = await request(app)
        .get("/api/feed")
        .set(authHeader())
        .expect(HTTP_STATUS.OK);
  
      expect(res.body).toHaveProperty("message", "Home feed retrieved successfully");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  
    it("should return 401 for unauthenticated request", async () => {
      const res = await request(app)
        .get("/api/feed")
        .expect(HTTP_STATUS.UNAUTHORIZED);
  
      expect(res.body).toHaveProperty("message", "User not authenticated");
    });
  
    it("should return fallback feed if user follows no one", async () => {
      // Clear follows
      await prisma.userFollow.deleteMany({ where: { followerId: TEST_USER_ID } });
  
      const res = await request(app)
        .get("/api/feed")
        .set(authHeader())
        .expect(HTTP_STATUS.OK);
  
      expect(res.body).toHaveProperty("message", "Home feed retrieved successfully");
      expect(res.body.data).toBeInstanceOf(Array);
    });
  });
  