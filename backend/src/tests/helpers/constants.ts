/**
 * Test Constants and Utilities
 *
 * Since tests use production data, these constants help with:
 * - Database query timeouts
 * - Test configuration
 * - Common test expectations
 */

// Test timeouts (in milliseconds)
export const TEST_TIMEOUTS = {
  SHORT: 5000, // For simple queries
  MEDIUM: 15000, // For complex queries
  LONG: 30000, // For heavy operations
} as const;

// Common HTTP status codes for testing
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Test database table names
export const TEST_TABLES = {
  MOVIE: "movie",
  RATING: "Rating",
  USERS: "users",
} as const;

// Test query limits
export const TEST_LIMITS = {
  SMALL: 5,
  MEDIUM: 20,
  LARGE: 100,
} as const;
