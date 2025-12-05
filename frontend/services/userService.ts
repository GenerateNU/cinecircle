import { api } from "./apiClient";
import type { components } from "../types/api-generated";
import { setLanguage } from "../il8n/_il8n";
import type { LanguageCode } from "../il8n/_languages";


type ProtectedResponse = components["schemas"]["ProtectedResponse"];
type GetUserProfileResponse = components["schemas"]["GetUserProfileResponse"] & {
  userProfile: (components["schemas"]["UserProfile"] & {
    privateAccount?: boolean;
    spoiler?: boolean;
    secondaryLanguage?: string[];
    moviesToWatch?: string[];
    moviesCompleted?: string[];
    bio?: string | null;
  }) | null;
};
type GetUserProfileBasicResponse = components["schemas"]["GetUserProfileBasicResponse"];
type UpdateUserProfileInput = components["schemas"]["UpdateUserProfileInput"] & {
  privateAccount?: boolean;
  spoiler?: boolean;
  secondaryLanguage?: string[];
  username?: string;
    moviesToWatch?: string[];
    moviesCompleted?: string[];
  bio?: string | null;
};
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

export async function getUserProfileBasic() {
  const res = await getUserProfile();
  const profile = res.userProfile;

  if (!profile) {
    throw new Error('User profile missing from response');
  }

  const fallbackEmail =
    profile.username && profile.username.length > 0
      ? `${profile.username}@cinecircle.app`
      : `${profile.userId}@cinecircle.app`;

  const basicUser = res.user ?? {
    id: profile.userId,
    email: fallbackEmail,
    role: 'USER',
  };

  const payload: GetUserProfileBasicResponse = {
    message: res.message,
    user: basicUser,
    timestamp: res.timestamp,
    endpoint: res.endpoint,
  };

  return payload;
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
