import type { Request, Response } from "express";
import { prisma, } from "../services/db.ts";
import { Prisma } from "@prisma/client";

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

// Map TMDB -> Prisma.Movie fields (exclude movieId, since it's auto-UUID)
type MovieInsert = Omit<Prisma.MovieCreateInput, "movieId">;

export function mapTmdbToMovie(
  tmdb: TmdbMovie,
  opts?: { defaults?: Partial<Pick<MovieInsert, "localRating" | "numRatings">> }
): MovieInsert {
  const defaults = opts?.defaults ?? {};
  return {
    title: tmdb.title ?? "",
    description: tmdb.overview ?? "",
    languages: (tmdb.spoken_languages ?? [])
      .map(l => l.english_name)
      .filter(Boolean) as string[],
    imdbRating: Math.round((tmdb.vote_average ?? 0) * 10), // e.g., 7.5 -> 75
    localRating: defaults.localRating ?? 0,
    numRatings: defaults.numRatings ?? 0,
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
  const { movieId: tmdbId } = req.params; // route: /movies/:movieId (TMDB id)

  if (!tmdbId) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  try {
    const tmdb = await fetchTmdbMovie(tmdbId);
    const mapped = mapTmdbToMovie(tmdb);
    const saved = await saveMovie(mapped);

    res.json({
      message: "Movie fetched from TMDB and saved to DB",
      data: saved,
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

    if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required" });
    }

    const { title, description, languages, imdbRating, localRating, numRatings } = req.body;

    const updateData: Partial<Prisma.MovieUpdateInput> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (languages !== undefined) updateData.languages = languages;
    if (imdbRating !== undefined) updateData.imdbRating = imdbRating;
    if (localRating !== undefined) updateData.localRating = localRating;
    if (numRatings !== undefined) updateData.numRatings = numRatings;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }

    try {
        const updatedMovie = await prisma.movie.update({
            where: { movieId: movieId },
            data: updateData,
        });

        res.json({
            message: "Movie updated successfully",
            data: updatedMovie,
        });
    } catch (err) {
        console.error("updateMovie error:", err);

        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
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

        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(500).json({
            message: "Failed to delete movie",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
};