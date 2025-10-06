import { Router } from "express";
import { ping, dbTest, serveSwagger } from "../controllers/health";
import {
  deleteMovie,
  getMovie,
  getMovieById,
  updateMovie,
} from "../controllers/tmdb";
import { getUserProfile } from '../controllers/user';
import { authenticateUser } from '../middleware/auth';
import { protect } from "../controllers/protected";

const router = Router();

router.get("/api/ping", ping);
router.get("/api/db-test", dbTest);
router.get("/swagger-output.json", serveSwagger);

// everything under here is a private endpoint
router.use('/api', authenticateUser); 

// test protected endpoints
router.get('/api/protected', protect);
  
// get current user info
router.get('/api/user/profile', getUserProfile);

// Movie + TMDB routes
router.get("/movies/:movieId", getMovie);
router.get("/movies/cinecircle/:movieId", getMovieById);
router.put("/movies/cinecircle/:movieId", updateMovie);
router.delete("/movies/:movieId", deleteMovie);

export default router;
