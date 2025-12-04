import { api, ApiError } from "./apiClient";
import type { components } from "../types/api-generated";

type GetLocalEventsResponse = components["schemas"]["GetLocalEventsResponse"];
type GetLocalEventResponse = components["schemas"]["GetLocalEventResponse"];
export type LocalEvent = components["schemas"]["LocalEvent"];
type GetUserEventsResponse = { data?: LocalEvent[]; message?: string };

/**
 * Fetch all local events
 * GET /api/local-events
 */
export async function getLocalEvents() {
  return api.get<GetLocalEventsResponse>("/api/local-events");
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
export async function getUserEvents(userId: string): Promise<LocalEvent[]> {
  try {
    const res = await api.get<GetUserEventsResponse>('/api/user/events', {
      user_id: userId,
    });
    return res.data ?? [];
  } catch (err) {
    const status = (err as ApiError)?.status;
    if (status && status !== 404) {
      throw err;
    }
    // Endpoint missing or not implemented on backend; return all local events as a fallback
    const fallback = await getLocalEvents();
    return (fallback as GetLocalEventsResponse)?.data ?? [];
  }
}
