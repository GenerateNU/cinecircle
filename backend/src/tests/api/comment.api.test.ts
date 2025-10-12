import request from "supertest";
import express, { NextFunction } from "express";
import { createApp } from "../../app";
import { prisma } from "../../services/db";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../helpers/constants";
import { AuthenticatedRequest } from "../../middleware/auth";

jest.mock("../../middleware/auth", () => ({
  authenticateUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.user = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      email: "testuser@example.com",
      role: "USER",
    };
    next();
  },
}));

describe("Comment API Tests", () => {
  let app: express.Express;
  const TEST_USER_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_USER_EMAIL = "testuser@example.com";
  const TEST_USER_ROLE = "USER";
  const OTHER_USER_ID = "223e4567-e89b-12d3-a456-426614174001";

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
    await prisma.comment.deleteMany({ where: { userId: TEST_USER_ID } });
  });

  afterAll(async () => {
    await prisma.comment.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.$disconnect();
  });

  describe("GET /api/comments/:id", () => {
    let testCommentId: string;

    beforeAll(async () => {
      // Use upsert to ensure UserProfile exists
      await prisma.userProfile.upsert({
        where: { userId: TEST_USER_ID },
        update: {},
        create: {
          userId: TEST_USER_ID,
          username: "testuser",
        },
      });

      // Create the test comment
      const comment = await prisma.comment.create({
        data: {
          userId: TEST_USER_ID,
          content: "This is a test comment!",
          createdAt: new Date(),
        },
      });

      testCommentId = comment.id;
    });

    afterAll(async () => {
      await prisma.comment.deleteMany({ where: { userId: TEST_USER_ID } });
    });

    it("should retrieve a comment by ID", async () => {
      const res = await request(app)
        .get(`/api/comment/${testCommentId}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK)
        .expect("Content-Type", /json/);
      
      expect(res.body).toHaveProperty("comment");
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("timestamp");
      expect(res.body.comment).toHaveProperty("createdAt")
      expect(res.body.comment).toMatchObject({
        id: testCommentId,
        userId: TEST_USER_ID,
        content: "This is a test comment!",
      })
    });
  });
});