import { api } from './apiClient';

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

type SearchUsersResponse = {
  data?: SearchUser[];
  results?: SearchUser[];
  message?: string;
};

export async function searchUsers(query: string, limit: number = 10): Promise<SearchUser[]> {
  const res = await api.get<SearchUsersResponse>('/api/search/users', {
    q: query,
    limit: String(limit),
  });
  // Backend returns `{ results: [...] }` (and sometimes `{ data: [...] }`); normalize here.
  return res.data ?? res.results ?? [];
}
