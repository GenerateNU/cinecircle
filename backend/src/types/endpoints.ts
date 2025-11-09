import type {
  GetMovieEnvelope,
  UpdateMovieInput,
  UpdateMovieEnvelope,
  DeleteMovieResponse,
  ProtectedResponse,
  GetUserProfileBasicResponse,
  UpdateUserProfileInput,
  UpdateUserProfileResponse,
  DeleteUserProfileResponse,
  GetUserRatingsResponse,
  GetUserCommentsResponse,
  GetFollowersResponse,
  GetFollowingResponse,
  FollowBody,
  FollowUnfollowResponse,
  PingResponse,
  DbTestResponse,
} from "./apiTypes";

export interface Endpoints {
  "GET /api/ping": { path: (p?: void) => string; response: PingResponse };
  "GET /api/db-test": { path: () => string; response: DbTestResponse };

  "GET /movies/:tmdbId": {
    path: (p: { tmdbId: string }) => string;
    response: GetMovieEnvelope;
  };

  "GET /movies/cinecircle/:movieId": {
    path: (p: { movieId: string }) => string;
    response: GetMovieEnvelope;
  };
  "PUT /movies/cinecircle/:movieId": {
    path: (p: { movieId: string }) => string;
    body: UpdateMovieInput;
    response: UpdateMovieEnvelope;
  };
  "DELETE /movies/:movieId": {
    path: (p: { movieId: string }) => string;
    response: DeleteMovieResponse;
  };

  "GET /api/protected": { path: () => string; response: ProtectedResponse };

  "GET /api/user/profile": {
    path: () => string;
    response: GetUserProfileBasicResponse;
  };
  "PUT /api/user/profile": {
    path: () => string;
    body: UpdateUserProfileInput;
    response: UpdateUserProfileResponse;
  };
  "DELETE /api/user/profile": {
    path: () => string;
    response: DeleteUserProfileResponse;
  };

  "GET /api/user/ratings": {
    path: (q: { user_id: string }) => string;
    response: GetUserRatingsResponse;
  };
  "GET /api/user/comments": {
    path: (q: { user_id: string }) => string;
    response: GetUserCommentsResponse;
  };

  "POST /api/user/follow": {
    path: () => string;
    body: FollowBody;
    response: FollowUnfollowResponse;
  };
  "POST /api/user/unfollow": {
    path: () => string;
    body: FollowBody;
    response: FollowUnfollowResponse;
  };
  "GET /api/user/:userId/followers": {
    path: (p: { userId: string }) => string;
    response: GetFollowersResponse;
  };
  "GET /api/user/:userId/following": {
    path: (p: { userId: string }) => string;
    response: GetFollowingResponse;
  };
}
