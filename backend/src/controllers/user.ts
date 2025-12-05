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
    onboardingCompleted,
    primaryLanguage,
    secondaryLanguage,
    profilePicture,
    country,
    city,
    favoriteGenres,
    favoriteMovies,
    updatedAt,
    privateAccount,
    spoiler,
  } = (req.body ?? {}) as Partial<UserProfile>;

  try {
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const mergedSecondaryLanguages = Array.isArray(secondaryLanguage)
      ? Array.from(
          new Set([
            ...(Array.isArray(existingProfile.secondaryLanguage)
              ? (existingProfile.secondaryLanguage as string[])
              : []),
            ...secondaryLanguage,
          ]),
        )
      : undefined;

    const data = mapUserProfilePatchToUpdateData({
      username,
      onboardingCompleted,
      primaryLanguage,
      secondaryLanguage: mergedSecondaryLanguages,
      profilePicture,
      country,
      city,
      favoriteGenres,
      favoriteMovies,
      updatedAt,
      privateAccount,
      spoiler,
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
      // Create a minimal profile as a safety net, update null fields when onboarding complete
      await prisma.userProfile.create({
        data: {
          userId: req.user.id,
          username: req.user.username || null,
          onboardingCompleted: false,
          favoriteMovies: [],
          favoriteGenres: [],
          secondaryLanguage: [],
          profilePicture: null,
          country: null,
          city: null,
          primaryLanguage: 'English',
          privateAccount: false,
          spoiler: false,
          updatedAt: new Date(),
        },
      });
    }

    next();
  } catch (error) {
    console.error("Failed to ensure user profile:", error);
    res.status(500).json({ message: "Internal error creating user profile" });
  }
};

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
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
    
    // Fetch the full user profile from the database
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        userId: req.user.id
      }
    });

    if (!userProfile) {
      console.log(`[${timestamp}] getUserProfile failed: Profile not found for user ${req.user.id}`);
      return res.status(404).json({
        message: 'User profile not found',
        timestamp,
        endpoint: '/api/user/profile'
      });
    }

    // Map the database profile to API format
    const mappedUserProfile = mapUserProfileDbToApi({
      userId: userProfile.userId,
      username: userProfile.username,
      onboardingCompleted: userProfile.onboardingCompleted,
      primaryLanguage: userProfile.primaryLanguage,
      secondaryLanguage: Array.isArray(userProfile.secondaryLanguage) 
        ? userProfile.secondaryLanguage as string[]
        : [],
      profilePicture: userProfile.profilePicture,
      country: userProfile.country,
      city: userProfile.city,
      favoriteGenres: Array.isArray(userProfile.favoriteGenres)
        ? userProfile.favoriteGenres as string[]
        : [],
      favoriteMovies: Array.isArray(userProfile.favoriteMovies)
        ? userProfile.favoriteMovies as string[]
        : [],
      privateAccount: Boolean(userProfile.privateAccount),
      spoiler: Boolean(userProfile.spoiler),
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    });
    
    const basicUser = req.user
      ? {
          id: req.user.id,
          email: req.user.email ?? '',
          role: req.user.role ?? 'USER',
        }
      : undefined;

    try {
      console.log(
        `[${timestamp}] [AccountSettings][backend] profile payload for user ${req.user.id}:`,
        JSON.stringify({ userProfile: mappedUserProfile }, null, 2),
      );
    } catch {
      console.log(
        `[${timestamp}] [AccountSettings][backend] profile payload (raw) for user ${req.user.id}:`,
        mappedUserProfile,
      );
    }
    console.log(`[${timestamp}] getUserProfile success: Retrieved profile for user ${req.user.id}`);
    
    res.json({ 
      message: 'User profile retrieved successfully',
      userProfile: mappedUserProfile,
      user: basicUser,
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
        onboardingCompleted: userProfile.onboardingCompleted,
        primaryLanguage: userProfile.primaryLanguage,
        secondaryLanguage: Array.isArray(userProfile.secondaryLanguage) 
          ? userProfile.secondaryLanguage as string[]
          : [],
        profilePicture: userProfile.profilePicture,
        country: userProfile.country,
        city: userProfile.city,
        favoriteGenres: Array.isArray(userProfile.favoriteGenres)
          ? userProfile.favoriteGenres as string[]
          : [],
        favoriteMovies: Array.isArray(userProfile.favoriteMovies)
          ? userProfile.favoriteMovies as string[]
          : [],
        privateAccount: Boolean(userProfile.privateAccount),
        spoiler: Boolean(userProfile.spoiler),
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
        onboardingCompleted: userProfile.onboardingCompleted,
        primaryLanguage: userProfile.primaryLanguage,
        secondaryLanguage: Array.isArray(userProfile.secondaryLanguage) 
          ? userProfile.secondaryLanguage as string[]
          : [],
        profilePicture: userProfile.profilePicture ?? null,
        country: userProfile.country,
        city: userProfile.city,
        favoriteGenres: Array.isArray(userProfile.favoriteGenres)
          ? userProfile.favoriteGenres as string[]
          : [],
        favoriteMovies: Array.isArray(userProfile.favoriteMovies)
          ? userProfile.favoriteMovies as string[]
          : [],
        privateAccount: Boolean(userProfile.privateAccount),
        spoiler: Boolean(userProfile.spoiler),
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
  onboardingCompleted: boolean;
  primaryLanguage: string;
  secondaryLanguage: string[];
  profilePicture: string | null;
  country: string | null;
  city: string | null;
  favoriteGenres: string[];
  favoriteMovies: string[];
  privateAccount?: boolean | null;
  spoiler?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}): UserProfile {
  return {
    userId: row.userId,
    username: row.username,
    onboardingCompleted: row.onboardingCompleted,
    primaryLanguage: row.primaryLanguage,
    secondaryLanguage: row.secondaryLanguage ?? [],
    profilePicture: row.profilePicture,
    country: row.country,
    city: row.city,
    favoriteGenres: row.favoriteGenres ?? [],
    favoriteMovies: row.favoriteMovies ?? [],
    privateAccount: Boolean(row.privateAccount),
    spoiler: Boolean(row.spoiler),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapUserProfilePatchToUpdateData(
  patch: Partial<Pick<
    UserProfile,
    "username" | "onboardingCompleted" | "primaryLanguage" | "secondaryLanguage" | "profilePicture" | "country" | "city" | "favoriteGenres" | "favoriteMovies" | "updatedAt" | "privateAccount" | "spoiler"
  >>
): Prisma.UserProfileUpdateInput {
  const data: Prisma.UserProfileUpdateInput = {};

  if (Object.prototype.hasOwnProperty.call(patch, "username")) {
    data.username = patch.username ?? null;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "onboardingCompleted")) {
    data.onboardingCompleted = patch.onboardingCompleted;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "primaryLanguage")) {
    data.primaryLanguage = patch.primaryLanguage;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "secondaryLanguage")) {
    data.secondaryLanguage = patch.secondaryLanguage ?? [];
  }
  if (Object.prototype.hasOwnProperty.call(patch, "profilePicture")) {
    data.profilePicture = patch.profilePicture;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "country")) {
    data.country = patch.country;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "city")) {
    data.city = patch.city;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "favoriteGenres")) {
    data.favoriteGenres = patch.favoriteGenres ?? [];
  }
  if (Object.prototype.hasOwnProperty.call(patch, "favoriteMovies")) {
    data.favoriteMovies = patch.favoriteMovies ?? [];
  }
  if (Object.prototype.hasOwnProperty.call(patch, "privateAccount")) {
    data.privateAccount = patch.privateAccount ?? false;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "spoiler")) {
    data.spoiler = patch.spoiler ?? false;
  }

  // Always refresh updatedAt to now unless caller explicitly provided one
  data.updatedAt = patch.updatedAt ?? new Date();

  return data;
}
