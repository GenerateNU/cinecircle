import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import { prisma } from '../services/db.js';

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
  
    const {
      username,
      preferredLanguages,
      preferredCategories,
      favoriteMovies,
    } = req.body;
  
    try {
      const updated = await prisma.userProfile.update({
        where: { userId: user.id },
        data: {
          username,
          preferredLanguages,
          preferredCategories,
          favoriteMovies,
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