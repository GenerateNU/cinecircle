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
  imageUrl?: string | null;
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

// Keep LocalEvent from HEAD
export type LocalEvent = {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  genre: string;
  cost: number | null;
  occasion: string | null;
  description: string;
  languages: string[];
  lat: number | null;
  lon: number | null;
};

export type GetLocalEventsResponse = {
  message: string;
  data: LocalEvent[];
};

export type GetLocalEventResponse = {
  message: string;
  data: LocalEvent;
};

// Keep Post and PostLike from your branch
export type Post = {
  id: string;
  userId: string;
  content: string;
  type: 'SHORT' | 'LONG';
  votes: number;
  createdAt: string;
  imageUrls: string[];
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
  isLiked?: boolean;
};

export type PostLike = {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
};
