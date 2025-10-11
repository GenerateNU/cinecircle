import { api, type ApiEnvelope } from "backend/src/services/apiClient";

export type Movie = {
  movieId: string;
  title?: string | null;
  description?: string | null;
  languages?: string[] | null;
  imdbRating?: number | null;  // your controller already converts BigInt to number
  localRating?: number | null;
  numRatings?: number | null;
};

export function fetchAndSaveByTmdbId(tmdbId: string) {
  return api.get<ApiEnvelope<Movie>>(`/movies/${tmdbId}`);
}

export function getMovieByCinecircleId(movieId: string) {
  return api.get<ApiEnvelope<Movie>>(`/movies/cinecircle/${movieId}`);
}

export function updateMovieByCinecircleId(
  movieId: string,
  payload: Partial<Pick<Movie, "title" | "description" | "languages" | "imdbRating" | "localRating" | "numRatings">>
) {
  return api.put<ApiEnvelope<Movie>>(`/movies/cinecircle/${movieId}`, payload);
}

export function deleteMovie(movieId: string) {
  return api.delete<{ message: string }>(`/movies/${movieId}`);
}
