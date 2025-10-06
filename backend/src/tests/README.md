# Testing Guide

## Overview

The CineCircle backend has 3 testing types (Unit, Model, and E2E) with **production data** copied to a local PostgreSQL database.

## Prerequisites

Before running tests, you must sync production data to your local database:

```bash
npm run db:sync
```

This command copies the production database to your local PostgreSQL instance.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Test Structure

```
src/tests/
├── api/                    # API E2E tests
│   └── movie.api.test.ts   # Movie endpoint (example)
├── database/               # Model tests
│   └── models.test.ts      # Database model + movie (example)
├── unit/                   # Unit tests
│   └── movie.unit.test.ts  # Movie controller unit tests (example)
└── helpers/                # Test utilities and setup
    ├── __mocks__/          # Mock modules
    │   └── scalar.ts       # Mock for @scalar/express-api-reference
    ├── setup.ts            # Prisma client and config
    └── constants.ts        # Test constants and timeouts
```

## Types of Tests

### 1. **Unit Tests** (`unit/`)

**What they test:** Individual functions and modules in complete isolation with mocked dependencies.

**Test Flow:**
```
Function/Module → Mocked Dependencies → Return Value
```

**When to write them:**
- ✅ Test pure functions (data transformations, calculations)
- ✅ Test business logic without external dependencies
- ✅ Validate input/output transformations
- ✅ Test error handling and edge cases in isolation
- ✅ Fast, focused tests for specific functionality
- ✅ Test utility functions and helpers

**Example use cases:**
```typescript
// Pure function testing
it('should map TMDB data to Movie schema', () => {
  const tmdbMovie = {
    id: 550,
    title: 'Fight Club',
    vote_average: 8.4,
  };

  const result = mapTmdbToMovie(tmdbMovie);

  expect(result.title).toBe('Fight Club');
  expect(result.imdbRating).toBe(84);
});

// Mocking external APIs
it('should fetch from TMDB API', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: 550, title: 'Fight Club' }),
  });

  const result = await fetchTmdbMovie('550');
  
  expect(result.title).toBe('Fight Club');
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.themoviedb.org/3/movie/550',
    expect.any(Object)
  );
});

// Edge case testing
it('should handle missing optional fields', () => {
  const tmdbMovie = { id: 123, title: 'Test' };
  const result = mapTmdbToMovie(tmdbMovie);
  
  expect(result.description).toBe('');
  expect(result.languages).toEqual([]);
  expect(result.imdbRating).toBe(0);
});
```

**What NOT to test here:**
- ❌ Real database operations (use model tests)
- ❌ Real HTTP endpoints (use API tests)
- ❌ Full integration flows (use API tests)
- ❌ External API calls without mocks (use API tests)

---

### 2. **Database/Model Tests** (`database/`)

**What they test:** Direct database queries and ORM functionality using Prisma.

**Test Flow:**
```
Prisma Client → Database → Return Data
```

**When to write them:**
- ✅ Verify database schema structure and field existence
- ✅ Test complex queries (joins, aggregations, filters)
- ✅ Validate data relationships (foreign keys, includes)
- ✅ Check database connection and configuration
- ✅ Test query performance with realistic data volumes

**Example use cases:**
```typescript
// Schema validation
it('should have correct movie schema', async () => {
  const movie = await prisma.movie.findFirst();
  expect(movie).toHaveProperty('movieId');
  expect(movie).toHaveProperty('title');
});

// Relationship testing
it('should fetch movie with ratings', async () => {
  const movie = await prisma.movie.findFirst({
    include: { ratings: true }
  });
  expect(movie.ratings).toBeDefined();
});

// Complex queries
it('should filter movies by rating threshold', async () => {
  const topMovies = await prisma.movie.findMany({
    where: { localRating: { gte: 8.0 } },
    take: 10
  });
  expect(topMovies.every(m => m.localRating >= 8.0)).toBe(true);
});
```

**What NOT to test here:**
- ❌ HTTP endpoints or API responses
- ❌ Business logic in controllers
- ❌ External API integrations (TMDB, etc.)
- ❌ Request/response transformations

---

### 3. **API/Endpoint Tests** (`api/`)

**What they test:** HTTP endpoints, full request/response cycle, and integration with external services.

**Test Flow:**
```
HTTP Request → Router → Controller → Service Layer → External APIs → Database → Transform → HTTP Response
```

**When to write them:**
- ✅ Verify HTTP endpoints respond with correct status codes
- ✅ Test request/response JSON structure and data types
- ✅ Validate error handling and edge cases
- ✅ Test integration with external APIs (TMDB, auth services, etc.)
- ✅ Verify business logic in controllers
- ✅ Test authentication and authorization flows
- ✅ Validate data transformations and serialization

**Example use cases:**
```typescript
// Endpoint functionality
it('should fetch movie from TMDB and save to DB', async () => {
  const response = await request(app)
    .get('/movies/550')
    .expect(200);
  
  expect(response.body.data).toHaveProperty('title');
  expect(response.body.message).toBe('Movie fetched from TMDB and saved to DB');
});

// Error handling
it('should return 404 for non-existent movie', async () => {
  const response = await request(app)
    .get('/movies/999999999')
    .expect(500);
  
  expect(response.body).toHaveProperty('error');
});

// Response structure
it('should return correct JSON structure', async () => {
  const response = await request(app)
    .get('/movies/278')
    .expect('Content-Type', /json/);
  
  expect(response.body).toHaveProperty('data');
  expect(response.body).toHaveProperty('message');
});

// Business logic
it('should update existing movie on duplicate request', async () => {
  const first = await request(app).get('/movies/278');
  const second = await request(app).get('/movies/278');
  
  expect(first.body.data.title).toBe(second.body.data.title);
});
```

**What NOT to test here:**
- ❌ Raw database queries / ORM behavior (use model tests)
- ❌ Database schema structure (use model tests)

---

### Issue Pinpointer

**Unit**, **Database**, and **API tests** can fail independently:

| Scenario | Unit Test | Model Test | API Test |
|----------|-----------|------------|----------|
| Data transformation bug | ❌ Fails | ✅ Passes | ❌ Fails |
| Database connection broken | ✅ Passes (mocked) | ❌ Fails | ❌ Fails |
| TMDB API down | ✅ Passes (mocked) | ✅ Passes | ❌ Fails |
| Controller logic error | ❌ Fails | ✅ Passes | ❌ Fails |
| Response serialization bug | ✅ Passes | ✅ Passes | ❌ Fails |
| Schema validation | ✅ Catches | ✅ Catches | ✅ Catches |
| Prisma query error | ✅ Passes (mocked) | ❌ Fails | ❌ Fails |

**The Testing Pyramid:**
```
       /\
      /  \     Few, slow, expensive
     / E2E\    API Tests (full integration)
    /------\   
   /Database\ Medium speed & scope  
  /  Tests   \ Model Tests (DB operations)
 /------------\
/   Unit Tests \ Many, fast, cheap
\______________/ (isolated functions)
```
---

## Writing Tests

### 1. Unit Tests

Unit tests verify individual functions in isolation with mocked dependencies.

**See `/tests/unit/movie.unit.test.ts` for a small example.**

Basic pattern:

```typescript
import { mapTmdbToMovie } from '../../controllers/tmdb.js';

describe('Movie Controller Unit Tests', () => {
  it('should transform data correctly', () => {
    const input = { id: 550, title: 'Fight Club', vote_average: 8.4 };
    const result = mapTmdbToMovie(input);
    
    expect(result.title).toBe('Fight Club');
    expect(result.imdbRating).toBe(84);
  });

  // Mocking external dependencies
  it('should handle API calls', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, title: 'Test' }),
    });

    const result = await fetchTmdbMovie('1');
    expect(result.title).toBe('Test');
  });
});
```

### 2. API Tests

API tests verify endpoints work correctly with production data.

**See `/tests/api/movie.api.test.ts` for a small example.**

Basic pattern:

```typescript
import request from 'supertest';
import express from 'express';
import { createApp } from '../../app';
import { HTTP_STATUS } from '../helpers/constants.js';

describe('My API Tests', () => {
  let app: express.Express;

  beforeAll(async () => {
    app = createApp();
  });

  it('should return data from endpoint', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(HTTP_STATUS.OK);

    expect(response.body).toBeDefined();
  });
});
```

### 3. Database Tests

Database tests query and verify production data.

**See `/tests/database/models.test.ts` for a small example.**

Basic pattern:

```typescript
import { PrismaClient } from '@prisma/client';
import { getTestPrisma, closeTestPrisma } from '../helpers/setup.js';
import { TEST_LIMITS } from '../helpers/constants.js';

describe('Database Tests', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = await getTestPrisma();
  });

  afterAll(async () => {
    await closeTestPrisma();
  });

  it('should query production data', async () => {
    const movies = await prisma.movie.findMany({
      take: TEST_LIMITS.SMALL,
    });

    if (movies.length > 0) {
      expect(movies[0]).toHaveProperty('movieId');
      expect(movies[0]).toHaveProperty('title');
    }
  });
});
```

## Test Helpers

### `setup.ts`

- **`getTestPrisma()`** - Get or create shared Prisma client
- **`closeTestPrisma()`** - Close database connection
- **`verifyDatabaseConnection()`** - Check database connectivity
- **`getTestConfig()`** - Get test configuration

### `constants.ts`

- **`TEST_TIMEOUTS`** - Timeout values for different test types
- **`HTTP_STATUS`** - Common HTTP status codes
- **`TEST_TABLES`** - Database table names

## Important Notes

### ✅ DO:
- Test with production data (synced via `npm run db:sync`)
- Write tests that verify business logic and data integrity
- Use `getTestPrisma()` for shared database connections
- Clean up connections in `afterAll()` hooks
- Test edge cases based on actual production scenarios

### ❌ DON'T:
- Create seed data or fixtures
- Assume specific data exists (query first, then assert)

## Best Practices

1. **Query Before Testing**: Always fetch data before making assertions
   ```typescript
   const user = await prisma.user.findFirst();
   expect(user).toBeDefined();
   ```

2. **Use Realistic Scenarios**: Test with patterns found in production data
   ```typescript
   const activeUsers = await prisma.user.findMany({
     where: { status: 'active' },
     take: 5,
   });
   expect(activeUsers.length).toBeGreaterThan(0);
   ```

3. **Handle Missing Data Gracefully**: Production data may change
   ```typescript
   const records = await prisma.record.findMany();
   if (records.length > 0) {
     expect(records[0]).toHaveProperty('id');
   }
   ```

4. **Test API Behavior, Not Specific Data**:
   ```typescript
   // Good: Tests structure and behavior
   const response = await request(app).get('/api/users');
   expect(response.status).toBe(200);
   expect(Array.isArray(response.body)).toBe(true);

   // Avoid: Testing specific production values
   // expect(response.body[0].name).toBe('John Doe');
   ```

## Troubleshooting

### Database Connection Issues
1. Ensure `.env` is configured with correct `DATABASE_URL` and `DIRECT_URL`
2. Run `npm run db:sync` to refresh data
3. Check PostgreSQL is running locally

### Tests Failing After Data Sync
- Production data may have changed
- Update tests to be more flexible with data expectations
- Use `.toBeDefined()` and `.toBeGreaterThan(0)` instead of exact values

### Slow Tests
- Use `TEST_TIMEOUTS` from constants
- Consider if queries are optimized
- Check if database indexes are properly set

## Migration Testing

When schema changes occur:
1. Run migrations locally: `npm run db:migrate`
2. Sync production data: `npm run db:sync`
3. Run tests to verify compatibility: `npm test`
4. Update tests if schema changes require it

