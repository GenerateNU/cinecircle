import { api } from "./apiClient";
import type { components } from "../types/api-generated";

type GetLocalEventsResponse = components["schemas"]["GetLocalEventsResponse"];
type GetLocalEventResponse = components["schemas"]["GetLocalEventResponse"];
export type LocalEvent = components["schemas"]["LocalEvent"];

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