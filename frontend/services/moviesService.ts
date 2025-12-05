// frontend/app/services/moviesService.ts
import { api } from "./apiClient";
import type { components } from "../types/api-generated";

// OpenAPI-generated types
type GetMovieEnvelope = components["schemas"]["GetMovieEnvelope"];
type UpdateMovieInput = components["schemas"]["UpdateMovieInput"];
type UpdateMovieEnvelope = components["schemas"]["UpdateMovieEnvelope"];
type DeleteMovieResponse = components["schemas"]["DeleteMovieResponse"];
type Movie = components["schemas"]["Movie"];
type Rating = components["schemas"]["Rating"];
type Comment = components["schemas"]["Comment"];
type Summary = components["schemas"]["MovieSummary"]; 

export function fetchAndSaveByTmdbId(tmdbId: string) {
  return api.get<GetMovieEnvelope>(`/movies/${tmdbId}`);
}

export function getMovieByCinecircleId(movieId: string) {
  return api.get<GetMovieEnvelope>(`/movies/cinecircle/${movieId}`);
}

export async function getMoviesAfterYear(year: number): Promise<Movie[]> {
  const res = await api.get<{ movies: Movie[] }>(`/movies/after/${year}`);
  return res.movies.map((m) => ({
    ...m,
    title: m.title ?? "",
  }));
}

export async function getMoviesRandom10(): Promise<Movie[]> {
  const res = await api.get<{ movies: Movie[] }>(`/movies/random/10`);
  return res.movies.map((m) => ({
    ...m,
    title: m.title ?? "",
  }));
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

  return res.movies.map((m) => ({
    ...m,
    title: m.title ?? "", // ensure title is always a string
  }));
}


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


type GetMovieSummaryEnvelope = {
  summary: Summary;
};

export async function getMovieSummary(movieId: string): Promise<Summary> {
  const res = await api.get<GetMovieSummaryEnvelope>(
    `/movies/${movieId}/summary`
  );
  // backend returns { summary: { ... } }
  return res.summary;
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
