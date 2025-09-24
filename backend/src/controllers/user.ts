import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import { profile } from 'console';

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
      uid: req.user.id,
      id: req.user.profile.id,
      email: req.user.profile.email,
      role: req.user.profile.role,
      bio: req.user.profile.bio,
      favoriteMovies: req.user.profile.favoriteMovies
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

export const updateUserProfile = (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] updateUserProfile called by user: ${req.user?.id || 'unknown'}`);
  try {
      if (!req.user) {
        console.log(`[${timestamp}] updateUserProfile failed: No user in request`);
        return res.status(401).json({ 
          message: 'User not authenticated',
          timestamp,
          endpoint: '/api/user/profile'
      });
    }

    const updatedUserProfile = {
      uid: req.user.id,
      id: req.user.profile.id,
      email: req.body.email,
      role: req.body.role,
      bio: req.body.bio,
      favoriteMovies: req.body.favoriteMovies,
    }

    console.log(`[${timestamp}] updateUserProfile success: Updated profile for user ${req.user.id}`);

    res.json({ 
      message: 'User profile updated successfully',
      user: updatedUserProfile,
      timestamp,
      endpoint: '/api/user/profile'
    });

  } catch (error) {
    console.error(`[${timestamp}] updateUserProfile error:`, error);
    res.status(500).json({
      message: 'Internal server error while updating user profile',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/user/profile'
    });
  }
}

export const updateUserBio = (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] updateUserBio called by user: ${req.user?.id || 'unknown'}`);

  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
        timestamp,
        endpoint: '/api/user/profile/bio'
      });
    }

    req.user.profile.bio = req.body.bio;

    res.json({
      message: 'User bio updated successfully',
      bio: req.body.bio,
      timestamp,
      endpoint: '/api/user/profile/bio'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error while updating bio',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/user/profile/bio'
    });
  }
};

export const updateUserFavorites = (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] updateUserFavorites called by user: ${req.user?.id || 'unknown'}`);

  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not authenticated',
        timestamp,
        endpoint: '/api/user/profile/favorites'
      });
    }

    req.user.profile.favoriteMovies = req.body.favoriteMovies;

    res.json({
      message: 'Favorite movies updated successfully',
      favoriteMovies: req.body.favoriteMovies,
      timestamp,
      endpoint: '/api/user/profile/favorites'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error while updating favorites',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/user/profile/favorites'
    });
  }
};