import { api } from "../services/apiClient";
import type { Endpoints } from "../types/endpoints";

type Key = keyof Endpoints;
type Res<K extends Key> = Endpoints[K]["response"];
type Body<K extends Key> = Endpoints[K] extends { body: infer B }
  ? B
  : undefined;

export const endpoints: Endpoints = {
  "GET /api/ping": { path: () => `/api/ping`, response: {} as any },
} as any;

export async function call<K extends Key>(
  key: K,
  args: Parameters<Endpoints[K]["path"]>[0],
  body?: Body<K>,
): Promise<Res<K>> {
  const [method] = (key as string).split(" ") as [
    "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    string,
  ];
  const path = endpoints[key].path(args as any);

  switch (method) {
    case "GET":
      return api.get(
        path,
        typeof args === "object" && !Array.isArray(args)
          ? (args as any)
          : undefined,
      ) as any;
    case "DELETE":
      return api.delete(path) as any;
    case "POST":
      return api.post(path, body) as any;
    case "PUT":
      return api.put(path, body) as any;
    case "PATCH":
      return api.patch(path, body) as any;
  }
}
