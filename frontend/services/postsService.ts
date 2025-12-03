import { api } from './apiClient';
import type { components } from '../types/api-generated';

type Post = components['schemas']['Post'];

type GetPostsParams = {
  userId?: string;
  parentPostId?: string | null;
  limit?: number;
  offset?: number;
};

type PostsResponse = {
  data?: Post[];
  message?: string;
};

/**
 * Fetch posts with optional filters. Passing parentPostId=null returns only top-level posts.
 */
export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  const normalizedParams = params
    ? {
        ...params,
        parentPostId: params.parentPostId === null ? 'null' : params.parentPostId,
      }
    : undefined;
  const res = await api.get<PostsResponse>('/api/posts', normalizedParams);
  return res.data ?? [];
}
