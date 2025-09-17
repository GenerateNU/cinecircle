import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.ts';

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
      id: req.user.id,
      email: req.body.email || req.user.email,
      role: req.body.role || req.user.role,
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