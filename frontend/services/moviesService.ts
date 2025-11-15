import { api } from "./apiClient";
import type { components } from "../types/api-generated";

// Auto-generated types from backend
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

export function updateMovieByCinecircleId(movieId: string, payload: UpdateMovieInput) {
  return api.put<UpdateMovieEnvelope>(`/movies/cinecircle/${movieId}`, payload);
}

export function deleteMovie(movieId: string) {
  return api.delete<DeleteMovieResponse>(`/movies/${movieId}`);
}
