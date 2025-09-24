import { Router } from 'express';
import { ping, dbTest, serveSwagger } from '../controllers/health.js';

const router = Router();

router.get('/api/ping', ping);
router.get('/api/db-test', dbTest);
router.get('/swagger-output.json', serveSwagger);

export default router;
