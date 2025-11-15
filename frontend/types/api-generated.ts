import type {
  PingResponse,
  DbTestResponse,
  ProtectedResponse,
  GetUserProfileBasicResponse,
  UpdateUserProfileInput,
  UpdateUserProfileResponse,
  DeleteUserProfileResponse,
  GetUserRatingsResponse,
  GetUserCommentsResponse,
  FollowBody,
  FollowUnfollowResponse,
  GetFollowersResponse,
  GetFollowingResponse,
  GetMovieEnvelope,
  UpdateMovieInput,
  UpdateMovieEnvelope,
  DeleteMovieResponse,
} from "./apiTypes";
import type { Movie, UserProfile, Rating, Comment, FollowEdge, UserProfileBasic } from "./models";

/**
 * Temporary shim so frontend code can import the same `components["schemas"]["Foo"]`
 * types that the generated file exposes on other branches. It maps to the
 * hand-written apiTypes/models definitions we already keep in the repo.
 *
 * When the OpenAPI generator runs, this file should be overwritten.
 */
export interface components {
  schemas: {
    PingResponse: PingResponse;
    DbTestResponse: DbTestResponse;
    ProtectedResponse: ProtectedResponse;
    GetUserProfileBasicResponse: GetUserProfileBasicResponse;
    UpdateUserProfileInput: UpdateUserProfileInput;
    UpdateUserProfileResponse: UpdateUserProfileResponse;
    DeleteUserProfileResponse: DeleteUserProfileResponse;
    GetUserRatingsResponse: GetUserRatingsResponse;
    GetUserCommentsResponse: GetUserCommentsResponse;
    FollowBody: FollowBody;
    FollowUnfollowResponse: FollowUnfollowResponse;
    GetFollowersResponse: GetFollowersResponse;
    GetFollowingResponse: GetFollowingResponse;
    Movie: Movie;
    UserProfile: UserProfile;
    UserProfileBasic: UserProfileBasic;
    Rating: Rating;
    Comment: Comment;
    FollowEdge: FollowEdge;
    GetMovieEnvelope: GetMovieEnvelope;
    UpdateMovieInput: UpdateMovieInput;
    UpdateMovieEnvelope: UpdateMovieEnvelope;
    DeleteMovieResponse: DeleteMovieResponse;
  };
}
