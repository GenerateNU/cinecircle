import { Request, Response } from 'express';
import { prisma } from "../../services/db.js";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  mapUserFollowDbToApi,
  mapUserFollowsDbToApi,
} from '../../controllers/userFollows';
import { AuthenticatedRequest } from "../../middleware/auth";

// Mock dependencies - paths should match the actual imports
jest.mock('../../services/db.js', () => ({
  prisma: {
    userFollow: {
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    userProfile: {
      findUnique: jest.fn().mockResolvedValue({
        userId: 'following-id',
        username: 'following-user',
        onboardingCompleted: false,
        primaryLanguage: 'English',
        secondaryLanguage: [],
        profilePicture: null,
        country: null,
        city: null,
        favoriteGenres: [],
        favoriteMovies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
  },
}));

jest.mock('../../controllers/user', () => ({
  mapUserProfileDbToApi: jest.fn((user) => ({
    userId: user.userId,
    username: user.username,
    email: user.email,
    // Add other mapped fields as needed
  })),
}));

describe('Follow Controller', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRes = {
      json: jsonMock,
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  describe('followUser', () => {
    beforeEach(() => {
      mockReq = {
        user: { id: 'follower-id' },
        body: { followingId: 'following-id' },
      } as AuthenticatedRequest;
    });

    it('should return 400 if followerId is missing', async () => {
      mockReq.user = undefined;

      await followUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Missing follower or following ID',
      });
      expect(prisma.userFollow.create).not.toHaveBeenCalled();
    });

    it('should return 400 if followingId is missing', async () => {
      mockReq.body = {};

      await followUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Missing follower or following ID',
      });
      expect(prisma.userFollow.create).not.toHaveBeenCalled();
    });

    it('should return 409 if already following the user', async () => {
      const duplicateError = { code: 'P2002' };
      (prisma.userFollow.create as jest.Mock).mockRejectedValue(duplicateError);

      await followUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Already following this user',
      });
    });

    it('should return 500 on database error', async () => {
      const dbError = new Error('Database error');
      (prisma.userFollow.create as jest.Mock).mockRejectedValue(dbError);

      await followUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to follow user',
      });
    });
  });

  describe('unfollowUser', () => {
    beforeEach(() => {
      mockReq = {
        user: { id: 'follower-id' },
        body: { followingId: 'following-id' },
      } as AuthenticatedRequest;
    });

    it('should return 400 if followerId is missing', async () => {
      mockReq.user = undefined;

      await unfollowUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Missing follower or following ID',
      });
      expect(prisma.userFollow.delete).not.toHaveBeenCalled();
    });

    it('should return 400 if followingId is missing', async () => {
      mockReq.body = {};

      await unfollowUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Missing follower or following ID',
      });
      expect(prisma.userFollow.delete).not.toHaveBeenCalled();
    });

    it('should return 500 on database error', async () => {
      const dbError = new Error('Database error');
      (prisma.userFollow.delete as jest.Mock).mockRejectedValue(dbError);

      await unfollowUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to unfollow user',
      });
    });
  });

  describe('getFollowers', () => {
    beforeEach(() => {
      mockReq = {
        params: { userId: 'user-id' },
      } as Partial<Request>;
    });

    it('should return 500 on database error', async () => {
      const dbError = new Error('Database error');
      (prisma.userFollow.findMany as jest.Mock).mockRejectedValue(dbError);

      await getFollowers(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to get followers',
      });
    });

    it('should return empty array when user has no followers', async () => {
      (prisma.userFollow.findMany as jest.Mock).mockResolvedValue([]);

      await getFollowers(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ followers: [] });
    });
  });

  describe('getFollowing', () => {
    beforeEach(() => {
      mockReq = {
        params: { userId: 'user-id' },
      } as Partial<Request>;
    });

    it('should return 500 on database error', async () => {
      const dbError = new Error('Database error');
      (prisma.userFollow.findMany as jest.Mock).mockRejectedValue(dbError);

      await getFollowing(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Failed to get following',
      });
    });

    it('should return empty array when user is not following anyone', async () => {
      (prisma.userFollow.findMany as jest.Mock).mockResolvedValue([]);

      await getFollowing(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ following: [] });
    });
  });
});
