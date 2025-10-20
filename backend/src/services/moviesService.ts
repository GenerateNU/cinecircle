import { api } from "./apiClient";
import type { GetMovieEnvelope, UpdateMovieInput, UpdateMovieEnvelope, DeleteMovieResponse } from "../types/apiTypes";

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
