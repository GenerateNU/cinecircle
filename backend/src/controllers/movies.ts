// backend/src/controllers/movies.ts
import type { Request, Response } from "express";
import { prisma } from "../services/db.js";
import type { Movie } from "../types/models";

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