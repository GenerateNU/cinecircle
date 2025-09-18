import { Router } from 'express';
import { ping, dbTest, serveSwagger } from '../controllers/health.ts';
import { getMovie } from '../controllers/tmdb.ts';

const router = Router();

router.get('/api/ping', ping);
router.get('/api/db-test', dbTest);
router.get('/swagger-output.json', serveSwagger);
router.get('/api/test-tmdb/:movieId', getMovie);

export default router;
