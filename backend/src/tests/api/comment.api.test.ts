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
    
    // Wrap cleanup in try-catch to handle missing tables
    try {
      await prisma.comment.deleteMany({
        where: { userId: { in: [TEST_USER_ID, OTHER_USER_ID] } },
      });
      await prisma.post.deleteMany({
        where: { userId: { in: [TEST_USER_ID, OTHER_USER_ID] } },
      });
      await prisma.rating.deleteMany({
        where: { userId: { in: [TEST_USER_ID, OTHER_USER_ID] } },
      });
    } catch (error) {
      console.log("Cleanup failed - tables may not exist yet");
    }
  });

  afterAll(async () => {
    try {
      await prisma.comment.deleteMany({
        where: { userId: { in: [TEST_USER_ID, OTHER_USER_ID] } },
      });
      await prisma.post.deleteMany({
        where: { userId: { in: [TEST_USER_ID, OTHER_USER_ID] } },
      });
      await prisma.rating.deleteMany({
        where: { userId: { in: [TEST_USER_ID, OTHER_USER_ID] } },
      });
    } catch (error) {
      console.log("Final cleanup failed");
    }
    await prisma.$disconnect();
  });

  describe("GET /api/comments/:id", () => {
    let testCommentId: string;
    let testPostId: string;

    beforeAll(async () => {
      const post = await prisma.post.create({
        data: {
          id: "test-post-get-comment",
          userId: TEST_USER_ID,
          content: "Test post",
          type: "SHORT",
        },
      });
      testPostId = post.id;

      const comment = await prisma.comment.create({
        data: {
          id: "test-comment-get",
          userId: TEST_USER_ID,
          postId: testPostId,
          content: "Test comment content",
          createdAt: new Date(),
        },
      });
      testCommentId = comment.id;
    });

    afterAll(async () => {
      await prisma.comment.deleteMany({ where: { id: testCommentId } });
      await prisma.post.deleteMany({ where: { id: testPostId } });
    });

    it("should retrieve a comment by ID", async () => {
      const res = await request(app)
        .get(`/api/comments/${testCommentId}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK)
        .expect("Content-Type", /json/);

      expect(res.body).toHaveProperty("message", "Comment retrieved successfully");
      expect(res.body.comment).toHaveProperty("id", testCommentId);
      expect(res.body.comment).toHaveProperty("content", "Test comment content");
      expect(res.body).toHaveProperty("timestamp");
    });

    it("should return 404 for non-existent comment", async () => {
      const res = await request(app)
        .get("/api/comments/non-existent-id")
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(res.body).toHaveProperty("message", "Comment not found");
    });
  });

  describe("POST /api/comments", () => {
    let testPostId: string;
    let testRatingId: string;

    beforeAll(async () => {
      const post = await prisma.post.create({
        data: {
          id: "test-post-create-comment",
          userId: TEST_USER_ID,
          content: "Test post",
          type: "SHORT",
        },
      });
      testPostId = post.id;

      const rating = await prisma.rating.create({
        data: {
          id: "test-rating-create-comment",
          userId: TEST_USER_ID,
          movieId: "test-movie-1",
          stars: 5,
          date: new Date(),
        },
      });
      testRatingId = rating.id;
    });

    afterAll(async () => {
      await prisma.comment.deleteMany({ where: { postId: testPostId } });
      await prisma.comment.deleteMany({ where: { ratingId: testRatingId } });
      await prisma.rating.deleteMany({ where: { id: testRatingId } });
      await prisma.post.deleteMany({ where: { id: testPostId } });
    });

    it("should create a comment on a post", async () => {
      const payload = {
        content: "Test comment on post",
        postId: testPostId,
      };

      const res = await request(app)
        .post("/api/comments")
        .send(payload)
        .set(authHeader())
        .expect(HTTP_STATUS.CREATED);

      expect(res.body).toHaveProperty("message", "Comment created successfully");
      expect(res.body.comment).toHaveProperty("content", payload.content);
      expect(res.body.comment).toHaveProperty("postId", testPostId);

      await prisma.comment.delete({ where: { id: res.body.comment.id } });
    });

    it("should create a comment on a rating", async () => {
      const payload = {
        content: "Test comment on rating",
        ratingId: testRatingId,
      };

      const res = await request(app)
        .post("/api/comments")
        .send(payload)
        .set(authHeader())
        .expect(HTTP_STATUS.CREATED);

      expect(res.body.comment).toHaveProperty("ratingId", testRatingId);

      await prisma.comment.delete({ where: { id: res.body.comment.id } });
    });

    it("should return 400 when content is missing", async () => {
      const res = await request(app)
        .post("/api/comments")
        .send({})
        .set(authHeader())
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(res.body).toHaveProperty("message", "Content is required to create a comment");
    });
  });

  describe("PUT /api/comments/:id", () => {
    let testCommentId: string;
    let testPostId: string;

    beforeAll(async () => {
      const post = await prisma.post.create({
        data: {
          id: "test-post-update-comment",
          userId: TEST_USER_ID,
          content: "Test post",
          type: "SHORT",
        },
      });
      testPostId = post.id;

      const comment = await prisma.comment.create({
        data: {
          id: "test-comment-update",
          userId: TEST_USER_ID,
          postId: testPostId,
          content: "Original content",
          createdAt: new Date(),
        },
      });
      testCommentId = comment.id;
    });

    afterAll(async () => {
      await prisma.comment.deleteMany({ where: { id: testCommentId } });
      await prisma.post.deleteMany({ where: { id: testPostId } });
    });

    it("should update a comment", async () => {
      const payload = {
        content: "Updated content",
      };

      const res = await request(app)
        .put(`/api/comments/${testCommentId}`)
        .send(payload)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty("message", "Comment updated successfully");
      expect(res.body.comment).toHaveProperty("content", payload.content);
    });
  });

  describe("DELETE /api/comments/:id", () => {
    let testCommentId: string;
    let testPostId: string;

    beforeEach(async () => {
      const post = await prisma.post.create({
        data: {
          id: `test-post-delete-${Date.now()}`,
          userId: TEST_USER_ID,
          content: "Test post",
          type: "SHORT",
        },
      });
      testPostId = post.id;

      const comment = await prisma.comment.create({
        data: {
          userId: TEST_USER_ID,
          postId: testPostId,
          content: "Comment to delete",
          createdAt: new Date(),
        },
      });
      testCommentId = comment.id;
    });

    afterEach(async () => {
      await prisma.comment.deleteMany({ where: { id: testCommentId } });
      await prisma.post.deleteMany({ where: { id: testPostId } });
    });

    it("should delete a comment", async () => {
      const res = await request(app)
        .delete(`/api/comments/${testCommentId}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty("message", "Comment deleted successfully");

      const deleted = await prisma.comment.findUnique({
        where: { id: testCommentId },
      });
      expect(deleted).toBeNull();
    });

    it("should return 404 for non-existent comment", async () => {
      const res = await request(app)
        .delete("/api/comments/non-existent-id")
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(res.body).toHaveProperty("message", "Comment not found");
    });
  });
});