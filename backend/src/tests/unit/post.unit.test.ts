import { createPost, getPostById, updatePost, deletePost } from "../../controllers/post.js";
import { Request, Response } from "express";
import { prisma } from "../../services/db.js";
import { Prisma } from "@prisma/client";

describe("Post Controller Unit Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      query: {},
    };

    responseObject = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    mockResponse = responseObject;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createPost", () => {
    it("should return 400 if userId or content is missing", async () => {
      mockRequest.body = { content: "Test content" }; // Missing userId

      await createPost(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "userId and content are required",
      });
    });

    it("should create a post successfully", async () => {
      const mockUserId = "user-123";
      const mockMovieId = "tt1234567";
      const mockPostData = {
        userId: mockUserId,
        movieId: mockMovieId, // Required field
        content: "This is a test post",
        type: "SHORT",
      };

      mockRequest.body = mockPostData;

      const mockCreatedPost = {
        id: "post-123",
        userId: mockUserId,
        movieId: mockMovieId,
        content: "This is a test post",
        type: "SHORT",
        stars: null,
        spoiler: false,
        tags: [],
        repostedPostId: null,
        imageUrls: [],
        createdAt: new Date(),
        UserProfile: {
          userId: mockUserId,
          username: "testuser",
        },
        movie: {
          movieId: mockMovieId,
          title: "Test Movie",
          imageUrl: null,
        },
      };

      jest.spyOn(prisma.post, "create").mockResolvedValueOnce(mockCreatedPost as any);

      await createPost(mockRequest as Request, mockResponse as Response);

      expect(prisma.post.create).toHaveBeenCalled();
      expect(responseObject.status).toHaveBeenCalledWith(201);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Post created successfully",
        data: mockCreatedPost,
      });
    });

    it("should return 400 for invalid postType", async () => {
      mockRequest.body = {
        userId: "user-123",
        movieId: "tt1234567", // Required field
        content: "Test",
        type: "INVALID_TYPE",
      };

      await createPost(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Invalid type. Must be LONG or SHORT",
      });
    });
  });

  describe("getPostById", () => {
    it("should return 400 if postId is missing", async () => {
      mockRequest.params = {};

      await getPostById(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Post ID is required",
      });
    });

    it("should return 404 if post not found", async () => {
      mockRequest.params = { postId: "non-existent" };

      jest.spyOn(prisma.post, "findUnique").mockResolvedValueOnce(null);

      await getPostById(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Post not found",
      });
    });

    it("should return post with counts", async () => {
      const mockPostId = "post-123";
      mockRequest.params = { postId: mockPostId };

      const mockPost = {
        id: mockPostId,
        userId: "user-123",
        movieId: "tt1234567",
        content: "Test post",
        type: "SHORT",
        stars: null,
        spoiler: false,
        tags: [],
        repostedPostId: null,
        imageUrls: [],
        createdAt: new Date(),
        UserProfile: {
          userId: "user-123",
          username: "testuser",
        },
        movie: {
          movieId: "tt1234567",
          title: "Test Movie",
          imageUrl: null,
        },
        other_Post: [{ id: "repost-1" }, { id: "repost-2" }],
        PostReaction: [
          { id: "reaction-1", reactionType: "SPICY" }, 
          { id: "reaction-2", reactionType: "BLOCKBUSTER" }, 
          { id: "reaction-3", reactionType: "STAR_STUDDED" }
        ],
        Comment: [],
      };

      jest.spyOn(prisma.post, "findUnique").mockResolvedValueOnce(mockPost as any);

      await getPostById(mockRequest as Request, mockResponse as Response);

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Post found successfully",
        data: expect.objectContaining({
          id: mockPostId,
          userId: "user-123",
          content: "Test post",
          type: "SHORT",
          UserProfile: expect.objectContaining({
            userId: "user-123",
            username: "testuser",
          }),
          Comment: [],
          PostReaction: expect.arrayContaining([
            expect.objectContaining({ reactionType: "SPICY" }),
            expect.objectContaining({ reactionType: "BLOCKBUSTER" }),
            expect.objectContaining({ reactionType: "STAR_STUDDED" }),
          ]),
          Reposts: expect.arrayContaining([
            expect.objectContaining({ id: "repost-1" }),
            expect.objectContaining({ id: "repost-2" }),
          ]),
          reactionCount: 3,
          commentCount: 0,
          repostCount: 2,
        }),
      });
    });
  });

  describe("updatePost", () => {
    it("should return 400 if no fields to update", async () => {
      mockRequest.params = { postId: "post-123" };
      mockRequest.body = {};

      await updatePost(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "No fields to update",
      });
    });

    it("should update post successfully", async () => {
      const mockPostId = "post-123";
      mockRequest.params = { postId: mockPostId };
      mockRequest.body = { content: "Updated content" };

      const mockUpdatedPost = {
        id: mockPostId,
        userId: "user-123",
        movieId: "tt1234567",
        content: "Updated content",
        type: "SHORT",
        stars: null,
        spoiler: false,
        tags: [],
        repostedPostId: null,
        imageUrls: [],
        createdAt: new Date(),
        UserProfile: {
          userId: "user-123",
          username: "testuser",
        },
        movie: {
          movieId: "tt1234567",
          title: "Test Movie",
          imageUrl: null,
        },
      };

      jest.spyOn(prisma.post, "update").mockResolvedValueOnce(mockUpdatedPost as any);

      await updatePost(mockRequest as Request, mockResponse as Response);

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Post updated successfully",
        data: mockUpdatedPost,
      });
    });

    it("should return 404 if post not found", async () => {
      mockRequest.params = { postId: "non-existent" };
      mockRequest.body = { content: "Updated" };

      const prismaError = new Prisma.PrismaClientKnownRequestError("Not found", {
        code: "P2025",
        clientVersion: "4.0.0",
      });

      jest.spyOn(prisma.post, "update").mockRejectedValueOnce(prismaError);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await updatePost(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Post not found",
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("deletePost", () => {
    it("should delete post successfully", async () => {
      mockRequest.params = { postId: "post-123" };

      jest.spyOn(prisma.post, "delete").mockResolvedValueOnce({} as any);

      await deletePost(mockRequest as Request, mockResponse as Response);

      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: "post-123" },
      });
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Post deleted successfully",
      });
    });

    it("should return 404 if post not found", async () => {
      mockRequest.params = { postId: "non-existent" };

      const prismaError = new Prisma.PrismaClientKnownRequestError("Not found", {
        code: "P2025",
        clientVersion: "4.0.0",
      });

      jest.spyOn(prisma.post, "delete").mockRejectedValueOnce(prismaError);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await deletePost(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(404);

      consoleErrorSpy.mockRestore();
    });
  });
});