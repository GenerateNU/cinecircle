import { Request, Response } from 'express';
import { prisma } from '../services/db';
import type { AuthenticatedRequest } from '../middleware/auth';

export const followUser = async (req: AuthenticatedRequest, res: Response) => {
  const followerId = req.user?.id;
  const { followingId } = req.body;

  if (!followerId || !followingId) {
    return res.status(400).json({ message: 'Missing follower or following ID' });
  }

  try {
    await prisma.userFollow.create({
      data: { followerId, followingId },
    });
    res.status(201).json({ message: `You are now following ${followingId}` });
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return res.status(409).json({ message: 'Already following this user' });
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
    await prisma.userFollow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    res.json({ message: `Unfollowed user ${followingId}` });
  } catch (error) {
    console.error('unfollowUser error:', error);
    res.status(500).json({ message: 'Failed to unfollow user' });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const followers = await prisma.userFollow.findMany({
      where: { followingId: userId },
      include: { follower: true },
    });

    res.json({ followers });
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
      include: { following: true },
    });

    res.json({ following });
  } catch (error) {
    console.error('getFollowing error:', error);
    res.status(500).json({ message: 'Failed to get following' });
  }
};
