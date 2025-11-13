// src/types/models.ts
//
// NOTE: API types are auto-generated from backend.
// Services should import from "./api-generated" instead of this file.
// This file now only contains UI-specific types.

// UI-specific types (not from API)
export type User = {
  name: string;
  username: string;
  bio?: string;
  followers?: number;
  following?: number;
  profilePic?: string;
};

export type Props = {
  user?: User;
  userId?: string;
};

// Temporary Bridge types for backward compatibility (TODO: remove once all components migrated to directly use api-generated types)
import type { components } from "./api-generated";

export type Movie = components["schemas"]["Movie"];
export type UserProfile = components["schemas"]["UserProfile"];
export type UserProfileBasic = components["schemas"]["UserProfileBasic"];
export type Rating = components["schemas"]["Rating"];
export type Comment = components["schemas"]["Comment"];
export type FollowEdge = components["schemas"]["FollowEdge"];
