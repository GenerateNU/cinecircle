import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { prisma } from '../services/db';
import type { Prisma } from "@prisma/client";
import type { AuthenticatedRequest } from '../middleware/auth';
import { mapUserProfileDbToApi } from "./user";
import { FollowEdge } from "../types/models";

export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  const followerId = req.user?.id;
  const { followingId } = req.body;

  if (!followerId || !followingId) {
    return res.status(400).json({ message: 'Missing follower or following ID' });
  }
  if (followerId === followingId) {
    return res.status(400).json({ message: 'You cannot follow yourself' });
  }

  try {
    const targetProfile = await prisma.userProfile.findUnique({
      where: { userId: followingId },
    });
    if (!targetProfile) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    await prisma.userFollow.create({
      data: {
        id: crypto.randomUUID(),
        followerId,
        followingId,
      },
    });
    res.status(201).json({ message: `You are now following ${followingId}` });
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return res.status(409).json({ message: 'Already following this user' });
    }
    if ((error as any).code === 'P2003') {
      return res.status(404).json({ message: 'User to follow not found' });
    }
    console.error('followUser error:', error);
    res.status(500).json({ message: 'Failed to follow user' });
  }
};

export const unfollowUser = async (req: AuthenticatedRequest, res: Response) => {
  const followerId = req.user?.id;
  const { followingId } = req.body;

  if (!followerId || !followingId) {
    return res.status(400).json({ message: 'Missing follower or following ID' });
  }

  try {
    const targetProfile = await prisma.userProfile.findUnique({
      where: { userId: followingId },
    });
    if (!targetProfile) {
      return res.status(404).json({ message: 'User to unfollow not found' });
    }

    await prisma.userFollow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    res.json({ message: `Unfollowed user ${followingId}` });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ message: 'Follow relationship not found' });
    }
    console.error('unfollowUser error:', error);
    res.status(500).json({ message: 'Failed to unfollow user' });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const followers = await prisma.userFollow.findMany({
      where: { followingId: userId },
      include: {
        UserProfile_UserFollow_followerIdToUserProfile: true,
        UserProfile_UserFollow_followingIdToUserProfile: true,
      },
    });

    const mappedFollowers = followers.map(mapUserFollowDbToApi);

    res.json({ followers: mappedFollowers });
  } catch (error) {
    console.error('getFollowers error:', error);
    res.status(500).json({ message: 'Failed to get followers' });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const following = await prisma.userFollow.findMany({
      where: { followerId: userId },
      include: {
        UserProfile_UserFollow_followerIdToUserProfile: true,
        UserProfile_UserFollow_followingIdToUserProfile: true,
      },
    });

    const mappedFollowing = following.map(mapUserFollowDbToApi);

    res.json({ following: mappedFollowing });
  } catch (error) {
    console.error('getFollowing error:', error);
    res.status(500).json({ message: 'Failed to get following' });
  }
};

type UserFollowWithProfiles = Prisma.UserFollowGetPayload<{
  include: {
    UserProfile_UserFollow_followerIdToUserProfile: true;
    UserProfile_UserFollow_followingIdToUserProfile: true;
  };
}>;

export function mapUserFollowDbToApi(row: UserFollowWithProfiles): FollowEdge {
  return {
    id: row.id,
    followerId: row.followerId,
    followingId: row.followingId,
    follower: row.UserProfile_UserFollow_followerIdToUserProfile
      ? mapUserProfileDbToApi(row.UserProfile_UserFollow_followerIdToUserProfile)
      : undefined,
    following: row.UserProfile_UserFollow_followingIdToUserProfile
      ? mapUserProfileDbToApi(row.UserProfile_UserFollow_followingIdToUserProfile)
      : undefined,
  };
}

export function mapUserFollowsDbToApi(rows: UserFollowWithProfiles[]): FollowEdge[] {
  return rows.map(mapUserFollowDbToApi);
}
