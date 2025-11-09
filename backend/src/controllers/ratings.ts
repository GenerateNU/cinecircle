import { PrismaClient } from '@prisma/client';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import type { Response } from 'express';

const prisma = new PrismaClient();

export const createRating = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const timestamp = new Date().toISOString();
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    const stars = parseInt(req.body.stars, 10);
    if (stars < 0 || stars > 5) {
      return res.status(400).json({
        message: 'Stars must be between 0 and 5',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    const newRatingData = {
      userId: req.user.id,
      movieId: req.body.movieId,
      stars,
      comment: req.body.comment?.trim(),
      tags: req.body.tags || [],
      date: new Date(),
      votes: 0,
    };
    const newRating = await prisma.rating.create({ data: newRatingData });
    return res.status(201).json({
      message: 'Rating created successfully',
      rating: newRating,
      timestamp,
      endpoint: '/api/ratings',
    });
  } catch (error) {
    console.error(`[${timestamp}] createRating error:`, error);
    return res.status(500).json({
      message: 'Internal server error while creating rating',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/ratings',
    });
  }
};

export const getRatings = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    const ratings = await prisma.rating.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
    });
    return res.status(200).json({
      message: 'Ratings retrieved successfully',
      ratings,
      timestamp,
      endpoint: '/api/ratings',
    });
  } catch (error) {
    console.error(`[${timestamp}] getRatings error:`, error);
    return res.status(500).json({
      message: 'Internal server error while retrieving ratings',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/ratings',
    });
  }
};

export const getRatingById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const timestamp = new Date().toISOString();
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    const rating = await prisma.rating.findUnique({
      where: { id: req.params.id },
    });
    if (!rating || rating.userId !== req.user.id) {
      return res.status(404).json({
        message: 'Rating not found',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    return res.status(200).json({
      message: 'Rating retrieved successfully',
      rating,
      timestamp,
      endpoint: `/api/ratings/${req.params.id}`,
    });
  } catch (error) {
    console.error(`[${timestamp}] getRatingById error:`, error);
    return res.status(500).json({
      message: 'Internal server error while retrieving rating',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: `/api/ratings/${req.params.id}`,
    });
  }
};

export const updateRating = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const timestamp = new Date().toISOString();
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    const existing = await prisma.rating.findUnique({
      where: { id: req.params.id },
    });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({
        message: 'Rating not found',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    const stars = parseInt(req.body.stars, 10);
    if (isNaN(stars) || stars < 0 || stars > 5) {
      return res.status(400).json({
        message: 'Stars must be between 0 and 5',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    const updated = await prisma.rating.update({
      where: { id: req.params.id },
      data: {
        stars,
        comment: req.body.comment?.trim(),
        tags: req.body.tags || [],
      },
    });
    return res.status(200).json({
      message: 'Rating updated successfully',
      rating: updated,
      timestamp,
      endpoint: `/api/ratings/${req.params.id}`,
    });
  } catch (error) {
    console.error(`[${timestamp}] updateRating error:`, error);
    return res.status(500).json({
      message: 'Internal server error while updating rating',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: `/api/ratings/${req.params.id}`,
    });
  }
};

export const deleteRating = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const timestamp = new Date().toISOString();
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    const existing = await prisma.rating.findUnique({
      where: { id: req.params.id },
    });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({
        message: 'Rating not found',
        timestamp,
        endpoint: '/api/ratings',
      });
    }
    await prisma.rating.delete({ where: { id: req.params.id } });
    return res.status(200).json({
      message: 'Rating deleted',
      timestamp,
      endpoint: `/api/ratings/${req.params.id}`,
    });
  } catch (error) {
    console.error(`[${timestamp}] deleteRating error:`, error);
    return res.status(500).json({
      message: 'Internal server error while deleting rating',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: `/api/ratings/${req.params.id}`,
    });
  }
};
