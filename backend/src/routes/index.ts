import { Router } from 'express';
import { ping, dbTest, serveSwagger } from '../controllers/health';
import { getUserProfile } from '../controllers/user';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.get('/api/ping', ping);
router.get('/api/db-test', dbTest);
router.get('/swagger-output.json', serveSwagger);

router.get('/api/protected', authenticateUser, (req, res) => {
  const timestamp = new Date().toISOString();
  const authenticatedReq = req as any;
  
  console.log(`[${timestamp}] Protected endpoint called by user: ${authenticatedReq.user?.id || 'unknown'}`);
  
  try {
    res.json({ 
      message: 'You are authenticated', 
      user: authenticatedReq.user,
      timestamp,
      endpoint: '/api/protected'
    });
    console.log(`[${timestamp}] Protected endpoint response sent successfully`);
  } catch (error) {
    console.error(`[${timestamp}] Protected endpoint error:`, error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/protected'
    });
  }
})

router.get('/api/user/profile', authenticateUser, getUserProfile);

export default router;
