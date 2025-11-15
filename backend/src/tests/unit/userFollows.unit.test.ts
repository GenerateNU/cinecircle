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

    it('should successfully follow a user', async () => {
      (prisma.userFollow.create as jest.Mock).mockResolvedValue({
        id: 'follow-id',
        followerId: 'follower-id',
        followingId: 'following-id',
      });

      await followUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(prisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: 'following-id' },
      });
      expect(prisma.userFollow.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          followerId: 'follower-id',
          followingId: 'following-id',
        }),
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'You are now following following-id',
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

    it('should successfully unfollow a user', async () => {
      (prisma.userFollow.delete as jest.Mock).mockResolvedValue({
        id: 'follow-id',
        followerId: 'follower-id',
        followingId: 'following-id',
      });

      await unfollowUser(mockReq as AuthenticatedRequest, mockRes as Response);

      expect(prisma.userProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: 'following-id' },
      });
      expect(prisma.userFollow.delete).toHaveBeenCalledWith({
        where: {
          followerId_followingId: {
            followerId: 'follower-id',
            followingId: 'following-id',
          },
        },
      });
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Unfollowed user following-id',
      });
    });
  });

  describe('getFollowers', () => {
    beforeEach(() => {
      mockReq = {
        params: { userId: 'user-id' },
      } as Partial<Request>;
    });

    it('should successfully get followers', async () => {
      const mockFollowers = [
        {
          id: 'follow-1',
          followerId: 'follower-1',
          followingId: 'user-id',
          UserProfile_UserFollow_followerIdToUserProfile: {
            userId: 'follower-1',
            username: 'follower1',
            email: 'follower1@test.com',
          },
          UserProfile_UserFollow_followingIdToUserProfile: {
            userId: 'user-id',
            username: 'user',
            email: 'user@test.com',
          },
        },
        {
          id: 'follow-2',
          followerId: 'follower-2',
          followingId: 'user-id',
          UserProfile_UserFollow_followerIdToUserProfile: {
            userId: 'follower-2',
            username: 'follower2',
            email: 'follower2@test.com',
          },
          UserProfile_UserFollow_followingIdToUserProfile: {
            userId: 'user-id',
            username: 'user',
            email: 'user@test.com',
          },
        },
      ];

      (prisma.userFollow.findMany as jest.Mock).mockResolvedValue(mockFollowers);

      await getFollowers(mockReq as Request, mockRes as Response);

      expect(prisma.userFollow.findMany).toHaveBeenCalledWith({
        where: { followingId: 'user-id' },
        include: {
          UserProfile_UserFollow_followerIdToUserProfile: true,
          UserProfile_UserFollow_followingIdToUserProfile: true,
        },
      });
      expect(jsonMock).toHaveBeenCalledWith({
        followers: expect.arrayContaining([
          expect.objectContaining({
            id: 'follow-1',
            followerId: 'follower-1',
            followingId: 'user-id',
          }),
          expect.objectContaining({
            id: 'follow-2',
            followerId: 'follower-2',
            followingId: 'user-id',
          }),
        ]),
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

    it('should successfully get following', async () => {
      const mockFollowing = [
        {
          id: 'follow-1',
          followerId: 'user-id',
          followingId: 'following-1',
          UserProfile_UserFollow_followerIdToUserProfile: {
            userId: 'user-id',
            username: 'user',
            email: 'user@test.com',
          },
          UserProfile_UserFollow_followingIdToUserProfile: {
            userId: 'following-1',
            username: 'following1',
            email: 'following1@test.com',
          },
        },
        {
          id: 'follow-2',
          followerId: 'user-id',
          followingId: 'following-2',
          UserProfile_UserFollow_followerIdToUserProfile: {
            userId: 'user-id',
            username: 'user',
            email: 'user@test.com',
          },
          UserProfile_UserFollow_followingIdToUserProfile: {
            userId: 'following-2',
            username: 'following2',
            email: 'following2@test.com',
          },
        },
      ];

      (prisma.userFollow.findMany as jest.Mock).mockResolvedValue(mockFollowing);

      await getFollowing(mockReq as Request, mockRes as Response);

      expect(prisma.userFollow.findMany).toHaveBeenCalledWith({
        where: { followerId: 'user-id' },
        include: {
          UserProfile_UserFollow_followerIdToUserProfile: true,
          UserProfile_UserFollow_followingIdToUserProfile: true,
        },
      });
      expect(jsonMock).toHaveBeenCalledWith({
        following: expect.arrayContaining([
          expect.objectContaining({
            id: 'follow-1',
            followerId: 'user-id',
            followingId: 'following-1',
          }),
          expect.objectContaining({
            id: 'follow-2',
            followerId: 'user-id',
            followingId: 'following-2',
          }),
        ]),
      });
    });

    it('should return empty array when user is not following anyone', async () => {
      (prisma.userFollow.findMany as jest.Mock).mockResolvedValue([]);

      await getFollowing(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ following: [] });
    });
  });

  describe('mapUserFollowDbToApi', () => {
    it('should map database follow to API follow with profiles', () => {
      const dbFollow = {
        id: 'follow-id',
        followerId: 'follower-id',
        followingId: 'following-id',
        UserProfile_UserFollow_followerIdToUserProfile: {
          userId: 'follower-id',
          username: 'follower',
          email: 'follower@test.com',
        },
        UserProfile_UserFollow_followingIdToUserProfile: {
          userId: 'following-id',
          username: 'following',
          email: 'following@test.com',
        },
      } as any;

      const result = mapUserFollowDbToApi(dbFollow);

      expect(result).toEqual({
        id: 'follow-id',
        followerId: 'follower-id',
        followingId: 'following-id',
        follower: expect.objectContaining({
          userId: 'follower-id',
          username: 'follower',
          email: 'follower@test.com',
        }),
        following: expect.objectContaining({
          userId: 'following-id',
          username: 'following',
          email: 'following@test.com',
        }),
      });
    });

    it('should handle missing follower profile', () => {
      const dbFollow = {
        id: 'follow-id',
        followerId: 'follower-id',
        followingId: 'following-id',
        UserProfile_UserFollow_followerIdToUserProfile: null,
        UserProfile_UserFollow_followingIdToUserProfile: {
          userId: 'following-id',
          username: 'following',
          email: 'following@test.com',
        },
      } as any;

      const result = mapUserFollowDbToApi(dbFollow);

      expect(result.follower).toBeUndefined();
      expect(result.following).toBeDefined();
    });

    it('should handle missing following profile', () => {
      const dbFollow = {
        id: 'follow-id',
        followerId: 'follower-id',
        followingId: 'following-id',
        UserProfile_UserFollow_followerIdToUserProfile: {
          userId: 'follower-id',
          username: 'follower',
          email: 'follower@test.com',
        },
        UserProfile_UserFollow_followingIdToUserProfile: null,
      } as any;

      const result = mapUserFollowDbToApi(dbFollow);

      expect(result.follower).toBeDefined();
      expect(result.following).toBeUndefined();
    });
  });

  describe('mapUserFollowsDbToApi', () => {
    it('should map multiple database follows to API follows', () => {
      const dbFollows = [
        {
          id: 'follow-1',
          followerId: 'follower-1',
          followingId: 'following-1',
          UserProfile_UserFollow_followerIdToUserProfile: {
            userId: 'follower-1',
            username: 'follower1',
            email: 'follower1@test.com',
          },
          UserProfile_UserFollow_followingIdToUserProfile: {
            userId: 'following-1',
            username: 'following1',
            email: 'following1@test.com',
          },
        },
        {
          id: 'follow-2',
          followerId: 'follower-2',
          followingId: 'following-2',
          UserProfile_UserFollow_followerIdToUserProfile: {
            userId: 'follower-2',
            username: 'follower2',
            email: 'follower2@test.com',
          },
          UserProfile_UserFollow_followingIdToUserProfile: {
            userId: 'following-2',
            username: 'following2',
            email: 'following2@test.com',
          },
        },
      ] as any[];

      const result = mapUserFollowsDbToApi(dbFollows);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('follow-1');
      expect(result[1].id).toBe('follow-2');
    });

    it('should return empty array for empty input', () => {
      const result = mapUserFollowsDbToApi([]);

      expect(result).toEqual([]);
    });
  });
});
