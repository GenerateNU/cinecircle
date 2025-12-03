import { api } from './apiClient';

type SearchUser = {
  userId?: string;
  username?: string;
  name?: string;
  profilePicture?: string;
};

type SearchUsersResponse = {
  data?: SearchUser[];
  message?: string;
};

export async function searchUsers(query: string, limit: number = 10): Promise<SearchUser[]> {
  const res = await api.get<SearchUsersResponse>('/api/search/users', {
    q: query,
    limit: String(limit),
  });
  return res.data ?? [];
}
