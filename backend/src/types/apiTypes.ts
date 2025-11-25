import type { ApiEnvelope } from "../services/apiClient";
import type {
  Movie,
  UserProfile,
  UserProfileBasic,
  Rating,
  Comment,
  FollowEdge,
  Post,
} from "./models";

/** -------- Health -------- */
export type PingResponse = { message?: string; [k: string]: unknown };
export type DbTestResponse = { message?: string; [k: string]: unknown };

/** -------- Protected -------- */
export type ProtectedResponse = {
  message: string;
  user: unknown;
  timestamp: string;
  endpoint: string;
};

/** -------- User Profile Basic (GET /api/user/profile) -------- */
export type GetUserProfileBasicResponse = {
  message?: string;
  user?: UserProfileBasic;
  timestamp?: string;
  endpoint?: string;
};

/** -------- User Profile (GET /api/user/profile) -------- */
export type GetUserProfileResponse = {
  message?: string;
  userProfile: UserProfile;
  user?: UserProfileBasic;
  timestamp?: string;
  endpoint?: string;
};

/** -------- User Profile Update/Delete -------- */

export type UpdateUserProfileInput = {
  username?: string;
  onboardingCompleted?: boolean;
  primaryLanguage?: string;
  secondaryLanguage?: string[];
  country?: string;
  city?: string;
  favoriteGenres?: string[];
  favoriteMovies?: string[];
};

export type UpdateUserProfileResponse = { message: string; data: UserProfile };
export type DeleteUserProfileResponse = { message: string };

/** -------- Ratings & Comments (query returns arrays) -------- */
export type GetUserRatingsResponse = { message: string; ratings: Rating[] };
export type GetUserCommentsResponse = { message: string; comments: Comment[] };

/** -------- Follows -------- */
export type FollowBody = { followingId: string };
export type FollowUnfollowResponse = { message: string };
export type GetFollowersResponse = { followers: FollowEdge[] };
export type GetFollowingResponse = { following: FollowEdge[] };

/** -------- Movies -------- */
export type GetMovieEnvelope = ApiEnvelope<Movie>;
export type UpdateMovieInput = {
  title?: string | null;
  description?: string | null;
  languages?: string[] | null;
  imdbRating?: number | null;
  localRating?: number | string | null;
  numRatings?: number | string | null;
};
export type UpdateMovieEnvelope = ApiEnvelope<Movie>;
export type DeleteMovieResponse = { message: string };

/** -------- Posts -------- */
export type GetPostsResponse = {
  message: string;
  data: Post[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export type GetPostByIdResponse = {
  message: string;
  data: Post;
};

export type CreatePostInput = {
  userId: string;
  content: string;
  type?: 'SHORT' | 'LONG';
  imageUrls?: string[];
  parentPostId?: string;
};

export type CreatePostResponse = {
  message: string;
  data: Post;
};

export type UpdatePostInput = {
  content?: string;
  type?: 'SHORT' | 'LONG';
  imageUrls?: string[];
};

export type UpdatePostResponse = {
  message: string;
  data: Post;
};

export type DeletePostResponse = {
  message: string;
};

// Reaction types
export type ToggleReactionInput = {
  userId: string;
  reactionType: 'SPICY' | 'STAR_STUDDED' | 'THOUGHT_PROVOKING' | 'BLOCKBUSTER';
};

export type ToggleReactionResponse = {
  message: string;
  reacted: boolean;
  reactionType: string;
};

export type GetPostReactionsResponse = {
  message: string;
  data: Array<{
    id: string;
    postId: string;
    userId: string;
    reactionType: string;
    createdAt: string;
    UserProfile: {
      userId: string;
      username: string | null;
    };
  }>;
  counts: Record<string, number>;
  total: number;
};

/** -------- Feed (Posts + Ratings combined) -------- */
export type FeedItem = {
  itemType: 'post' | 'rating';
  post?: Post;
  rating?: Rating;
  movie?: Movie;
};