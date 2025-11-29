// src/services/postService.ts
import { api } from "./apiClient";
import type { PostFormData, PostModel } from "../types/models";

/** POST /api/post */
export function createPost(payload: PostFormData & { postType: string }) {
  return api.post<PostModel>(`/post`, payload);
}

/** GET /api/post/:postId */
export function getPost(postId: string) {
  return api.get<{ post: PostModel }>(`/api/post/${postId}`);
}

