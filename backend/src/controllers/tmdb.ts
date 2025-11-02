import type { Request, Response } from "express";
import { prisma } from "../services/db.js";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import type { Movie } from "../types/models";

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
type MovieInsert = Prisma.movieCreateInput;

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
    localRating: defaults.localRating !== undefined ? String(defaults.localRating) : "0",
    numRatings: defaults.numRatings !== undefined ? String(defaults.numRatings) : "0",
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

// Express handler
export const getMovie = async (req: Request, res: Response) => {
  const { movieId: tmdbId } = req.params;
  if (!tmdbId) return res.status(400).json({ message: "Movie ID is required" });

  try {
    const tmdb = await fetchTmdbMovie(tmdbId);
    const mappedAppModel = mapTmdbToMovie(tmdb);
    const prismaCreate = mappedAppModel;

    // create or update if it already exists
    const saved = await prisma.movie.upsert({
      where: { movieId: prismaCreate.movieId },
      create: prismaCreate,
      update: prismaCreate,
    });

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

// PUT /movies/:movieId
export const updateMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  if (!movieId) return res.status(400).json({ message: "Movie ID is required" });

  const body = req.body as Partial<Movie>;
  const updateData = mapMovieToPrismaUpdate(body);

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updatedMovie = await prisma.movie.update({
      where: { movieId },
      data: updateData,
    });

    const movieResponse = {
      ...updatedMovie,
      imdbRating: updatedMovie.imdbRating != null ? Number(updatedMovie.imdbRating) : null,
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

    const movieResponse = {
      ...movie,
      imdbRating: movie.imdbRating != null ? Number(movie.imdbRating) : null,
    };

    res.json({ message: "Movie found successfully", data: movieResponse });
  } catch (err) {
    console.error("getMovieById error:", err);
    res.status(500).json({
      message: "failed to retrieve movie",
      error: err instanceof Error ? err.message : "unknown",
    });
  }
};

// -------- helpers --------
const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0;

const toStringOrUndefined = (v: unknown): string | undefined =>
  v == null ? undefined : String(v);

const toBigIntNullable = (
  v: unknown,
  { forUpdate = false }: { forUpdate?: boolean } = {}
): bigint | null | undefined => {
  if (v === undefined) return undefined;  // skip
  if (v === null) return forUpdate ? null : undefined; // update: explicit null, create: skip

  if (typeof v === "bigint") return v;

  if (typeof v === "number" && Number.isFinite(v)) {
    return BigInt(Math.round(v));
  }

  if (typeof v === "string") {
    const trimmed = v.trim();
    if (!isNonEmptyString(trimmed)) return forUpdate ? null : undefined;

    // Try strict BigInt first, then numeric parse fallback
    try {
      return BigInt(trimmed);
    } catch {
      const n = Number(trimmed);
      if (Number.isFinite(n)) return BigInt(Math.round(n));
    }
  }

  return forUpdate ? null : undefined;
};

const toJsonStringArray = (v: unknown): string[] | undefined => {
  if (v == null) return undefined;              // undefined or null => skip
  if (Array.isArray(v)) return v.filter(x => x != null).map(String);
  return undefined;
};

// -------- mappers --------
export const mapMovieToPrismaUpdate = (
  patch: Partial<Movie>
): Prisma.movieUpdateInput => {
  const data: Prisma.movieUpdateInput = {};

  if ("title" in patch) data.title = patch.title ?? null;
  if ("description" in patch) data.description = patch.description ?? null;

  if ("languages" in patch) {
    if (patch.languages === null) {
      data.languages = Prisma.DbNull;             // clear JSON column
    } else {
      data.languages = toJsonStringArray(patch.languages); // string[] | undefined
    }
  }

  if ("imdbRating" in patch) {
    data.imdbRating = toBigIntNullable(patch.imdbRating, { forUpdate: true }) as
      | bigint
      | null
      | undefined;
  }

  if ("localRating" in patch) {
    if (patch.localRating === undefined) {
      // leave undefined (no-op)
    } else if (patch.localRating === null) {
      data.localRating = null;
    } else {
      data.localRating = String(patch.localRating);
    }
  }

  if ("numRatings" in patch) {
    if (patch.numRatings === undefined) {
      // no-op
    } else if (patch.numRatings === null) {
      data.numRatings = null;
    } else {
      data.numRatings = String(patch.numRatings);
    }
  }

  return data;
};


