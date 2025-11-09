import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import { prisma } from '../services/db.js';
import { Prisma } from "@prisma/client";
import { UserProfile } from "../types/models";

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const {
    username,
    preferredLanguages,
    preferredCategories,
    favoriteMovies,
    updatedAt,
  } = (req.body ?? {}) as Partial<UserProfile>;

  try {
    const data = mapUserProfilePatchToUpdateData({
      username,
      preferredLanguages,
      preferredCategories,
      favoriteMovies,
      updatedAt,
    });

    const updated = await prisma.userProfile.update({
      where: { userId: user.id },
      data,
    });

    res.json({ message: "Profile updated", data: mapUserProfileDbToApi(updated) });
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
            username: req.user.username || null,
            updatedAt: new Date(), // Add this line
          }
        });
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

  if (!user_id || typeof user_id !== "string") {
    res.status(400).json({ message: "Missing or invalid 'user_id' parameter" });
    return;
  }

  try {
    const ratings = await prisma.rating.findMany({
      where: { userId: user_id },
      orderBy: { date: "desc" },
      include: { Comment: true },
    });

    // Fetch user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: user_id },
    });

    // Map user profile if it exists, with proper type conversion
    let mappedUserProfile = null;
    if (userProfile) {
      mappedUserProfile = mapUserProfileDbToApi({
        userId: userProfile.userId,
        username: userProfile.username,
        preferredLanguages: Array.isArray(userProfile.preferredLanguages) 
          ? userProfile.preferredLanguages as string[]
          : [],
        preferredCategories: Array.isArray(userProfile.preferredCategories)
          ? userProfile.preferredCategories as string[]
          : [],
        favoriteMovies: Array.isArray(userProfile.favoriteMovies)
          ? userProfile.favoriteMovies as string[]
          : [],
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt,
      });
    }

    res.json({ 
      message: "User ratings retrieved", 
      ratings,
      userProfile: mappedUserProfile,
    });
  } catch (error) {
    console.error("getUserRatings error:", error);
    res.status(500).json({ message: "Internal server error while fetching ratings" });
  }
};

export const getUserComments = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.query;

  if (!user_id || typeof user_id !== "string") {
    res.status(400).json({ message: "Missing or invalid 'user_id' parameter" });
    return;
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { userId: user_id },
      orderBy: { createdAt: "desc" },
      include: { Rating: true, Post: true },
    });

    // Fetch user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: user_id },
    });

    // Map user profile if it exists, with proper type conversion
    let mappedUserProfile = null;
    if (userProfile) {
      mappedUserProfile = mapUserProfileDbToApi({
        userId: userProfile.userId,
        username: userProfile.username,
        preferredLanguages: Array.isArray(userProfile.preferredLanguages) 
          ? userProfile.preferredLanguages as string[]
          : [],
        preferredCategories: Array.isArray(userProfile.preferredCategories)
          ? userProfile.preferredCategories as string[]
          : [],
        favoriteMovies: Array.isArray(userProfile.favoriteMovies)
          ? userProfile.favoriteMovies as string[]
          : [],
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt,
      });
    }

    res.json({ 
      message: "User comments retrieved", 
      comments,
      userProfile: mappedUserProfile,
    });
  } catch (error) {
    console.error("getUserComments error:", error);
    res.status(500).json({ message: "Internal server error while fetching comments" });
  }
};

const toDate = (v?: string) => (v ? new Date(v) : undefined);
const toISO = (d?: Date) => (d ? d.toISOString() : undefined);

// -------- DB → API --------
export function mapUserProfileDbToApi(row: {
  userId: string;
  username: string | null;
  preferredLanguages: string[];
  preferredCategories: string[];
  favoriteMovies: string[];
  createdAt: Date;
  updatedAt: Date;
}): UserProfile {
  return {
    userId: row.userId,
    username: row.username,
    preferredLanguages: row.preferredLanguages ?? [],
    preferredCategories: row.preferredCategories ?? [],
    favoriteMovies: row.favoriteMovies ?? [],
    createdAt: toISO(row.createdAt),
    updatedAt: toISO(row.updatedAt),
  };
}

export function mapUserProfilePatchToUpdateData(
  patch: Partial<Pick<
    UserProfile,
    "username" | "preferredLanguages" | "preferredCategories" | "favoriteMovies" | "updatedAt"
  >>
): Prisma.UserProfileUpdateInput {
  const data: Prisma.UserProfileUpdateInput = {};

  if (Object.prototype.hasOwnProperty.call(patch, "username")) {
    data.username = patch.username ?? null;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "preferredLanguages")) {
    data.preferredLanguages = patch.preferredLanguages ?? [];
  }
  if (Object.prototype.hasOwnProperty.call(patch, "preferredCategories")) {
    data.preferredCategories = patch.preferredCategories ?? [];
  }
  if (Object.prototype.hasOwnProperty.call(patch, "favoriteMovies")) {
    data.favoriteMovies = patch.favoriteMovies ?? [];
  }

  // Always refresh updatedAt to now unless caller explicitly provided one
  data.updatedAt = toDate(patch.updatedAt) ?? new Date();

  return data;
}
