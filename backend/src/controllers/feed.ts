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

    // Get all reactions by the current user
    const userReactions = await prisma.postReaction.findMany({
      where: { userId: user.id },
      select: { postId: true, reactionType: true },
    });
    
    // Map postId to user's reaction types
    const userReactionsByPost = new Map<string, string[]>();
    userReactions.forEach(reaction => {
      const existing = userReactionsByPost.get(reaction.postId) || [];
      existing.push(reaction.reactionType);
      userReactionsByPost.set(reaction.postId, existing);
    });

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
        PostReaction: {
          select: {
            reactionType: true,
          },
        },
        _count: {
          select: {
            Comment: true,
            PostReaction: true,
          },
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
        PostReaction: {
          select: {
            reactionType: true,
          },
        },
        _count: {
          select: {
            Comment: true,
            PostReaction: true,
          },
        },
      },
      orderBy: { votes: 'desc' },
      take: 5,
    });

    const recentPostsWithCounts = recentPosts.map(post => {
      // Count reactions by type
      const reactionCounts = post.PostReaction.reduce((acc: Record<string, number>, r) => {
        acc[r.reactionType] = (acc[r.reactionType] || 0) + 1;
        return acc;
      }, {});

      return {
        ...post,
        commentCount: post._count.Comment,
        reactionCount: post._count.PostReaction,
        reactionCounts,
        userReactions: userReactionsByPost.get(post.id) || []
      };
    });

    const trendingPostsWithCounts = trendingPosts.map(post => {
      // Count reactions by type
      const reactionCounts = post.PostReaction.reduce((acc: Record<string, number>, r) => {
        acc[r.reactionType] = (acc[r.reactionType] || 0) + 1;
        return acc;
      }, {});

      return {
        ...post,
        commentCount: post._count.Comment,
        reactionCount: post._count.PostReaction,
        reactionCounts,
        userReactions: userReactionsByPost.get(post.id) || []
      };
    });

    const feed = [
      ...recentRatings.map((r) => ({ type: 'rating', data: r })),
      ...recentPostsWithCounts.map((p) => ({ type: 'post', data: p })),
      ...trendingRatings.map((r) => ({ type: 'trending_rating', data: r })),
      ...trendingPostsWithCounts.map((p) => ({ type: 'trending_post', data: p })),
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