import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeJsonResponse, makeTextResponse } from "./setup";
import { ApiClient, toQuery } from "../../backend/src/services/apiClient";

describe("toQuery()", () => {
  it("builds query string correctly", () => {
    expect(toQuery({ a: 1, b: "x" })).toBe("?a=1&b=x");
    expect(toQuery({ a: undefined, b: null })).toBe("");
    expect(toQuery({ tags: ["a", "b"] })).toBe("?tags=a&tags=b");
  });
});

describe("ApiClient", () => {
  const baseUrl = "http://api.test";

  beforeEach(() => {
    vi.useRealTimers();
  });

  it("GET: builds url with query params", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ ok: true }));

    const client = new ApiClient({ baseUrl });
    await client.get("/x", { user_id: "123", q: "hi" });

    expect(fetch).toHaveBeenCalledTimes(1);
    const url = (fetch as any).mock.calls[0][0] as string;
    expect(url).toBe("http://api.test/x?user_id=123&q=hi");
  });

  it("adds Authorization if token provided", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ ok: true }));

    const client = new ApiClient({
      baseUrl,
      getToken: () => "TOKEN",
      defaultHeaders: { "x-default": "1" },
    });

    await client.post("/secure", { hello: "world" });

    const init = (fetch as any).mock.calls[0][1] as RequestInit;
    const headers = init.headers as Headers;
    expect(headers.get("authorization")).toBe("Bearer TOKEN");
    expect(headers.get("x-default")).toBe("1");
  });

  it("sets Content-Type: application/json for non-FormData bodies", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ ok: true }));

    const client = new ApiClient({ baseUrl });
    await client.post("/json", { hello: "world" });

    const init = (fetch as any).mock.calls[0][1] as RequestInit;
    const headers = init.headers as Headers;
    expect(headers.get("content-type")).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ hello: "world" }));
  });

  it("does not set Content-Type for FormData", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ ok: true }));

    const client = new ApiClient({ baseUrl });
    const form = new FormData();
    form.append("file", new Blob(["abc"], { type: "text/plain" }), "a.txt");
    await client.post("/upload", form);

    const init = (fetch as any).mock.calls[0][1] as RequestInit;
    const headers = init.headers as Headers;
    expect(headers.get("content-type")).toBeNull();
    expect(init.body).toBe(form);
  });

  it("parses JSON response", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ message: "ok", data: { a: 1 } }));

    const client = new ApiClient({ baseUrl });
    const res = await client.get<{ message: string; data: { a: number } }>("/x");

    expect(res.message).toBe("ok");
    expect(res.data.a).toBe(1);
  });

  it("returns raw text for non-JSON response", async () => {
    (fetch as any).mockResolvedValueOnce(makeTextResponse("HELLO", 200, { "content-type": "text/plain" }));

    const client = new ApiClient({ baseUrl });
    const res = await client.get<string>("/text");

    expect(res).toBe("HELLO");
  });

  it("throws ApiError on non-2xx, using message from JSON", async () => {
    const payload = { message: "Nope" };
    (fetch as any).mockResolvedValueOnce(makeJsonResponse(payload, 400));

    const client = new ApiClient({ baseUrl });

    await expect(client.get("/bad")).rejects.toMatchObject({
      name: "ApiError",
      message: "Nope",
      status: 400,
    });
  });

  it("throws ApiError with HTTP status text if body not JSON", async () => {
    (fetch as any).mockResolvedValueOnce(makeTextResponse("oops", 500));

    const client = new ApiClient({ baseUrl });

    await expect(client.get("/bad")).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      message: expect.stringContaining("HTTP 500"),
    });
  });

  it("times out requests", async () => {
    const never = new Promise(() => {});
    (fetch as any).mockReturnValueOnce(never);

    const client = new ApiClient({ baseUrl, timeoutMs: 10 });

    await expect(client.get("/slow")).rejects.toMatchObject({
      name: "ApiError",
      message: expect.stringContaining("timed out"),
    });
  });
});
