import { api, ApiError } from "./apiClient";
import type { components } from "../types/api-generated";

type GetLocalEventsResponse = components["schemas"]["GetLocalEventsResponse"];
type GetLocalEventResponse = components["schemas"]["GetLocalEventResponse"];
export type LocalEvent = components["schemas"]["LocalEvent"];
type GetUserEventsResponse = { data?: LocalEvent[]; message?: string };

// Client-side cache with 5-minute TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch all local events
 * GET /api/local-events
 */
export async function getLocalEvents(bypassCache = false) {
  const cacheKey = 'local-events';
  
  if (!bypassCache) {
    const cached = getCachedData<GetLocalEventsResponse>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const response = await api.get<GetLocalEventsResponse>("/api/local-events");
  setCachedData(cacheKey, response);
  return response;
}

/**
 * Fetch a single local event by ID
 * GET /api/local-event/:id
 */
export async function getLocalEvent(id: string) {
  return api.get<GetLocalEventResponse>(`/api/local-event/${id}`);
}

/**
 * Fetch events saved by a specific user
 * GET /api/user/events?user_id=:userId
 * Falls back to all local events if the endpoint is unavailable (404)
 */
export async function getUserEvents(userId: string, bypassCache = false): Promise<LocalEvent[]> {
  const cacheKey = `user-events-${userId}`;
  
  if (!bypassCache) {
    const cached = getCachedData<LocalEvent[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const res = await api.get<GetUserEventsResponse>('/api/user/events', {
      user_id: userId,
    });
    const events = res.data ?? [];
    setCachedData(cacheKey, events);
    return events;
  } catch (err) {
    const status = (err as ApiError)?.status;
    if (status && status !== 404) {
      throw err;
    }
    // Endpoint missing or not implemented on backend; return all local events as a fallback
    const fallback = await getLocalEvents(bypassCache);
    const events = (fallback as GetLocalEventsResponse)?.data ?? [];
    setCachedData(cacheKey, events);
    return events;
  }
}

/**
 * Clear all cached events data
 */
export function clearEventsCache(): void {
  cache.clear();
}
