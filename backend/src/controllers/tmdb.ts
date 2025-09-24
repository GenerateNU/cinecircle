import type { Request, Response } from "express";
import { prisma, } from "../services/db.ts";
import { Prisma } from "@prisma/client"; // for types

type TmdbMovie = {
  id: number;
  title: string;
  overview?: string;
  vote_average?: number; // 0..10
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

// 3) Persist to DB without unique tmdbId
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
    data: mapped, // languages can be a string[] on create
  });
}

// 4) Express handler
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
