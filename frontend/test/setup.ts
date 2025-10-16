import { vi } from "vitest";

if (!(globalThis as any).fetch) (globalThis as any).fetch = vi.fn();

process.env.NEXT_PUBLIC_API_BASE_URL = "http://svc.test";

// Minimal Response-like mock helpers
export function makeTextResponse(body: string, status = 200, headers?: Record<string, string>) {
  const h = Object.fromEntries(
    Object.entries(headers ?? { "content-type": "text/plain" }).map(([k, v]) => [k.toLowerCase(), v]),
  );
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: { get: (k: string) => h[k.toLowerCase()] },
    text: async () => body,
  } as Response;
}

export function makeJsonResponse(data: unknown, status = 200, headers?: Record<string, string>) {
  return makeTextResponse(JSON.stringify(data), status, {
    "content-type": "application/json",
    ...(headers ?? {}),
  });
}

// Default mock individual tests will override return values
vi.stubGlobal("fetch", vi.fn(async () => makeTextResponse("ok")));
