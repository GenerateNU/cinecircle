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
    // get ids of followed users
    const following = await prisma.userFollow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);

    const recentRatings = await prisma.rating.findMany({
      where: {
        userId: { in: followingIds },
      },
      include: {
        UserProfile: {
          select: {
            userId: true,
            username: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: limit,
    });

    const recentPosts = await prisma.post.findMany({
      where: {
        userId: { in: followingIds },
      },
      include: {
        UserProfile: {
          select: {
            userId: true,
            username: true,
          },
        },
        PostLike: true,
        Comment: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });


    const trendingRatings = await prisma.rating.findMany({
      where: {
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: {
        UserProfile: {
          select: {
            userId: true,
            username: true,
          },
        },
      },
      orderBy: { votes: 'desc' },
      take: 5,
    });

    const trendingPosts = await prisma.post.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: {
        UserProfile: {
          select: {
            userId: true,
            username: true,
          },
        },
        PostLike: true,
        Comment: {
          select: { id: true },
        },
      },
      orderBy: { votes: 'desc' },
      take: 5,
    });

    const postsWithCounts = [...recentPosts, ...trendingPosts].map(post => ({
      ...post,
      likeCount: post.PostLike?.length || 0,
      commentCount: post.Comment?.length || 0,
    }));

    const feed = [
      ...recentRatings.map((r) => ({ type: 'rating', data: r })),
      ...postsWithCounts.filter(p => recentPosts.includes(p)).map((p) => ({ type: 'post', data: p })),
      ...trendingRatings.map((r) => ({ type: 'trending_rating', data: r })),
      ...postsWithCounts.filter(p => trendingPosts.includes(p)).map((p) => ({ type: 'trending_post', data: p })),
    ];

    function getTimestamp(item: Rating | Post): Date {
        return 'createdAt' in item ? item.createdAt : item.date;
    }

    // sort by newest
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