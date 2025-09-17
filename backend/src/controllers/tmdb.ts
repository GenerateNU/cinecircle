import type { Request, Response } from 'express';
import { prisma } from '../services/db.ts';
import path from 'path';
import fs from 'fs';

// Pull movie details from TMDB
export const getMovie = async (req: Request, res: Response) => {
  const { movieId } = req.params; // expects route like /movies/:movieId

  if (!movieId) {
    return res.status(400).json({ message: "Movie ID is required" });
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`, // store token in .env
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    res.json({
      message: "Movie data retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching movie data:", error);
    res.status(500).json({
      message: "Failed to fetch movie data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
