// src/services/followService.ts
import { api } from "./apiClient";
import type { FollowEdge } from "../types/models";

/** POST /api/user/follow  Body: { followingId } */
export function followUser(followingId: string) {
  return api.post<{ message: string }>(`/api/user/follow`, { followingId });
}

/** POST /api/user/unfollow  Body: { followingId } */
export function unfollowUser(followingId: string) {
  return api.post<{ message: string }>(`/api/user/unfollow`, { followingId });
}

/** GET /api/user/:userId/followers  -> { followers: Array<{ follower: UserProfile }> } */
export function getFollowers(userId: string) {
  return api.get<{ followers: FollowEdge[] }>(`/api/user/${userId}/followers`);
}

/** GET /api/user/:userId/following  -> { following: Array<{ following: UserProfile }> } */
export function getFollowing(userId: string) {
  return api.get<{ following: FollowEdge[] }>(`/api/user/${userId}/following`);
}
