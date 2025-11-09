import { api } from "./apiClient";
import type {
  ProtectedResponse,
  GetUserProfileBasicResponse,
  UpdateUserProfileInput,
  UpdateUserProfileResponse,
  DeleteUserProfileResponse,
  GetUserRatingsResponse,
  GetUserCommentsResponse,
} from "../types/apiTypes";

export function getProtected() {
  return api.get<ProtectedResponse>(`/api/protected`);
}

export function getUserProfileBasic() {
  return api.get<GetUserProfileBasicResponse>(`/api/user/profile`);
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
