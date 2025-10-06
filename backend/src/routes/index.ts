import { Router } from "express";
import { ping, dbTest, serveSwagger } from "../controllers/health";
import {
  deleteMovie,
  getMovie,
  getMovieById,
  updateMovie,
} from "../controllers/tmdb";

const router = Router();

router.get("/api/ping", ping);
router.get("/api/db-test", dbTest);
router.get("/swagger-output.json", serveSwagger);

// Movie + TMDB routes
router.get("/movies/:movieId", getMovie);
router.get("/movies/cinecircle/:movieId", getMovieById);
router.put("/movies/cinecircle/:movieId", updateMovie);
router.delete("/movies/:movieId", deleteMovie);

export default router;
