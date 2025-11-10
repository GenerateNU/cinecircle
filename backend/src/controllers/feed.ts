import { Request, Response } from 'express';
import { prisma } from '../services/db';
import type { AuthenticatedRequest } from '../middleware/auth';
import { Post, Rating } from '@prisma/client';

export const getHomeFeed = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;
  const limit = parseInt(req.query.limit as string) || 20;

  if (!user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Step 1: Get IDs of users they follow
    const following = await prisma.userFollow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    // Step 2: Get recent Ratings by followed users
    const recentRatings = await prisma.rating.findMany({
      where: {
        userId: { in: followingIds },
      },
      orderBy: { date: 'desc' },
      take: limit,
    });

    // Step 3: Get recent Posts by followed users
    const recentPosts = await prisma.post.findMany({
      where: {
        userId: { in: followingIds },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Step 4: Get trending Ratings (last 7 days, most votes)
    const trendingRatings = await prisma.rating.findMany({
      where: {
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { votes: 'desc' },
      take: 5,
    });

    // Step 5: Get trending Posts
    const trendingPosts = await prisma.post.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { votes: 'desc' },
      take: 5,
    });

    const feed = [
      ...recentRatings.map((r) => ({ type: 'rating', data: r })),
      ...recentPosts.map((p) => ({ type: 'post', data: p })),
      ...trendingRatings.map((r) => ({ type: 'trending_rating', data: r })),
      ...trendingPosts.map((p) => ({ type: 'trending_post', data: p })),
    ];

    function getTimestamp(item: Rating | Post): Date {
        return 'createdAt' in item ? item.createdAt : item.date;
      }
      

    // Sort all by newest first
    const sortedFeed = feed.sort((a, b) => {
        const aDate = getTimestamp(a.data);
        const bDate = getTimestamp(b.data);
        return bDate.getTime() - aDate.getTime();
      });
      

    res.json({
      message: 'Home feed retrieved successfully',
      data: sortedFeed.slice(0, limit),
    });
  } catch (error) {
    console.error('getHomeFeed error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
