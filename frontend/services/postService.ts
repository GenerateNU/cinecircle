// src/services/postService.ts
import { api } from "./apiClient";
import type { components } from '../types/api-generated';
type PostFormData = components["schemas"]["PostFormData"];
type Post = components["schemas"]["Post"];


/** POST /api/post */
export function createPost(payload: PostFormData) {
  return api.post<Post>(`/api/post`, payload);
}

/** GET /api/post/:postId */
export function getPost(postId: string) {
  return api.get<{ post: Post }>(`/api/post/${postId}`);
}

