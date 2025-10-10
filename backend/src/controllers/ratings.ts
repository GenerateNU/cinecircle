import { PrismaClient } from '@prisma/client';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import type { Response } from 'express';

const prisma = new PrismaClient();

export const createRating = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] createRating called by user: ${req.user?.id || 'unknown'}`);
  
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
        timestamp,
        endpoint: '/api/ratings'
      });
    }

    // Validation for number of stars
    const stars = parseInt(req.body.stars, 10);
    if (stars < 0 || stars > 5) {
      return res.status(400).json({ message: 'Stars must be between 0 and 5', timestamp, endpoint: '/api/ratings' });
    }

    
    const newRatingData = {
      userId: req.user.id,
      movieId: req.body.movieId,
      stars: stars,
      comment: req.body.comment?.trim(),
      tags: req.body.tags || [],
      date: new Date(),
      votes: 0,
      threadedComments: [],
    };

    const newRating = await prisma.rating.create({
      data: newRatingData,
    });


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
