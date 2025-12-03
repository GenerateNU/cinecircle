import { api } from "./apiClient";
import type { components } from "../types/api-generated";

type CreateRsvpRequest = components["schemas"]["CreateRsvpRequest"];
type CreateRsvpResponse = components["schemas"]["CreateRsvpResponse"];
type GetRsvpResponse = components["schemas"]["GetRsvpResponse"];
type GetEventAttendeesResponse = components["schemas"]["GetEventAttendeesResponse"];

/**
 * Create or update an RSVP for an event
 * POST /api/event-rsvp
 */
export async function createOrUpdateRsvp(eventId: string, status: "yes" | "maybe" | "no") {
  return api.post<CreateRsvpResponse>("/api/event-rsvp", {
    eventId,
    status,
  });
}

/**
 * Get user's RSVP for a specific event
 * GET /api/event-rsvp/:eventId
 */
export async function getUserRsvp(eventId: string) {
  return api.get<GetRsvpResponse>(`/api/event-rsvp/${eventId}`);
}

/**
 * Delete user's RSVP for an event
 * DELETE /api/event-rsvp/:eventId
 */
export async function deleteRsvp(eventId: string) {
  return api.delete(`/api/event-rsvp/${eventId}`);
}

/**
 * Get all attendees for a specific event
 * GET /api/event-rsvp/event/:eventId/attendees
 */
export async function getEventAttendees(eventId: string, status?: "yes" | "maybe" | "no") {
  const params = status ? { status } : {};
  return api.get<GetEventAttendeesResponse>(`/api/event-rsvp/event/${eventId}/attendees`, {
    params,
  });
}

