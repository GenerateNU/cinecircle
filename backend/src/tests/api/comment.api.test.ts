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
  let testCommentId: string;
  let testRatingId: string;
  let testPostId: string;

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

  // Create app and clean up tests
  beforeAll(async () => {
    app = createApp();
    await prisma.comment.deleteMany({ where: { userId: TEST_USER_ID } });

    await prisma.userProfile.upsert({
      where: { userId: TEST_USER_ID },
      update: {},
      create: {
        userId: TEST_USER_ID,
        username: "testuser",
      },
    
    });

    // Create other user profile for authorization tests
    await prisma.userProfile.upsert({
      where: { userId: OTHER_USER_ID },
      update: {},
      create: {
        userId: OTHER_USER_ID,
        username: "otheruser",
      },
    });
  });

  // Create a fresh comment for each test
  beforeEach(async () => {
    // Create a new rating for each test instead of upserting
    const rating = await prisma.rating.create({
      data: {
        userId: TEST_USER_ID,
        movieId: "555",
        stars: 5,
        date: new Date(),
      },
    });
    testRatingId = rating.id;

    // Create a new post for each test instead of upserting
    const post = await prisma.post.create({
      data: {
        userId: TEST_USER_ID,
        type: "SHORT" as any, // Represents the enum PostType
        content: "This is a test post!",
        createdAt: new Date(),
      },
    });
    testPostId = post.id;

    const comment = await prisma.comment.create({
      data: {
        userId: TEST_USER_ID,
        ratingId: testRatingId,
        postId: testPostId,
        content: "This is a test comment!",
        createdAt: new Date(),
      },
    });
    testCommentId = comment.id;
  });

  // Clean up after each test - delete related records
  afterEach(async () => {
    if (testCommentId) {
      await prisma.comment.delete({ where: { id: testCommentId } }).catch(() => {});
    }
    if (testPostId) {
      await prisma.post.delete({ where: { id: testPostId } }).catch(() => {});
    }
    if (testRatingId) {
      await prisma.rating.delete({ where: { id: testRatingId } }).catch(() => {});
    }
  });

  // Clean up at the end
  afterAll(async () => {
    await prisma.comment.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.rating.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.post.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.comment.deleteMany({ where: { userId: OTHER_USER_ID } });
    await prisma.$disconnect();
  });

  describe("GET /api/comments/:id", () => {
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

  describe("PUT /api/comment/:id", () => {
    it("should update comments by fields", async () => {
      const payload = {
        content: "The test contents are now updated!"
      };

      const res = await request(app)
        .put(`/api/comment/${testCommentId}`)
        .send(payload)
        .set(authHeader())
        .expect(HTTP_STATUS.OK)
      
      expect(res.body.comment).toMatchObject({
        id: testCommentId,
        userId: TEST_USER_ID,
        content: "The test contents are now updated!",
      });
    });

    it("should return 403 when updating another user's comment", async () => {
      const otherUserComment = await prisma.comment.create({
        data: {
          userId: OTHER_USER_ID,
          ratingId: testRatingId,
          postId: testPostId,
          content: "Another user's comment",
          createdAt: new Date(),
        },
      });

      const payload = {
        content: "The test contents are now updated!"
      };
      
      const res = await request(app)
        .put(`/api/comment/${otherUserComment.id}`)
        .send(payload)
        .set(authHeader())
        .expect(403);
      
      expect(res.body.message).toEqual("You do not have permission to edit this comment");
      
      // Clean up
      await prisma.comment.delete({ where: { id: otherUserComment.id } });
   });
  });

  describe("DELETE /api/comment/:id", () => {
    it("should delete a comment by ID", async () => {
      const res = await request(app)
        .delete(`/api/comment/${testCommentId}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);
      
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("timestamp");
      
      // Verify the comment is actually deleted
      const deletedComment = await prisma.comment.findUnique({
        where: { id: testCommentId }
      });
      expect(deletedComment).toBeNull();
      
      // Clear testCommentId so afterEach doesn't try to delete it again
      testCommentId = "";
    });

    it("should return 404 when deleting non-existent comment", async () => {
      const nonExistentId = "999e4567-e89b-12d3-a456-426614174999";
      
      const res = await request(app)
        .delete(`/api/comment/${nonExistentId}`)
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND);
      
      expect(res.body.message).toEqual("Comment not found");
    });

    it("should return 403 when deleting another user's comment", async () => {
      // Create a comment owned by another user
      const otherUserComment = await prisma.comment.create({
        data: {
          userId: OTHER_USER_ID,
          ratingId: testRatingId,
          postId: testPostId,
          content: "Another user's comment",
          createdAt: new Date(),
        },
      });

      const res = await request(app)
        .delete(`/api/comment/${otherUserComment.id}`)
        .set(authHeader())
        .expect(403);
      
      expect(res.body.message).toEqual("You do not have permission to delete this comment");
      
      // Clean up
      await prisma.comment.delete({ where: { id: otherUserComment.id } });
    });
  });
});
