// backend/src/controllers/movies.ts
import type { Request, Response } from "express";
import { prisma } from "../services/db.js";
import type { Movie } from "../types/models";
import type { GetMovieSummaryEnvelope } from '../types/models';
import { generateMovieSummary } from '../services/summaryService.js';


function mapPrismaMovie(m: any): Movie {
  // Normalize languages: JsonValue -> string[] | null
  let languages: string[] | null = null;

  if (Array.isArray(m.languages)) {
    languages = m.languages as string[];
  } else if (typeof m.languages === "string") {
    try {
      const parsed = JSON.parse(m.languages);
      if (Array.isArray(parsed)) {
        languages = parsed as string[];
      }
    } catch {
      languages = null;
    }
  }

  return {
    movieId: m.movieId,
    localRating: m.localRating, // or Number(m.localRating) if your Movie expects number
    imdbRating: m.imdbRating != null ? Number(m.imdbRating) : null,
    languages,
    title: m.title,
    description: m.description,
    numRatings: m.numRatings, // or Number(m.numRatings)
    imageUrl: m.imageUrl || null,
  };
}

// GET /movies
export async function getAllMovies(req: Request, res: Response) {
  try {
    console.log("GET /movies: handler called");

    const moviesFromDb = await prisma.movie.findMany();
    console.log("GET /movies: RAW result:", moviesFromDb);  // 👈 add this

    const movies: Movie[] = moviesFromDb.map(mapPrismaMovie);

    return res.status(200).json({
      movies,
      count: movies.length,
    });
  } catch (err) {
    console.error("Error in GET /movies:", err);
    return res.status(500).json({
      error: "Failed to fetch movies",
    });
  }
}

export async function getMovieSummaryHandler(req: Request, res: Response) {
  const movieId = req.params.movieId;

  try {
    const summary = await generateMovieSummary(movieId);
    return res.status(200).json({ summary });
  } catch (err: any) {
    console.error('getMovieSummaryHandler error:', err); // ⬅️ check this in backend logs
    return res.status(500).json({
      message: 'Failed to generate AI summary',
      error: err?.message,
    });
  }
}
// GET /movies/after/:year
export async function getMoviesAfterYear(req: Request, res: Response) {
  try {
    const year = Number(req.params.year);

    if (isNaN(year)) {
      return res.status(400).json({ error: "Invalid year parameter" });
    }

    const moviesFromDb = await prisma.movie.findMany({
      where: {
        releaseYear: {
          gte: year,
        },
      },
      orderBy: {
        releaseYear: "asc",
      },
    });

    const movies = moviesFromDb.map(mapPrismaMovie);

    return res.status(200).json({
      movies,
      count: movies.length,
      afterYear: year,
    });
  } catch (err) {
    console.error("Error in GET /movies/after/:year:", err);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
}
// GET /movies/random/10
export async function getRandomTenMovies(req: Request, res: Response) {
  try {
    const moviesFromDb = await prisma.movie.findMany({
      take: 10,
      orderBy: {
        // Prisma trick to randomize:
        // sqlite doesn't support random() but postgres does
        // if sqlite, you must randomize manually after fetch
        // Adjust depending on your database.
        // For postgres:
        // random() works!
        // For MySQL: use `RAND()`
        // So we detect DB or just do manual shuffle.
        // Here is manual shuffle:
      },
    });

    // Manual shuffle so it works across all DB engines:
    const shuffled = moviesFromDb
      .map((m) => ({ m, rand: Math.random() }))
      .sort((a, b) => a.rand - b.rand)
      .slice(0, 10)
      .map((obj) => obj.m);

    const movies = shuffled.map(mapPrismaMovie);

    return res.status(200).json({
      movies,
      count: movies.length,
    });
  } catch (err) {
    console.error("Error in GET /movies/random/10:", err);
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
}
