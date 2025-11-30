export type Movie = {
  movieId: string;
  title?: string | null;
  description?: string | null;
  languages?: string[] | null;   
  imdbRating?: number | null;      
  localRating?: number | string | null; 
  numRatings?: number | string | null;  
  imageUrl?: string | null;
};

export type UserProfileBasic = {
  id: string;
  email: string;
  role: string;
};

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

// backend/src/types/summary.ts

export type SentimentStats = {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
};

export type MovieSummary = {
  movieId: string;
  overall: string;
  pros: string[];
  cons: string[];
  stats: SentimentStats;
  quotes: string[];
};

export type GetMovieSummaryEnvelope = {
  summary: MovieSummary;
};

// For chunk-level aggregation
export type ChunkSummary = {
  pros: string[];
  cons: string[];
  stats: SentimentStats;
  quotes: string[];
};

