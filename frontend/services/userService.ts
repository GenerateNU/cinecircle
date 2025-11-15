import { api } from "./apiClient";
import type { components } from "../types/api-generated";

type ProtectedResponse = components["schemas"]["ProtectedResponse"];
type GetUserProfileResponse = components["schemas"]["GetUserProfileResponse"];
type GetUserProfileBasicResponse = components["schemas"]["GetUserProfileBasicResponse"];
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

export async function getUserProfileBasic() {
  const res = await getUserProfile();

  const fallbackEmail =
    res.userProfile.username && res.userProfile.username.length > 0
      ? `${res.userProfile.username}@cinecircle.app`
      : `${res.userProfile.userId}@cinecircle.app`;

  const basicUser = res.user ?? {
    id: res.userProfile.userId,
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
