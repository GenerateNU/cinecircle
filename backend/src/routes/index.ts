import { Router } from 'express';
import { ping, dbTest, serveSwagger } from '../controllers/health.ts';
import { getUserProfile } from '../controllers/user.ts';
import { authenticateUser } from '../middleware/auth.ts';

const router = Router();

router.get('/api/ping', ping);
router.get('/api/db-test', dbTest);
router.get('/swagger-output.json', serveSwagger);

router.get('/api/protected', authenticateUser, (req, res) => {
    res.json({ message: 'You are authenticated', user: (req as any).user })
  })

router.get('/api/user/profile', authenticateUser, getUserProfile);

export default router;
