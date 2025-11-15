// src/services/healthService.ts
import { api } from "./apiClient";
import type { components } from "../types/api-generated";

// Auto-generated types from backend
type PingResponse = components["schemas"]["PingResponse"];
type DbTestResponse = components["schemas"]["DbTestResponse"];

export function ping() {
  return api.get<PingResponse>(`/api/ping`);
}

export function dbTest() {
  return api.get<DbTestResponse>(`/api/db-test`);
}

export function getSwagger() {
  return api.get<any>(`/swagger-output.json`);
}
