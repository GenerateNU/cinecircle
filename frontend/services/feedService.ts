import { api } from "./apiClient";

export type HomeFeedItem = {
  type: string;
  data: Record<string, any>;
};

export type HomeFeedResponse = {
  message?: string;
  data?: HomeFeedItem[];
};

export async function getHomeFeed(limit?: number) {
  const params = limit ? { limit } : undefined;
  return api.get<HomeFeedResponse>("/api/feed", params);
}
