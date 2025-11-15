import { api } from "./apiClient";
import type { GetMutualRecommendationsResponse } from "../types/apiTypes";

export function getMutualRecommendations() {
  return api.get<GetMutualRecommendationsResponse>(`/api/recommendations/mutual`);
}
