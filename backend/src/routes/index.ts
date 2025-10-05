import { Router } from 'express';
import { ping, dbTest, serveSwagger } from '../controllers/health.ts';
import { getMovie, updateMovie, deleteMovie } from '../controllers/tmdb.ts';

const router = Router();

router.get('/api/ping', ping);
router.get('/api/db-test', dbTest);
router.get('/swagger-output.json', serveSwagger);
//router.get('/api/test-tmdb/:movieId', getMovie);
router.get("/movies/:movieId", getMovie);
router.put("/movies/cinecircle/:movieId", updateMovie);
router.delete("/movies/:movieId", deleteMovie);

export default router;
