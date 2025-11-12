// src/types/schemas.ts
import { z } from "zod";

export const MovieSchema = z.object({
  movieId: z.string(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  languages: z.array(z.string()).nullable().optional(),
  imdbRating: z.number().nullable().optional(),
  localRating: z.union([z.string(), z.number()]).nullable().optional(),
  numRatings: z.union([z.string(), z.number()]).nullable().optional(),
});

export const UserProfileBasicSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().nullable().optional(),
  role: z.string().nullable().optional(),
});

export const UserProfileSchema = z.object({
  userId: z.string(),
  username: z.string().nullable().optional(),
  onboardingCompleted: z.boolean(),
  primaryLanguage: z.string(),
  secondaryLanguage: z.array(z.string()),
  profilePicture: z.string(),
  country: z.string(),
  city: z.string(),
  favoriteGenres: z.array(z.string()),
  favoriteMovies: z.array(z.string()),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const RatingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  movieId: z.string(),
  stars: z.number(),
  comment: z.string().nullable().optional(),
  tags: z.array(z.string()),
  date: z.string(),
  votes: z.number(),
  threadedComments: z.any().array().optional(),
});

export const CommentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  ratingId: z.string().nullable().optional(),
  postId: z.string().nullable().optional(),
  content: z.string(),
  createdAt: z.string(),
  rating: z.any().optional(),
  post: z.any().optional(),
});

export const FollowEdgeSchema = z.object({
  follower: UserProfileSchema.optional(),
  following: UserProfileSchema.optional(),
});

/** Envelopes */
export const ApiEnvelopeSchema = <T extends z.ZodTypeAny>(inner: T) =>
  z.object({
    message: z.string().optional(),
    data: inner.optional(),
  });
