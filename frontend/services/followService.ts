// src/services/followService.ts
import { api } from "./apiClient";
import type { components } from "../types/api-generated";

// Auto-generated types from backend
type FollowEdge = components["schemas"]["FollowEdge"];
type FollowUnfollowResponse = components["schemas"]["FollowUnfollowResponse"];
type GetFollowersResponse = components["schemas"]["GetFollowersResponse"];
type GetFollowingResponse = components["schemas"]["GetFollowingResponse"];

/** POST /api/user/follow  Body: { followingId } */
export function followUser(followingId: string) {
  return api.post<FollowUnfollowResponse>(`/api/user/follow`, { followingId });
}

/** POST /api/user/unfollow  Body: { followingId } */
export function unfollowUser(followingId: string) {
  return api.post<FollowUnfollowResponse>(`/api/user/unfollow`, { followingId });
}

/** GET /api/user/:userId/followers  -> { followers: Array<{ follower: UserProfile }> } */
export function getFollowers(userId: string) {
  return api.get<GetFollowersResponse>(`/api/user/${userId}/followers`);
}

/** GET /api/user/:userId/following  -> { following: Array<{ following: UserProfile }> } */
export function getFollowing(userId: string) {
  return api.get<GetFollowingResponse>(`/api/user/${userId}/following`);
}
