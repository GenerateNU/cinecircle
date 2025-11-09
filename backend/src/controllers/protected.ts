import type { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

export const protect = async (req: AuthenticatedRequest, res: Response) => {
  const timestamp = new Date().toISOString();
  const authenticatedReq = req as any;

  console.log(
    `[${timestamp}] Protected endpoint called by user: ${authenticatedReq.user?.id || 'unknown'}`
  );

  try {
    res.json({
      message: 'You are authenticated',
      user: authenticatedReq.user,
      timestamp,
      endpoint: '/api/protected',
    });
    console.log(`[${timestamp}] Protected endpoint response sent successfully`);
  } catch (error) {
    console.error(`[${timestamp}] Protected endpoint error:`, error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/protected',
    });
  }
};
