// src/types/models.ts
//
// UI-specific types only. API types are auto-generated in api-generated.ts
// Components should import API types from "./api-generated"

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


export type Movie = {
  movieId: string;
  localRating: number | null;
  imdbRating: number | null;
  languages: string[] | null;
  title: string;
  description: string;
  numRatings: number | null;
  imageUrl: string | null;
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
  threadedComments?: unknown[];
};


export type Comment = {
  id: string;
  userId: string;
  movieId: string;
  content: string;
  createdAt: string;
};

export type Summary = {
  movieId: string;
  summaryText: string;
  pros?: string[];
  cons?: string[];
  stats?: {
    averageRating: number;
    totalReviews: number;
  };
};    
