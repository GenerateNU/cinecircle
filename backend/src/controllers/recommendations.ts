import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import { prisma } from "../services/db.js";
import { mapMovieDbToApi } from "./tmdb";
import type { Movie } from "../types/models";

type RecommendationFriend = {
  userId: string;
  username: string | null;
};

type MutualRecommendation = {
  movie: Movie;
  likedBy: RecommendationFriend[];
};

export const getMutualRecommendations = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const [following, followers] = await Promise.all([
      prisma.userFollow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      }),
      prisma.userFollow.findMany({
        where: { followingId: userId },
        select: { followerId: true },
      }),
    ]);

    const followingSet = new Set(following.map((edge) => edge.followingId));
    const mutualIds = Array.from(
      new Set(
        followers
          .map((edge) => edge.followerId)
          .filter((id) => followingSet.has(id))
      )
    );

    if (mutualIds.length === 0) {
      return res.json({
        message: "No mutual follows found",
        data: [] as MutualRecommendation[],
      });
    }

    const mutualProfiles = await prisma.userProfile.findMany({
      where: { userId: { in: mutualIds } },
      select: { userId: true, username: true, favoriteMovies: true },
    });

    const movieIds = Array.from(
      new Set(
        mutualProfiles.flatMap((profile) =>
          Array.isArray(profile.favoriteMovies)
            ? profile.favoriteMovies.filter(
                (movieId): movieId is string => typeof movieId === "string"
              )
            : []
        )
      )
    );

    if (movieIds.length === 0) {
      return res.json({
        message: "Mutual follows have no liked movies",
        data: [] as MutualRecommendation[],
      });
    }

    const movies = await prisma.movie.findMany({
      where: { movieId: { in: movieIds } },
    });
    const movieMap = new Map(movies.map((movie) => [movie.movieId, movie]));

    const recommendations = movieIds
      .map((movieId) => {
        const dbMovie = movieMap.get(movieId);
        if (!dbMovie) return null;

        const likedBy = mutualProfiles
          .filter((profile) =>
            Array.isArray(profile.favoriteMovies)
              ? profile.favoriteMovies.includes(movieId)
              : false
          )
          .map<RecommendationFriend>((profile) => ({
            userId: profile.userId,
            username: profile.username ?? null,
          }));

        if (likedBy.length === 0) return null;

        return {
          movie: mapMovieDbToApi(dbMovie),
          likedBy,
        };
      })
      .filter((item): item is MutualRecommendation => item !== null);

    res.json({
      message: "Mutual recommendations retrieved successfully",
      data: recommendations,
    });
  } catch (error) {
    console.error("getMutualRecommendations error:", error);
    res.status(500).json({ message: "Failed to retrieve recommendations" });
  }
};
