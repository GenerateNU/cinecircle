import type { ApiEnvelope } from "../services/apiClient";
import type {
  Movie,
  UserProfile,
  UserProfileBasic,
  Rating,
  Comment,
  FollowEdge,
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
export type UpdateUserProfileInput = Partial<Pick<
  UserProfile,
  "username" | "onboardingCompleted" | "primaryLanguage" | "secondaryLanguage" | "country" | "city" | "favoriteGenres" | "favoriteMovies"
>>;

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
// GET /movies/:tmdbId (TMDB fetch + save) and GET/PUT /movies/cinecircle/:movieId
export type GetMovieEnvelope = ApiEnvelope<Movie>;
export type UpdateMovieInput = Partial<Pick<
  Movie,
  "title" | "description" | "languages" | "imdbRating" | "localRating" | "numRatings"
>>;
export type UpdateMovieEnvelope = ApiEnvelope<Movie>;
export type DeleteMovieResponse = { message: string };
