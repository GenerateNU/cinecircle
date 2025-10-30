import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import { prisma } from '../services/db.js';
import type { UserProfile as ApiUserProfile, UserProfileBasic } from "../types/models";
import type { UserProfile as PrismaUserProfile } from "@prisma/client";

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const {
    username,
    preferredLanguages,
    preferredCategories,
    favoriteMovies,
  } = req.body as {
    username?: string | null;
    preferredLanguages?: string[];
    preferredCategories?: string[];
    favoriteMovies?: string[];
  };

  // Build an API-level "patch" and let the mapper convert it to Prisma update data
  const patch = {
    username,
    preferredLanguages,
    preferredCategories,
    favoriteMovies,
  };

  // If nothing was provided, short-circuit
  if (
    patch.username === undefined &&
    patch.preferredLanguages === undefined &&
    patch.preferredCategories === undefined &&
    patch.favoriteMovies === undefined
  ) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updated = await prisma.userProfile.update({
      where: { userId: user.id },
      data: toUserProfileUpdateData(patch), // -> uses { set: [...] } for String[]
    });

    // Normalize DB row -> API DTO (coerce dates to ISO, arrays to string[])
    const dto = toUserProfileResponseFromDb(updated);

    return res.json({
      message: "Profile updated",
      // merge preserves DB-only fields (e.g., createdAt as Date) while DTO normalizes API types
      data: { ...updated, ...dto },
    });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
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
  
const toISO = (d: unknown): string | undefined => {
  if (!d) return undefined;
  if (d instanceof Date) return d.toISOString();
  if (typeof d === "string") return d;
  return undefined;
};

const asStringArray = (v: unknown, fallback: string[] = []): string[] =>
  Array.isArray(v) ? (v as unknown[]).map(String) : fallback;

export function toUserProfileResponseFromDb(
  row: Partial<PrismaUserProfile> & Record<string, any>
): ApiUserProfile {
  return {
    userId: String(row.userId),
    username: row.username ?? null,
    preferredLanguages: asStringArray(row.preferredLanguages, []),
    preferredCategories: asStringArray(row.preferredCategories, []),
    favoriteMovies: asStringArray(row.favoriteMovies, []),
    createdAt: toISO(row.createdAt),
    updatedAt: toISO(row.updatedAt),
  };
}

type UserProfileCreateData = Parameters<typeof prisma.userProfile.create>[0]["data"];
type UserProfileUpdateData = Parameters<typeof prisma.userProfile.update>[0]["data"];

export function toUserProfileCreateData(input: ApiUserProfile): UserProfileCreateData {
  return {
    userId: input.userId,
    username: input.username ?? undefined,
    // On CREATE, Postgres String[] columns accept direct arrays
    preferredLanguages: asStringArray(input.preferredLanguages, []),
    preferredCategories: asStringArray(input.preferredCategories, []),
    favoriteMovies: asStringArray(input.favoriteMovies, []),
    // createdAt/updatedAt are DB-managed
  };
}

export function toUserProfileUpdateData(input: Partial<ApiUserProfile>): UserProfileUpdateData {
  const data: UserProfileUpdateData = {};

  if (input.username !== undefined) data.username = input.username;

  // For String[] in Postgres, UPDATE needs `{ set: [...] }`
  if (input.preferredLanguages !== undefined) {
    data.preferredLanguages = { set: asStringArray(input.preferredLanguages, []) } as any;
  }
  if (input.preferredCategories !== undefined) {
    data.preferredCategories = { set: asStringArray(input.preferredCategories, []) } as any;
  }
  if (input.favoriteMovies !== undefined) {
    data.favoriteMovies = { set: asStringArray(input.favoriteMovies, []) } as any;
  }

  return data;
}

/**
 * Maps an auth/user source (e.g., Supabase auth.users) into your lightweight UserProfileBasic.
 * These fields are NOT part of Prisma.UserProfile; they likely come from your auth table.
 */
export function toUserProfileBasic(row: any): UserProfileBasic {
  return {
    id: row?.id ? String(row.id) : undefined,
    email: row?.email ?? null,
    role: row?.role ?? null,
  };
}