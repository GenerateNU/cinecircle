import { Router } from "express";
import { ping, dbTest, serveSwagger } from "../controllers/health";
import {
  deleteMovie,
  getMovie,
  getMovieById,
  updateMovie,
} from "../controllers/tmdb";
import { deleteUserProfile, ensureUserProfile, getUserProfile, updateUserProfile } from '../controllers/user';
import { authenticateUser } from '../middleware/auth';
import { protect } from "../controllers/protected";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../controllers/userFollows";

const router = Router();

router.get("/api/ping", ping);
router.get("/api/db-test", dbTest);
router.get("/swagger-output.json", serveSwagger);

// everything under here is a private endpoint
router.use('/api', authenticateUser, ensureUserProfile); 

// test protected endpoints
router.get('/api/protected', protect);
  
// get current user info
router.get('/api/user/profile', getUserProfile);
router.put("/api/user/profile", updateUserProfile);
router.delete("/api/user/profile", deleteUserProfile);

// User follow routes
router.post('/api/user/follow', followUser);
router.post('/api/user/unfollow', unfollowUser);
router.get('/api/user/:userId/followers', getFollowers);
router.get('/api/user/:userId/following', getFollowing);

// Movie + TMDB routes
router.get("/movies/:movieId", getMovie);
router.get("/movies/cinecircle/:movieId", getMovieById);
router.put("/movies/cinecircle/:movieId", updateMovie);
router.delete("/movies/:movieId", deleteMovie);

export default router;
