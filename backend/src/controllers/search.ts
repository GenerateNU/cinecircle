import type { Request, Response } from "express";
import { prisma } from "../services/db";
import {mapTmdbToMovie, saveMovie } from "./tmdb";
type MovieResult = {
    movieId: string;
    title: string | null;
    description: string | null;
    imdbRating: number | null;
    localRating: string | null;
    languages: any;
    numRatings: string | null;
    source: "local" | "tmdb";
};

/**
 * Search TMDB API for movies
 */
async function searchTMDB(query: string): Promise<any[]> {
    const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
        {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TMDB_API_TOKEN!}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`TMDB search failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { results: any[] };

    return data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        vote_average: movie.vote_average,
        spoken_languages: [],
    }));
}

/**
 * Search movies by title - checks local DB first, then TMDB if insufficient results
 * GET /search/movies?q={query}&language={lang}&limit=10&offset=0
 */
export const searchMovies = async (req: Request, res: Response) => {
    const {
        q,
        language,
        minRating,
        minLocalRating,
        maxResults = "50"
    } = req.query;

    if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    const maxResultsNum = parseInt(maxResults as string);

    if (maxResultsNum > 100) {
        return res.status(400).json({
            message: "maxResults cannot exceed 100"
        });
    }

    try {
        const whereClause: any = {
            OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
            ],
        };

        if (language) {
            whereClause.languages = {
                array_contains: language as string
            };
        }

        if (minRating) {
            whereClause.imdbRating = { gte: BigInt(parseInt(minRating as string)) };
        }

        if (minLocalRating) {
            whereClause.localRating = { gte: minLocalRating as string };
        }

        const localMovies = await prisma.movie.findMany({
            where: whereClause,
            take: maxResultsNum,
            orderBy: [
                { imdbRating: 'desc' },
                { numRatings: 'desc' },
            ],
            select: {
                movieId: true,
                title: true,
                description: true,
                imdbRating: true,
                localRating: true,
                languages: true,
                numRatings: true,
            },
        });

        let results: MovieResult[] = localMovies.map((movie) => ({
            ...movie,
            imdbRating: movie.imdbRating ? Number(movie.imdbRating) : null,
            source: "local" as const,
        }));

        console.log(`🔍 Found ${results.length} local movies`);

        if (results.length < 3) {
            console.log(`✅ Only ${results.length} local results, searching TMDB...`);
            try {
                const tmdbResults = await searchTMDB(q);
                console.log(`✅ TMDB returned ${tmdbResults.length} results`);

                const localTitles = new Set(
                    results
                        .map(m => m.title?.toLowerCase())
                        .filter((title): title is string => typeof title === 'string')
                );

                let newTmdbMovies = tmdbResults.filter(
                    tmdb => tmdb.title && !localTitles.has(tmdb.title.toLowerCase())
                );

                if (minRating) {
                    const minRatingNum = parseInt(minRating as string);
                    newTmdbMovies = newTmdbMovies.filter(
                        tmdb => {
                            const rating = Math.round((tmdb.vote_average || 0) * 10);
                            return rating >= minRatingNum;
                        }
                    );
                    console.log(`✅ After rating filter (>=${minRatingNum}): ${newTmdbMovies.length} movies`);
                }

                console.log(`✅ ${newTmdbMovies.length} new movies after deduplication`);

                const neededCount = Math.min(3 - results.length, newTmdbMovies.length);
                console.log(`✅ Will try to save ${neededCount} movies`);

                for (let i = 0; i < neededCount; i++) {
                    try {
                        const tmdbMovie = newTmdbMovies[i];
                        const mapped = mapTmdbToMovie(tmdbMovie);
                        const saved = await saveMovie(mapped);

                        results.push({
                            movieId: saved.movieId,
                            title: saved.title,
                            description: saved.description,
                            imdbRating: saved.imdbRating ? Number(saved.imdbRating) : null,
                            localRating: saved.localRating,
                            languages: saved.languages,
                            numRatings: saved.numRatings,
                            source: "tmdb" as const,
                        });
                    } catch (saveErr) {
                        console.error(`❌ Failed to save TMDB movie:`, saveErr);
                    }
                }

                console.log(`\n📊 Final results: ${results.length} total movies`);
            } catch (tmdbErr) {
                console.error("❌ TMDB search failed:", tmdbErr);
            }
        } else {
            console.log(`✅ Found ${results.length} local movies, no TMDB search needed`);
        }

        return res.json({
            type: "movies",
            query: q,
            count: results.length,
            filters: {
                language: language || "any",
                minRating: minRating || "none",
                minLocalRating: minLocalRating || "none",
            },
            sources: {
                local: results.filter(r => r.source === "local").length,
                tmdb: results.filter(r => r.source === "tmdb").length,
            },
            results,
        });

    } catch (error) {
        console.error("❌ searchMovies error:", error);
        return res.status(500).json({
            message: "Failed to search movies",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
