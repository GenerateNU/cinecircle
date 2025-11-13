# Auto-Generated Type System

## Overview

CineCircle uses an automated type generation system that creates frontend TypeScript types directly from backend type definitions. This eliminates manual type duplication and ensures frontend types always match the backend API contract.

## How It Works

```
Backend Types (TypeScript)
    ↓
JSON Schema (auto-discovered)
    ↓
OpenAPI 3.0 Spec
    ↓
Frontend Types (auto-generated)
```

### The Pipeline

1. **Type Discovery** (`npm run types:discover`)
   - Scans `backend/src/types/apiTypes.ts` and `models.ts`
   - Extracts all exported types and interfaces
   - Generates JSON schemas using `ts-json-schema-generator`
   - Outputs to `backend/src/docs/schemas.json`

2. **OpenAPI Generation** (`npm run types:openapi`)
   - Reads the JSON schemas
   - Combines them with auto-detected Express routes
   - Generates OpenAPI 3.0 spec with full schemas
   - Outputs to `backend/src/docs/openapi.json`

3. **Frontend Type Generation** (`npm run types:frontend`)
   - Reads the OpenAPI spec
   - Generates TypeScript types using `openapi-typescript`
   - Copies to `frontend/types/api-generated.ts`

## Usage

### Generate All Types

From the project root:

```bash
npm run backend:types
```

This runs all three steps in sequence inside the Docker container.

### When to Regenerate Types

Run type generation whenever you:
- Add a new API endpoint
- Modify an existing type in `backend/src/types/`
- Change request/response structures
- Add new fields to models

### Using Generated Types in Frontend

#### In Services

```typescript
// frontend/services/moviesService.ts
import { api } from "./apiClient";
import type { components } from "../types/api-generated";

// Extract types from the generated schema
type GetMovieEnvelope = components["schemas"]["GetMovieEnvelope"];
type UpdateMovieInput = components["schemas"]["UpdateMovieInput"];

export function fetchMovie(tmdbId: string) {
  return api.get<GetMovieEnvelope>(`/movies/${tmdbId}`);
}

export function updateMovie(movieId: string, payload: UpdateMovieInput) {
  return api.put<GetMovieEnvelope>(`/movies/cinecircle/${movieId}`, payload);
}
```

#### In Components

```typescript
// frontend/components/MovieCard.tsx
import type { components } from "../types/api-generated";

type Movie = components["schemas"]["Movie"];

export function MovieCard({ movie }: { movie: Movie }) {
  return <div>{movie.title}</div>;
}
```

## Adding a New Endpoint

### Before we would have to:

1.  Add controller function
2.  Add route
3.  Update `backend/src/types/models.ts`
4.  Update `backend/src/types/apiTypes.ts`
5.  Update `backend/src/types/endpoints.ts`
6.  Manually copy type to `frontend/types/models.ts`
7.  Manually copy to `frontend/types/apiTypes.ts`
8.  Manually copy to `frontend/types/endpoints.ts`
9.  Update frontend service
10.  Add tests
11.  Update Prisma schema (if needed)

### Now we can:

1.  Add controller function with transformation (e.g., `mapMovieDbToApi`)
2.  Add route in `routes/index.ts`
3.  Add/update type in `backend/src/types/models.ts` or `apiTypes.ts`
4.  Add tests
5.  Run `npm run backend:types`
6.  Update frontend service (types auto-imported)

## Type Safety

### Backend Transformations

Controllers must transform Prisma types to API types:

```typescript
// backend/src/controllers/tmdb.ts
import type { Movie } from "../types/models";

export function mapMovieDbToApi(dbMovie: Prisma.movieGetPayload<{}>): Movie {
  return {
    movieId: dbMovie.movieId,
    title: dbMovie.title,
    description: dbMovie.description,
    languages: dbMovie.languages ? (dbMovie.languages as string[]) : null,
    imdbRating: dbMovie.imdbRating != null ? Number(dbMovie.imdbRating) : null,
    localRating: dbMovie.localRating,
    numRatings: dbMovie.numRatings,
  };
}

export const getMovieById = async (req: Request, res: Response) => {
  const movie = await prisma.movie.findUnique({ where: { movieId } });
  const movieResponse = mapMovieDbToApi(movie); // ← Transform
  res.json({ message: "Movie found", data: movieResponse });
};
```

This ensures:
- Prisma DB types → API contract types properly converted
- Frontend receives data in expected format
- Type mismatches caught at compile time

### Transformations Are Needed Because:

Prisma schema types don't always match API types:

| Prisma Schema | API Type | Reason |
|---------------|----------|--------|
| `BigInt` | `number` | JavaScript number limit |
| `Json` | `string[]` | Type-safe arrays |
| `String` | `number` | Numeric ratings as strings in DB |

Transformations bridge this gap.

## Troubleshooting

### "Cannot find module '../types/api-generated'"

**Solution:** Generate the types:
```bash
npm run backend:types
```

### "Type X is not found in schemas"

**Causes:**
- Type not exported from `apiTypes.ts` or `models.ts`
- Type uses unsupported TypeScript features
- Type discovery skipped it (check logs)

**Solution:** 
1. Ensure type is exported: `export type X = ...`
2. Check `backend/src/docs/schemas.json` to see if it was generated
3. Run `npm run types:discover` and check for warnings

### Backend container not running

**Solution:**
```bash
npm run backend:start
```

### Types out of sync

**Symptoms:**
- Runtime errors about missing fields
- TypeScript errors in frontend

**Solution:**
```bash
npm run backend:types
```

## File Structure

```
backend/
  src/
    types/
      models.ts          <- Define domain models here
      apiTypes.ts        <- Define request/response types here
    docs/
      schemas.json       <- Auto-generated JSON schemas
      openapi.json       <- Auto-generated OpenAPI 3.0 spec
      api-types.ts       <- Auto-generated TypeScript types
  scripts/
    generate-types.js        <- Type discovery script
    generate-docs.js         <- OpenAPI generation script
    generate-frontend-types.js <- Frontend type generation script

frontend/
  types/
    api-generated.ts     <- Auto-generated (copied from backend)
    models.ts            <- UI-specific types + bridge types (temp)
  services/
    moviesService.ts     <- Uses generated types
    userService.ts       <- Uses generated types
```
