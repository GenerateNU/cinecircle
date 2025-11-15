// src/types/models.ts

/** Matches your `movie` controller responses (BigInt -> number already on server). */
export type Movie = {
  movieId: string;
  title?: string | null;
  description?: string | null;
  languages?: string[] | null;
  imdbRating?: number | null;
  localRating?: number | string | null;
  numRatings?: number | string | null;
};

/** Basic auth user info returned from /api/user/profile GET endpoint */
export type UserProfileBasic = {
  id: string;
  email: string;
  role: string;
};

/** Minimal user profile payloads used by your endpoints. */
export type UserProfile = {
  userId: string;
  username?: string | null;
  onboardingCompleted: boolean;
  primaryLanguage: string;
  secondaryLanguage: string[];
  profilePicture: string | null;
  country: string | null;
  city: string | null;
  favoriteGenres: string[];
  favoriteMovies: string[];
  createdAt: Date;
  updatedAt: Date;
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
  UserProfile?: {
    userId: string;
    username: string | null;
  };
  threadedComments?: unknown[];
};

export type Comment = {
  id: string;
  userId: string;
  ratingId?: string | null;
  postId?: string | null;
  content: string;
  createdAt: string;
  UserProfile?: {
    userId: string;
    username: string | null;
  };
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

/** Posts (matching backend Post model) */
export type Post = {
  id: string;
  userId: string;
  content: string;
  type: 'SHORT' | 'LONG';
  votes: number;
  createdAt: string;
  imageUrl: string | null;
  parentPostId: string | null;
  UserProfile?: {
    userId: string;
    username: string | null;
  };
  PostLike?: Array<{ id: string; userId: string }>;
  Comment?: Array<{ id: string }>;
  Replies?: Array<{ id: string }>;
  likeCount?: number;
  commentCount?: number;
  replyCount?: number;
};

/** Post Like */
export type PostLike = {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
};