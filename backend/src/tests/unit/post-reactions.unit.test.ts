import { toggleReaction, getPostReactions } from "../../controllers/post.js";
import { Request, Response } from "express";
import { prisma } from "../../services/db.js";

describe("Post Reactions Controller Unit Tests", () => {
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

  describe("toggleReaction", () => {
    it("should return 400 if required fields are missing", async () => {
      mockRequest.params = { postId: "post-123" };
      mockRequest.body = { userId: "user-123" }; // Missing reactionType

      await toggleReaction(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "postId, userId, and reactionType are required",
      });
    });

    it("should return 400 for invalid reactionType", async () => {
      mockRequest.params = { postId: "post-123" };
      mockRequest.body = {
        userId: "user-123",
        reactionType: "INVALID_TYPE",
      };

      await toggleReaction(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Invalid reactionType. Must be one of: SPICY, STAR_STUDDED, THOUGHT_PROVOKING, BLOCKBUSTER",
      });
    });

    it("should return 404 if post not found", async () => {
      mockRequest.params = { postId: "non-existent" };
      mockRequest.body = {
        userId: "user-123",
        reactionType: "SPICY",
      };

      jest.spyOn(prisma.post, "findUnique").mockResolvedValueOnce(null);

      await toggleReaction(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Post not found",
      });
    });

    it("should add a reaction if it doesn't exist", async () => {
      const mockPostId = "post-123";
      const mockUserId = "user-123";
      const reactionType = "SPICY";

      mockRequest.params = { postId: mockPostId };
      mockRequest.body = {
        userId: mockUserId,
        reactionType,
      };

      const mockPost = {
        id: mockPostId,
        userId: "post-author",
        content: "Test post",
        type: "SHORT",
        votes: 0,
        createdAt: new Date(),
        imageUrls: [],
        parentPostId: null,
      };

      jest.spyOn(prisma.post, "findUnique").mockResolvedValueOnce(mockPost as any);
      jest.spyOn(prisma.postReaction, "findUnique").mockResolvedValueOnce(null);
      jest.spyOn(prisma.postReaction, "create").mockResolvedValueOnce({
        id: "reaction-123",
        postId: mockPostId,
        userId: mockUserId,
        reactionType,
        createdAt: new Date(),
      } as any);

      await toggleReaction(mockRequest as Request, mockResponse as Response);

      expect(prisma.postReaction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          postId: mockPostId,
          userId: mockUserId,
          reactionType,
        }),
      });
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Reaction added successfully",
        reacted: true,
        reactionType,
      });
    });

    it("should remove a reaction if it already exists", async () => {
      const mockPostId = "post-123";
      const mockUserId = "user-123";
      const reactionType = "BLOCKBUSTER";

      mockRequest.params = { postId: mockPostId };
      mockRequest.body = {
        userId: mockUserId,
        reactionType,
      };

      const mockPost = {
        id: mockPostId,
        userId: "post-author",
        content: "Test post",
        type: "SHORT",
        votes: 0,
        createdAt: new Date(),
        imageUrls: [],
        parentPostId: null,
      };

      const mockExistingReaction = {
        id: "reaction-123",
        postId: mockPostId,
        userId: mockUserId,
        reactionType,
        createdAt: new Date(),
      };

      jest.spyOn(prisma.post, "findUnique").mockResolvedValueOnce(mockPost as any);
      jest.spyOn(prisma.postReaction, "findUnique").mockResolvedValueOnce(mockExistingReaction as any);
      jest.spyOn(prisma.postReaction, "delete").mockResolvedValueOnce(mockExistingReaction as any);

      await toggleReaction(mockRequest as Request, mockResponse as Response);

      expect(prisma.postReaction.delete).toHaveBeenCalledWith({
        where: { id: mockExistingReaction.id },
      });
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Reaction removed successfully",
        reacted: false,
        reactionType,
      });
    });

    it("should allow multiple different reactions from same user", async () => {
      const mockPostId = "post-123";
      const mockUserId = "user-123";

      // First reaction: SPICY
      mockRequest.params = { postId: mockPostId };
      mockRequest.body = {
        userId: mockUserId,
        reactionType: "SPICY",
      };

      const mockPost = {
        id: mockPostId,
        userId: "post-author",
        content: "Test post",
        type: "SHORT",
        votes: 0,
        createdAt: new Date(),
        imageUrls: [],
        parentPostId: null,
      };

      jest.spyOn(prisma.post, "findUnique").mockResolvedValue(mockPost as any);
      jest.spyOn(prisma.postReaction, "findUnique").mockResolvedValue(null);
      jest.spyOn(prisma.postReaction, "create").mockResolvedValue({
        id: "reaction-123",
        postId: mockPostId,
        userId: mockUserId,
        reactionType: "SPICY",
        createdAt: new Date(),
      } as any);

      await toggleReaction(mockRequest as Request, mockResponse as Response);

      expect(prisma.postReaction.create).toHaveBeenCalled();
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Reaction added successfully",
        reacted: true,
        reactionType: "SPICY",
      });
    });
  });

  describe("getPostReactions", () => {
    it("should return 400 if postId is missing", async () => {
      mockRequest.params = {};

      await getPostReactions(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Post ID is required",
      });
    });

    it("should return reactions grouped by type", async () => {
      const mockPostId = "post-123";
      mockRequest.params = { postId: mockPostId };

      const mockReactions = [
        {
          id: "reaction-1",
          postId: mockPostId,
          userId: "user-1",
          reactionType: "SPICY",
          createdAt: new Date(),
          UserProfile: {
            userId: "user-1",
            username: "user1",
          },
        },
        {
          id: "reaction-2",
          postId: mockPostId,
          userId: "user-2",
          reactionType: "SPICY",
          createdAt: new Date(),
          UserProfile: {
            userId: "user-2",
            username: "user2",
          },
        },
        {
          id: "reaction-3",
          postId: mockPostId,
          userId: "user-3",
          reactionType: "BLOCKBUSTER",
          createdAt: new Date(),
          UserProfile: {
            userId: "user-3",
            username: "user3",
          },
        },
        {
          id: "reaction-4",
          postId: mockPostId,
          userId: "user-4",
          reactionType: "THOUGHT_PROVOKING",
          createdAt: new Date(),
          UserProfile: {
            userId: "user-4",
            username: "user4",
          },
        },
      ];

      jest.spyOn(prisma.postReaction, "findMany").mockResolvedValueOnce(mockReactions as any);

      await getPostReactions(mockRequest as Request, mockResponse as Response);

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Reactions retrieved successfully",
        data: mockReactions,
        counts: {
          SPICY: 2,
          BLOCKBUSTER: 1,
          THOUGHT_PROVOKING: 1,
        },
        total: 4,
      });
    });

    it("should return empty array if no reactions", async () => {
      mockRequest.params = { postId: "post-123" };

      jest.spyOn(prisma.postReaction, "findMany").mockResolvedValueOnce([]);

      await getPostReactions(mockRequest as Request, mockResponse as Response);

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Reactions retrieved successfully",
        data: [],
        counts: {},
        total: 0,
      });
    });
  });
});

