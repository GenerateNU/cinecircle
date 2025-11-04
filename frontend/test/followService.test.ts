import { describe, it, expect, beforeEach, vi } from "vitest";
import { makeJsonResponse } from "./setup";
import { followUser, getFollowers, getFollowing  } from "../services/followService";

describe("followService", async () => {
  const BASE = "http://svc.test";
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = BASE;
    vi.resetModules();
  });

  it("followUser POSTs body", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ message: "You are now following u2" }));

    const res = await followUser("u2");

    const [url, init] = (fetch as any).mock.calls[0];
    expect(url).toBe(`${BASE}/api/user/follow`);
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ followingId: "u2" }));
    expect(res.message).toMatch(/now following/);
  });

  it("getFollowers GETs correct path", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ followers: [] }));

    await getFollowers("u1");

    const [url, init] = (fetch as any).mock.calls[0];
    expect(url).toBe(`${BASE}/api/user/u1/followers`);
    expect(init.method).toBe("GET");
  });

  it("getFollowing GETs correct path", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ following: [] }));

    await getFollowing("u1");

    const [url, init] = (fetch as any).mock.calls[0];
    expect(url).toBe(`${BASE}/api/user/u1/following`);
    expect(init.method).toBe("GET");
  });
});
