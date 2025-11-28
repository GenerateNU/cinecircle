// src/types/models.ts

/** Matches your `movie` controller responses (BigInt -> number already on server). */
export type Movie = {
  movieId: string;
  title?: string | null;
  description?: string | null;
  languages?: string[] | null;     // controller sends array for updates
  imdbRating?: number | null;      // converted to number in controller
  localRating?: number | string | null; // schema is String, controller may coerce Number
  numRatings?: number | string | null;  // same note as above
};

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

/** Basic user profile from auth (GET /api/user/profile). */
export type UserProfileBasic = {
  id?: string;
  email?: string | null;
  role?: string | null;
};

/** Minimal user profile payloads used by your endpoints. */
export type UserProfile = {
  userId: string;
  username?: string | null;
  preferredLanguages: string[];
  preferredCategories: string[];
  favoriteMovies: string[];
  createdAt?: string;
  updatedAt?: string;
};

/** Ratings & comments (shapes are flexible because you include relations). */
export type Rating = {
  id: string;
  userId: string;
  movieId: string;
  stars: number;
  comment?: string | null;
  tags: string[];
  date: string;
  votes: number;
  // controller includes related threadedComments; keeping as unknown for flexibility
  threadedComments?: unknown[];
};

export type Comment = {
  id: string;
  userId: string;
  ratingId?: string | null;
  postId?: string | null;
  content: string;
  createdAt: string;
  rating?: unknown;
  post?: unknown;
};

export type FollowEdge = {

  id: string;
  followerId: string;
  followingId: string;
  follower?: UserProfile;
  following?: UserProfile;
};

export type PostFormData = {
  content: string;
  rating?: number;
  title?: string;
  subtitle?: string;
  tags?: string[];
};

export type PostModel = {
  id: string;
  userId: string;
  content: string;
  type: "short" | "long" | "rating";
  rating?: number | null;
  title?: string | null;
  subtitle?: string | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};



