import { Router } from "express";
import { ping, dbTest, serveSwagger } from "../controllers/health";
import {
  deleteMovie,
  getMovie,
  getMovieById,
  updateMovie,
} from "../controllers/tmdb";
import { deleteUserProfile, ensureUserProfile, getUserComments, getUserProfile, getUserRatings, updateUserProfile } from '../controllers/user';
import { authenticateUser } from '../middleware/auth';
import { protect } from "../controllers/protected";
import { getLocalEvent, createLocalEvent, updateLocalEvent, deleteLocalEvent, getLocalEvents } from "../controllers/local-events"
import { followUser, unfollowUser, getFollowers, getFollowing } from "../controllers/userFollows";
import { getComment, createComment, updateComment, deleteComment, getMovieComments} from "../controllers/comment"
import { createRating, getRatings, getRatingById, deleteRating, updateRating,getMovieRatings } from "../controllers/ratings";
import { getAllMovies } from "../controllers/movies";
import { createPost, getPostById, getPosts, updatePost, deletePost, toggleLikePost, getPostLikes, getPostReplies } from "../controllers/post.js";
import { searchMovies, searchUsers, searchReviews, searchPosts } from "../controllers/search.js";
import { getHomeFeed } from "../controllers/feed";
// backend/src/routes/index.ts

const router = Router();

router.get("/api/ping", ping);
router.get("/api/db-test", dbTest);

// Legacy endpoint
router.get("/swagger-output.json", serveSwagger);  

//OpenAPI 3.0 spec
router.get("/openapi.json", serveSwagger);

router.get("/movies", getAllMovies);

// everything under here is a private endpoint
router.use('/api', authenticateUser, ensureUserProfile); 

// test protected endpoints
router.get('/api/protected', protect);
  
// User Profile Routes
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

router.get("/api/feed", getHomeFeed);

// Comment routes
router.post("/api/comment", createComment);
router.get("/api/comment/:id", getComment)
router.put("/api/comment/:id", updateComment);
router.delete("/api/comment/:id", deleteComment);
router.get("/api/:movieId/comments", getMovieComments);
// Ratings routes
router.post('/api/ratings', createRating);
router.get('/api/ratings', getRatings);
router.get('/api/ratings/:id', getRatingById);
router.put('/api/ratings/:id', updateRating);
router.delete('/api/ratings/:id', deleteRating);
router.get("/api/:movieId/ratings", getMovieRatings);


// Local events routes
router.get("/api/local-events", getLocalEvents);
router.get("/api/local-event/:id", getLocalEvent);
router.post("/api/local-event", createLocalEvent);
router.delete("/api/local-event/:id", deleteLocalEvent);
router.put("/api/local-event/:id", updateLocalEvent);
//router.get("/api/local-event/rsvp/:id", getLocalEventRsvp);

//Ratings routes
router.post('api/ratings', createRating);
router.get('api/ratings', getRatings);
router.get('api/ratings/:id', getRatingById);
router.put('api/ratings/:id', updateRating);
router.delete('api/ratings/:id', deleteRating);

// Post routes
router.post("/post", createPost);
router.get("/posts", getPosts);
router.get("/post/:postId", getPostById);
router.put("/post/:postId", updatePost);
router.delete("/post/:postId", deletePost);

router.post("/post/:postId/like", toggleLikePost);
router.get("/post/:postId/likes", getPostLikes);
router.get("/:postId/replies", getPostReplies);

// Search routes
router.get("/api/search/movies", searchMovies)
router.get("/api/search/users", searchUsers)
router.get("/api/search/reviews", searchReviews)
router.get("/api/search/posts", searchPosts)

export default router;
