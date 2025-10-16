import { Router } from "express";
import { ping, dbTest, serveSwagger } from "../controllers/health.js";
import {
  deleteMovie,
  getMovie,
  getMovieById,
  updateMovie,
} from "../controllers/tmdb.js";
import { deleteUserProfile, ensureUserProfile, getUserComments, getUserProfile, getUserRatings, updateUserProfile } from '../controllers/user.js';  // ← Add .js
import { authenticateUser } from '../middleware/auth.js';
import { protect } from "../controllers/protected.js";
import { followUser, unfollowUser, getFollowers, getFollowing } from "../controllers/userFollows.js";
import { searchMovies, searchUsers, searchReviews, searchPosts } from "../controllers/search.js";

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
router.get("/api/user/ratings", getUserRatings);
router.get("/api/user/comments", getUserComments);


// Movie + TMDB routes
router.get("/movies/:movieId", getMovie);
router.get("/movies/cinecircle/:movieId", getMovieById);
router.put("/movies/cinecircle/:movieId", updateMovie);
router.delete("/movies/:movieId", deleteMovie);

// Search routes
router.get("/api/search/movies", searchMovies)
router.get("/api/search/users", searchUsers)
router.get("/api/search/reviews", searchReviews)
router.get("/api/search/posts", searchPosts)

export default router;
