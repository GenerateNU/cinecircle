import { api } from "./apiClient";
import type { components } from "../types/api-generated";
import { setLanguage } from "../app/il8n/il8n";
import type { LanguageCode } from "../app/il8n/languages";


type ProtectedResponse = components["schemas"]["ProtectedResponse"];
type GetUserProfileResponse = components["schemas"]["GetUserProfileResponse"];
type UpdateUserProfileInput = components["schemas"]["UpdateUserProfileInput"];
type UpdateUserProfileResponse = components["schemas"]["UpdateUserProfileResponse"];
type DeleteUserProfileResponse = components["schemas"]["DeleteUserProfileResponse"];
type GetUserRatingsResponse = components["schemas"]["GetUserRatingsResponse"];
type GetUserCommentsResponse = components["schemas"]["GetUserCommentsResponse"];

export function getProtected() {
  return api.get<ProtectedResponse>(`/api/protected`);
}

export function getUserProfile() {
  return api.get<GetUserProfileResponse>(`/api/user/profile`);
}

export function updateUserProfile(payload: UpdateUserProfileInput) {
  return api.put<UpdateUserProfileResponse>(`/api/user/profile`, payload);
}

export function deleteUserProfile() {
  return api.delete<DeleteUserProfileResponse>(`/api/user/profile`);
}

export function getUserRatings(userId: string) {
  return api.get<GetUserRatingsResponse>(`/api/user/ratings`, { user_id: userId });
}

export function getUserComments(userId: string) {
  return api.get<GetUserCommentsResponse>(`/api/user/comments`, { user_id: userId });
}

export async function fetchUserProfile() {
  const res = await api.get<any>("/api/user/profile");
  console.log("[user] raw profile response:", res);

  // Your API is returning the envelope directly, so:
  const profileEnvelope = res;
  console.log("[user] parsed profile:", profileEnvelope);

  const primaryLanguage = profileEnvelope?.userProfile?.primaryLanguage;
  console.log("[user] primaryLanguage from envelope:", primaryLanguage);

  if (primaryLanguage) {
    setLanguage(primaryLanguage); // "Hindi" in your logs
  } else {
    console.log("[user] no primaryLanguage found, keeping default 'en'");
  }

  return profileEnvelope;
}
