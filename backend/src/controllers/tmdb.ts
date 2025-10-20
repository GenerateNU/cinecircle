import type { Request, Response } from "express";
import { prisma } from "../services/db.js";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { Movie } from "../types/models.js";

type TmdbMovie = {
  id: number;
  title: string;
  overview?: string;
  vote_average?: number;
  spoken_languages?: Array<{ english_name?: string }>;
};

// Fetch from TMDB
export async function fetchTmdbMovie(tmdbId: string): Promise<TmdbMovie> {
  const resp = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_TOKEN!}`,
    },
  });

  if (!resp.ok) {
    throw new Error(`TMDB ${resp.status} ${resp.statusText}`);
  }
  return resp.json() as Promise<TmdbMovie>;
}

// Map TMDB -> Prisma.Movie fields (include movieId as UUID)
type MovieInsert = Prisma.MovieCreateInput;

export function mapTmdbToMovie(
  tmdb: TmdbMovie,
  opts?: {
    defaults?: Partial<Pick<MovieInsert, "localRating" | "numRatings">>;
  },
): MovieInsert {
  const defaults = opts?.defaults ?? {};
  return {
    movieId: randomUUID(), // Generate UUID
    title: tmdb.title ?? "",
    description: tmdb.overview ?? "",
    languages: (tmdb.spoken_languages ?? [])
      .map((l) => l.english_name)
      .filter(Boolean) as string[],
    imdbRating: Math.round((tmdb.vote_average ?? 0) * 10), // e.g., 7.5 -> 75 (stored as BigInt)
    localRating: defaults.localRating !== undefined ? Number(defaults.localRating) : 0,
    numRatings: defaults.numRatings !== undefined ? Number(defaults.numRatings) : 0,
  };
}

// Persist to DB without unique tmdbId
//    - Try to locate an existing row using a heuristic (title + description).
//    - If found, update by primary key (movieId).
//    - If not, create a new row (movieId auto-UUID).
export async function saveMovie(mapped: MovieInsert) {
  const existing = await prisma.movie.findFirst({
    where: {
      title: mapped.title,
      description: mapped.description,
    },
  });

  if (existing) {
    return prisma.movie.update({
      where: { movieId: existing.movieId },
      data: {
        ...mapped,
        // assign array directly for update
        languages: mapped.languages ?? [],
      },
    });
  }

  return prisma.movie.create({
    data: mapped,
  });
}

export const getMovie = async (req: Request, res: Response) => {
  const { movieId: tmdbId } = req.params;
  if (!tmdbId) return res.status(400).json({ message: "Movie ID is required" });

  try {
    const tmdb = await fetchTmdbMovie(tmdbId);
    const mapped = mapTmdbToMovie(tmdb);
    const saved = await saveMovie(mapped); // <-- capture the DB row

    // Return DB-shaped response (with imdbRating coerced)
    const movieResponse = {
      ...saved,
      imdbRating: saved.imdbRating != null ? Number(saved.imdbRating) : null,
    };

    res.json({
      message: "Movie fetched from TMDB and saved to DB",
      data: movieResponse,
    });
  } catch (err) {
    console.error("getMovie error:", err);
    res.status(500).json({
      message: "Failed to fetch/save movie",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  if (!movieId) return res.status(400).json({ message: "Movie ID is required" });

  const { title, description, languages, imdbRating, localRating, numRatings } = req.body;
  const data: Partial<Prisma.MovieUpdateInput> = {};

  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (languages !== undefined) data.languages = languages;  // string[]
  if (imdbRating !== undefined) data.imdbRating = imdbRating;
  if (localRating !== undefined) data.localRating = Number(localRating);
  if (numRatings !== undefined) data.numRatings = Number(numRatings);

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updated = await prisma.movie.update({ where: { movieId }, data });

    const movieResponse = {
      ...updated,
      imdbRating: updated.imdbRating != null ? Number(updated.imdbRating) : null,
    };

    res.json({ message: "Movie updated successfully", data: movieResponse });
  } catch (err) {
    console.error("updateMovie error:", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(500).json({
      message: "Failed to update movie",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

// DELETE /movies/:movieId
export const deleteMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;

  if (!movieId) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  try {
    await prisma.movie.delete({
      where: { movieId: movieId },
    });

    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("deleteMovie error:", err);

    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(500).json({
      message: "Failed to delete movie",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  if (!movieId) return res.status(400).json({ message: "Movie ID is required" });

  try {
    const movie = await prisma.movie.findUnique({ where: { movieId } });
    if (!movie) return res.status(404).json({ message: "Movie not found." });

    // Use the mapper for correct types, then merge back to preserve DB fields
    const dto = toMovieResponseFromDb(movie); // imdbRating coerced, etc.
    res.json({
      message: "Movie found successfully",
      data: { ...movie, ...dto }, // keeps createdAt/updatedAt + coerces imdbRating
    });
  } catch (err) {
    console.error("getMovieById error:", err);
    res.status(500).json({
      message: "failed to retrieve movie",
      error: err instanceof Error ? err.message : "unknown",
    });
  }
};

function toMovieResponse(dbMovie: TmdbMovie): Movie {
  const languages =
    dbMovie.spoken_languages
      ?.map(l => l.english_name)
      .filter((v): v is string => typeof v === "string" && v.length > 0)
    ?? null;

  return {
    movieId: String(dbMovie.id),
    title: dbMovie.title,
    description: dbMovie.overview,
    languages,
    imdbRating: dbMovie.vote_average != null ? Number(dbMovie.vote_average) : null,
  };
}

// Map a DB movie row to the public API shape
function toMovieResponseFromDb(row: any): Movie {
  // imdbRating might be number | bigint | string | null depending on your ORM/DB
  const imdb =
    row.imdbRating == null
      ? null
      : typeof row.imdbRating === "bigint"
      ? Number(row.imdbRating)
      : Number(row.imdbRating);

  return {
    movieId: String(row.movieId ?? row.id),
    title: row.title ?? null,
    description: row.description ?? null,
    languages: Array.isArray(row.languages) ? (row.languages as string[]) : null,
    imdbRating: Number.isFinite(imdb) ? imdb : null,
    localRating:
      row.localRating == null ? null : typeof row.localRating === "number" ? row.localRating : Number(row.localRating),
    numRatings:
      row.numRatings == null ? null : typeof row.numRatings === "number" ? row.numRatings : Number(row.numRatings),
  };
}
