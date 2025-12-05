import { api } from './apiClient';
import type { components } from '../types/api-generated';

type Movie = components["schemas"]["Movie"];
type Post = components["schemas"]["Post"];

// Use the detailed SearchUser type from main
type SearchUser = {
  userId?: string;
  username?: string;
  name?: string;
  profilePicture?: string;
  onboardingCompleted?: boolean;
  primaryLanguage?: string;
  secondaryLanguage?: string[];
  country?: string | null;
  city?: string | null;
  displayName?: string | null;
  favoriteGenres?: string[];
  favoriteMovies?: string[];
  bio?: string | null;
  moviesToWatch?: string[];
  moviesCompleted?: string[];
  privateAccount?: boolean;
  spoiler?: boolean;
  createdAt?: string;
  updatedAt?: string;
  eventsSaved?: string[];
  eventsAttended?: string[];
};

export type MovieSearchResponse = {
  type: 'movies';
  query: string;
  count: number;
  results: Movie[];
};

export type UserSearchResponse = {
  type: 'users';
  query: string;
  count: number;
  results: SearchUser[];
};

export type PostSearchResponse = {
  type: 'posts';
  query: string;
  count: number;
  results: Post[];
};

export async function searchMovies(query: string): Promise<MovieSearchResponse> {
  return api.get<MovieSearchResponse>('/api/search/movies', { q: query });
}

export async function searchUsers(query: string): Promise<UserSearchResponse> {
  return api.get<UserSearchResponse>('/api/search/users', { q: query, limit: '10' });
}

export async function searchPosts(query: string): Promise<PostSearchResponse> {
  return api.get<PostSearchResponse>('/api/search/posts', { q: query });
}

export async function searchReviews(query: string): Promise<any> {
  return api.get('/api/search/reviews', { q: query });
}

export async function searchEvents(query: string): Promise<any> {
  return api.get('/api/search/events', { q: query });
}