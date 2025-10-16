// src/services/healthService.ts
import { api } from "./apiClient";

export function ping() {
  return api.get<{ message?: string; [k: string]: unknown }>(`/api/ping`);
}

export function dbTest() {
  return api.get<{ message?: string; [k: string]: unknown }>(`/api/db-test`);
}

export function getSwagger() {
  return api.get<any>(`/swagger-output.json`);
}
