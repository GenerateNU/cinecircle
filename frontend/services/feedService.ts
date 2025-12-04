import { api } from './apiClient';
import type { components } from '../types/api-generated';

type Post = components["schemas"]["Post"];

// Feed response from backend
export type FeedResponse = {
  message: string;
  data: Array<{
    type: 'post' | 'trending_post';
    data: Post;
  }>;
};

/**
 * Fetch home feed (posts from friends - SHORT and LONG types)
 */
export async function fetchHomeFeed(limit: number = 20): Promise<FeedResponse> {
  return api.get<FeedResponse>('/api/feed', { limit });
}

/**
 * Toggle reaction on a post
 * @param reactionType - One of: SPICY, STAR_STUDDED, THOUGHT_PROVOKING, BLOCKBUSTER
 */
export async function togglePostReaction(
  postId: string, 
  userId: string, 
  reactionType: 'SPICY' | 'STAR_STUDDED' | 'THOUGHT_PROVOKING' | 'BLOCKBUSTER'
) {
  return api.post(`/api/post/${postId}/reaction`, { userId, reactionType });
}

/**
 * Get all reactions for a post
 */
export async function getPostReactions(postId: string) {
  return api.get(`/api/post/${postId}/reactions`);
}