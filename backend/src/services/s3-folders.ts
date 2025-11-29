/**
 * S3 folder structure for organizing uploads by entity type
 */
export const S3_FOLDERS = {
  POSTS: 'posts',
  MOVIES: 'movies',
  PROFILES: 'profiles',
  EVENTS: 'events',
  REVIEWS: 'reviews',
} as const;

export type S3Folder = typeof S3_FOLDERS[keyof typeof S3_FOLDERS];

