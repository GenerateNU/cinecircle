import { api } from './apiClient';
import type { components } from '../types/api-generated';

type Post = components['schemas']['Post'];

type GetPostsParams = {
  userId?: string;
  movieId?: string;
  repostedPostId?: string | null; // Filter by reposted post ID
  currentUserId?: string; // For getting user's reactions
  limit?: number;
  offset?: number;
};

type PostsResponse = {
  data?: Post[];
  message?: string;
};

/**
 * Fetch posts with optional filters. Passing repostedPostId=null returns only original posts (not reposts).
 */
export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  const normalizedParams = params
    ? {
        ...params,
        repostedPostId: params.repostedPostId === null ? 'null' : params.repostedPostId,
      }
    : undefined;
  const res = await api.get<PostsResponse>('/api/posts', normalizedParams);
  return res.data ?? [];
}
