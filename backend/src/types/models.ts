export type Movie = {
  movieId: string;
  title?: string | null;
  description?: string | null;
  languages?: string[] | null;   
  imdbRating?: number | null;      
  localRating?: number | string | null; 
  numRatings?: number | string | null;  
  imageUrl?: string | null;
  releaseYear?: number | null;
  director?: string | null;
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
  privateAccount: boolean;
  spoiler: boolean;
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
  parentId?: string | null;
  createdAt: string;
  UserProfile?: {
    userId: string;
    username: string | null;
    profilePicture: string | null;
  };
  rating?: unknown;
  post?: unknown;
  parentComment?: unknown;
  childComments?: unknown[];
};

export type FollowEdge = {
  id: string;
  followerId: string;
  followingId: string;
  follower?: UserProfile;
  following?: UserProfile;
};

export type EventAttendee = {
  userId: string;
  username: string | null;
  profilePicture: string | null;
};

export type RsvpCounts = {
  yes: number;
  maybe: number;
  no: number;
  total: number;
};

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
  imageUrl: string | null;
  attendees: EventAttendee[];
  attendeeCount: number;
  rsvpCounts: RsvpCounts;
};

export type EventRsvp = {
  id: string;
  eventId: string;
  userId: string;
  status: 'yes' | 'maybe' | 'no';
  createdAt: string;
  updatedAt: string;
  user?: {
    userId: string;
    username: string | null;
    profilePicture: string | null;
  };
};

export type ReactionType = 'SPICY' | 'STAR_STUDDED' | 'THOUGHT_PROVOKING' | 'BLOCKBUSTER';

export type Post = {
  id: string;
  userId: string;
  movieId: string;
  content: string;
  type: 'SHORT' | 'LONG';
  stars: number | null;
  spoiler: boolean;
  tags: string[];
  createdAt: string;
  imageUrls: string[];
  repostedPostId: string | null; // References the original post being shared
  UserProfile?: {
    userId: string;
    username: string | null;
  };
  movie?: {
    movieId: string;
    title: string | null;
    imageUrl: string | null;
  };
  OriginalPost?: Post; // The post that was reposted (if this is a repost)
  PostReaction?: Array<{ id: string; userId: string; reactionType: ReactionType }>;
  Comment?: Array<{ id: string }>;
  Reposts?: Array<{ id: string }>; // Posts that have reposted this one
  // Computed fields
  commentCount?: number;
  repostCount?: number;
  reactionCount?: number;
  reactionCounts?: Record<ReactionType, number>;
  userReactions?: ReactionType[];
};

export type PostReaction = {
  id: string;
  postId: string;
  userId: string;
  reactionType: ReactionType;
  createdAt: string;
  UserProfile?: {
    userId: string;
    username: string | null;
  };
};

// backend/src/types/summary.ts

export type SentimentStats = {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
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

export type PostFormData = {
  movieId: string;
  content: string;
  type: 'SHORT' | 'LONG';
  stars?: number | null;
  spoiler?: boolean;
  tags?: string[];
  imageUrls?: string[];
  repostedPostId?: string | null;
};

export type LongPostFormData = {
  movieId: string;
  content: string;
  rating?: number;
  title?: string;
  subtitle?: string;
  tags?: string[];
  spoiler?: boolean;
  imageUrls?: string[];
};

export type ShortPostFormData = {
  movieId: string;
  content: string;
  spoiler?: boolean;
  imageUrls?: string[];
};

// For chunk-level aggregation
export type ChunkSummary = {
  pros: string[];
  cons: string[];
  stats: SentimentStats;
  quotes: string[];
};

