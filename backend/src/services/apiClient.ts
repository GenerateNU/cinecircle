/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import Config from "react-native-config";

/**
 * Usage:
 *   import { api } from "./apiClient";
 *   const res = await api.get<ApiEnvelope<Movie>>(`/movies/${tmdbId}`);
 */

export type ApiEnvelope<T> = {
  message?: string;
  data?: T;
  [key: string]: unknown;
};

export class ApiError extends Error {
  status?: number;
  url?: string;
  body?: unknown;

  constructor(message: string, opts?: { status?: number; url?: string; body?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.url = opts?.url;
    this.body = opts?.body;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiClientOptions = {
  baseUrl: string;
  getToken?: () => string | undefined;
  defaultHeaders?: HeadersInit;
  timeoutMs?: number;
};

function joinUrl(base: string, path: string) {
  const left = base.replace(/\/+$/, "");
  const right = path.startsWith("/") ? path : `/${path}`;
  return `${left}${right}`;
}

export function toQuery(params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) return "";
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) v.forEach((item) => q.append(k, String(item)));
    else q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export class ApiClient {
  private baseUrl: string;
  private getToken?: () => string | undefined;
  private defaultHeaders: HeadersInit;
  private timeoutMs: number;

  constructor(opts: ApiClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, "");
    this.getToken = opts.getToken;
    this.defaultHeaders = opts.defaultHeaders ?? {};
    this.timeoutMs = opts.timeoutMs ?? 15000;
  }

  /** Normalize all header inputs to a Headers object. */
  private buildHeaders(extra?: HeadersInit, body?: unknown): Headers {
    const h = new Headers();

    // defaults first
    new Headers(this.defaultHeaders).forEach((v, k) => h.set(k, v));
    // then per-call extras
    if (extra) new Headers(extra).forEach((v, k) => h.set(k, v));

    // auth
    const token = this.getToken?.();
    if (token) h.set("Authorization", `Bearer ${token}`);

    // Content-Type for non-FormData bodies
    const isForm = typeof FormData !== "undefined" && body instanceof FormData;
    if (!isForm && body !== undefined && !h.has("Content-Type")) {
      h.set("Content-Type", "application/json");
    }

    return h;
  }

  private withTimeout<T>(promise: Promise<T>, ms: number) {
    return new Promise<T>((resolve, reject) => {
      const id = setTimeout(() => reject(new ApiError(`Request timed out after ${ms}ms`)), ms);
      promise.then(
        (v) => {
          clearTimeout(id);
          resolve(v);
        },
        (e) => {
          clearTimeout(id);
          reject(e);
        },
      );
    });
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    opts?: { body?: unknown; headers?: HeadersInit; signal?: AbortSignal }
  ): Promise<T> {
    const url = joinUrl(this.baseUrl, path);

    // Pass FormData through; otherwise JSON.stringify bodies
    const isForm = typeof FormData !== "undefined" && opts?.body instanceof FormData;
    const bodyInit = isForm
      ? (opts?.body as BodyInit)
      : opts?.body !== undefined
      ? JSON.stringify(opts.body)
      : undefined;

    const init: RequestInit = {
      method,
      headers: this.buildHeaders(opts?.headers, opts?.body),
      body: bodyInit,
      signal: opts?.signal,
    };

    const res = await this.withTimeout(fetch(url, init), this.timeoutMs);

    const raw = await res.text();
    const isJson =
      raw &&
      (res.headers.get("content-type")?.includes("application/json") ||
        raw.trim().startsWith("{") ||
        raw.trim().startsWith("["));

    let parsed: any = null;
    if (raw) {
      try {
        parsed = isJson ? JSON.parse(raw) : raw;
      } catch {
        parsed = raw;
      }
    }

    if (!res.ok) {
      const message =
        (parsed && (parsed.message || parsed.error)) ||
        `HTTP ${res.status} ${res.statusText}`;
      throw new ApiError(message, { status: res.status, url, body: parsed });
    }

    return (parsed as T) ?? ({} as T);
  }

  get<T>(path: string, params?: Record<string, any>, headers?: HeadersInit) {
    const qs = toQuery(params);
    return this.request<T>("GET", `${path}${qs}`, { headers });
  }

  post<T>(path: string, body?: unknown, headers?: HeadersInit) {
    return this.request<T>("POST", path, { body, headers });
  }

  put<T>(path: string, body?: unknown, headers?: HeadersInit) {
    return this.request<T>("PUT", path, { body, headers });
  }

  patch<T>(path: string, body?: unknown, headers?: HeadersInit) {
    return this.request<T>("PATCH", path, { body, headers });
  }

  delete<T>(path: string, headers?: HeadersInit) {
    return this.request<T>("DELETE", path, { headers });
  }
}

const BASE_URL =
  Config.API_BASE_URL ||
  "http://localhost:3000"; 

export const api = new ApiClient({
  baseUrl: BASE_URL,
  getToken: () =>
    typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined,
});
