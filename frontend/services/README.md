# Frontend API Services

API client and service layer for connecting to the backend.

## Files

- `apiClient.ts` - HTTP client with automatic auth token injection
- `userService.ts` - User profile endpoints
- `moviesService.ts` - Movie data endpoints  
- `followService.ts` - Follow/unfollow endpoints
- `healthService.ts` - Health check endpoints

## Usage

```typescript
import { getUserProfileBasic } from './services/userService';
import { fetchAndSaveByTmdbId } from './services/moviesService';

// All API calls automatically include auth token
const profile = await getUserProfileBasic();
const movie = await fetchAndSaveByTmdbId('123');
```

## Configuration

Set in `.env`:
```
API_BASE_URL=http://localhost:3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Authentication

The `AuthProvider` in `context/AuthContext.tsx` automatically:
1. Gets Supabase session on app load
2. Sets API token via `setApiToken()`
3. Updates token on auth state changes

All API calls include the token in the Authorization header.

