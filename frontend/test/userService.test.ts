import { describe, it, expect, beforeEach, vi } from "vitest";
import { makeJsonResponse } from "./setup";
import { getUserProfileBasic, updateUserProfile, getUserRatings, getUserComments  } from "../services/userService";

describe("userService", async () => {
  const BASE = "http://svc.test";
  beforeEach(() => {
    process.env.API_BASE_URL = BASE;
    vi.resetModules();
  });

  it("getUserProfileBasic hits /api/user/profile", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({
      message: "ok",
      user: { id: "u1", email: "a@b.com", role: "user" },
    }));

    const res = await getUserProfileBasic();

    const [url, init] = (fetch as any).mock.calls[0];
    expect(url).toBe(`${BASE}/api/user/profile`);
    expect(init.method).toBe("GET");
    expect(res.user?.email).toBe("a@b.com");
  });

  it("updateUserProfile PUTs body", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({
      message: "Profile updated",
      data: { userId: "u1", preferredLanguages: [], preferredCategories: [], favoriteMovies: [] },
    }));

    const res = await updateUserProfile({ username: "neo" });

    const [, init] = (fetch as any).mock.calls[0];
    expect(init.method).toBe("PUT");
    expect(init.body).toBe(JSON.stringify({ username: "neo" }));
    expect(res.message).toBe("Profile updated");
  });

  it("getUserRatings attaches query string", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ message: "ok", ratings: [] }));

    await getUserRatings("u1");

    const [url] = (fetch as any).mock.calls[0];
    expect(url).toBe(`${BASE}/api/user/ratings?user_id=u1`);
  });

  it("getUserComments attaches query string", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ message: "ok", comments: [] }));

    await getUserComments("u1");

    const [url] = (fetch as any).mock.calls[0];
    expect(url).toBe(`${BASE}/api/user/comments?user_id=u1`);
  });
});
