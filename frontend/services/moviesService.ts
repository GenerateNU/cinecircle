// frontend/app/services/moviesService.ts
import { api } from "./apiClient";
import type { components } from "../types/api-generated";
import type { Movie, Rating, Comment, Summary } from "../types/models";

// OpenAPI-generated types
type GetMovieEnvelope = components["schemas"]["GetMovieEnvelope"];
type UpdateMovieInput = components["schemas"]["UpdateMovieInput"];
type UpdateMovieEnvelope = components["schemas"]["UpdateMovieEnvelope"];
type DeleteMovieResponse = components["schemas"]["DeleteMovieResponse"];

export function fetchAndSaveByTmdbId(tmdbId: string) {
  return api.get<GetMovieEnvelope>(`/movies/${tmdbId}`);
}

export function getMovieByCinecircleId(movieId: string) {
  return api.get<GetMovieEnvelope>(`/movies/cinecircle/${movieId}`);
}

export function updateMovieByCinecircleId(
  movieId: string,
  payload: UpdateMovieInput,
) {
  return api.put<UpdateMovieEnvelope>(`/movies/cinecircle/${movieId}`, payload);
}

export function deleteMovie(movieId: string) {
  return api.delete<DeleteMovieResponse>(`/movies/${movieId}`);
}

// 👉 movie list for New Releases
export async function getAllMovies(): Promise<Movie[]> {
  const res = await api.get<{ movies: Movie[] }>("/movies");
  return res.movies;
}

// You probably already had equivalents of these; recreating:

export async function getMovieRatings(
  movieId: string
): Promise<{ ratings: Rating[] }> {
  const res = await api.get<any>(`/api/${encodeURIComponent(movieId)}/ratings`);
  console.log("getMovieRatings raw:", res);

  if (res && Array.isArray(res.ratings)) {
    return { ratings: res.ratings as Rating[] };
  }

  if (Array.isArray(res)) {
    return { ratings: res as Rating[] };
  }

  return { ratings: [] };
}


// AI semantic summary endpoint (when you hook it up)
export async function getMovieSummary(movieId: string): Promise<Summary> {
  return api.get<Summary>(`/movies/${encodeURIComponent(movieId)}/summary`);
}

// Movie comments: GET /api/:movieId/comments
export async function getMovieComments(
  movieId: string
): Promise<{ comments: Comment[] }> {
  const res = await api.get<any>(`/api/${encodeURIComponent(movieId)}/comments`);
  console.log("getMovieComments raw:", res);

  if (res && Array.isArray(res.comments)) {
    return { comments: res.comments as Comment[] };
  }

  if (Array.isArray(res)) {
    return { comments: res as Comment[] };
  }

  return { comments: [] };
}
