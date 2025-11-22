import { api } from './apiClient';
import type { components } from '../types/api-generated';

type Post = components["schemas"]["Post"];
type Rating = components["schemas"]["Rating"];


// Feed response from backend
export type FeedResponse = {
  message: string;
  data: Array<{
    type: 'post' | 'rating' | 'trending_post' | 'trending_rating';
    data: Post | Rating;
  }>;
};

/**
 * Fetch home feed (posts + ratings from friends)
 */
export async function fetchHomeFeed(limit: number = 20): Promise<FeedResponse> {
  return api.get<FeedResponse>('/api/feed', { limit });
}

/**
 * Toggle like on a post
 */
export async function togglePostLike(postId: string, userId: string) {
  return api.post(`/post/${postId}/like`, { userId });
}