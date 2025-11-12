import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import { prisma } from '../services/db.js';

export const createUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const {
    username,
    primaryLanguage,
    secondaryLanguage,
    profilePicture,
    country,
    city,
    favoriteGenres,
  } = req.body;

  try {
    const existing = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (existing) {
      return res.status(409).json({ 
        message: "Profile already exists for this user" 
      });
    }

    const profile = await prisma.userProfile.create({
      data: {
        userId: user.id,
        username,
        primaryLanguage,
        secondaryLanguage,
        profilePicture,
        country,
        city,
        favoriteGenres,
        updatedAt: new Date(),
      },
    });

    res.status(201).json({ 
      message: "Profile created successfully", 
      data: profile
    });
  } catch (error) {
    console.error("createUserProfile error:", error);
    res.status(500).json({ message: "Failed to create profile" });
  }
};

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const updated = await prisma.userProfile.update({
      where: { userId: user.id },
      data: {
        ...req.body,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Profile updated", data: updated });
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
          updatedAt: new Date(),
        }
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

    // Get full user profile from database
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: req.user.id },
    });
    
    console.log(`[${timestamp}] getUserProfile success: Retrieved profile for user ${req.user.id}`);
    
    res.json({ 
      message: 'User profile retrieved successfully',
      data: userProfile,
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

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: user_id },
    });

    res.json({ 
      message: "User ratings retrieved", 
      ratings,
      userProfile,
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

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: user_id },
    });

    res.json({ 
      message: "User comments retrieved", 
      comments,
      userProfile,
    });
  } catch (error) {
    console.error("getUserComments error:", error);
    res.status(500).json({ message: "Internal server error while fetching comments" });
  }
};
