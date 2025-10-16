import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import { prisma } from '../services/db.js';
import { UserProfile as ApiUserProfile} from '../types/models.js';
import { PrismaClient, UserProfile as PrismaUserProfile } from '@prisma/client';

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const data = toUserProfileUpdateData(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updated = await prisma.userProfile.update({
      where: { userId: user.id },
      data,
    });

    res.json({ message: "Profile updated", data: toUserProfileResponse(updated) });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
  
  export const deleteUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
  
    try {
      await prisma.userProfile.delete({
        where: { userId: user.id },
      });
  
      res.json({ message: "User profile deleted" });
    } catch (error) {
      console.error("deleteUserProfile error:", error);
      res.status(500).json({ message: "Failed to delete profile" });
    }
  };
  

export const ensureUserProfile = async (req: AuthenticatedRequest, res: Response, next: Function) => {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    try {
      const existing = await prisma.userProfile.findUnique({
        where: { userId: req.user.id },
      });
  
      if (!existing) {
        await prisma.userProfile.create({
          data: {
            userId: req.user.id,
            username: req.user.email?.split("@")[0], // default username
          },
        });
        console.log(`Created new user profile for user ${req.user.id}`);
      }
  
      next();
    } catch (error) {
      console.error("Failed to ensure user profile:", error);
      res.status(500).json({ message: "Internal error creating user profile" });
    }
  };

export const getUserProfile = (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] getUserProfile called by user: ${req.user?.id || 'unknown'}`);
  
  try {
    if (!req.user) {
      console.log(`[${timestamp}] getUserProfile failed: No user in request`);
      return res.status(401).json({ 
        message: 'User not authenticated',
        timestamp,
        endpoint: '/api/user/profile'
      });
    }
    
    const userProfile = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    };
    
    console.log(`[${timestamp}] getUserProfile success: Retrieved profile for user ${req.user.id}`);
    
    res.json({ 
      message: 'User profile retrieved successfully',
      user: userProfile,
      timestamp,
      endpoint: '/api/user/profile'
    });
  } catch (error) {
    console.error(`[${timestamp}] getUserProfile error:`, error);
    res.status(500).json({
      message: 'Internal server error while retrieving user profile',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/user/profile'
    });
  }
};

export const getUserRatings = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.query;
  
    if (!user_id || typeof user_id !== 'string') {
      res.status(400).json({ message: "Missing or invalid 'user_id' parameter" });
      return;
    }
  
    try {
      const ratings = await prisma.rating.findMany({
        where: { userId: user_id },
        orderBy: { date: 'desc' },
        include: {
          threadedComments: true,
        },
      });
  
      res.json({ message: "User ratings retrieved", ratings });
    } catch (error) {
      console.error("getUserRatings error:", error);
      res.status(500).json({ message: "Internal server error while fetching ratings" });
    }
  };
  
  export const getUserComments = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.query;
  
    if (!user_id || typeof user_id !== 'string') {
      res.status(400).json({ message: "Missing or invalid 'user_id' parameter" });
      return;
    }
  
    try {
      const comments = await prisma.comment.findMany({
        where: { userId: user_id },
        orderBy: { createdAt: 'desc' },
        include: {
          rating: true,
          post: true,
        },
      });
  
      res.json({ message: "User comments retrieved", comments });
    } catch (error) {
      console.error("getUserComments error:", error);
      res.status(500).json({ message: "Internal server error while fetching comments" });
    }
  };
  
  export function toUserProfileResponse(row: PrismaUserProfile): ApiUserProfile {
  return {
    userId: row.userId,
    username: row.username ?? null,
    preferredLanguages: Array.isArray(row.preferredLanguages) ? row.preferredLanguages : [],
    preferredCategories: Array.isArray(row.preferredCategories) ? row.preferredCategories : [],
    favoriteMovies: Array.isArray(row.favoriteMovies) ? row.favoriteMovies : [],
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

/**
 * Request body -> Prisma update data
 * - Optional: guards to accept only arrays of strings
 * - Ignores undefined fields so partial updates work
 */
export function toUserProfileUpdateData(body: any) {
  const data: Partial<PrismaUserProfile> = {};

  if (typeof body?.username === "string" || body?.username === null) {
    // Prisma accepts `null` for optional String? (it will set to NULL)
    // If you don't want to allow nulling, remove the `=== null` branch.
    // @ts-ignore - this is not the exact Prisma type but will be assigned to update input
    data.username = body.username;
  }

  if (Array.isArray(body?.preferredLanguages)) {
    // (Optional) validate all strings:
    if (body.preferredLanguages.every((s: unknown) => typeof s === "string")) {
      // @ts-ignore
      data.preferredLanguages = body.preferredLanguages;
    }
  }

  if (Array.isArray(body?.preferredCategories)) {
    if (body.preferredCategories.every((s: unknown) => typeof s === "string")) {
      // @ts-ignore
      data.preferredCategories = body.preferredCategories;
    }
  }

  if (Array.isArray(body?.favoriteMovies)) {
    if (body.favoriteMovies.every((s: unknown) => typeof s === "string")) {
      // @ts-ignore
      data.favoriteMovies = body.favoriteMovies;
    }
  }

  return data;
}