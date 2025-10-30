import { describe, it, expect, beforeEach, vi } from "vitest";
import { makeJsonResponse } from "./setup";
import { fetchAndSaveByTmdbId, updateMovieByCinecircleId, deleteMovie } from "backend/src/services/moviesService";

describe("moviesService", async () => {
  const BASE = "http://svc.test";
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = BASE;
    vi.resetModules();
  });

  it("fetchAndSaveByTmdbId calls GET /movies/:tmdbId", async () => {
    const payload = { message: "ok", data: { movieId: "uuid", title: "Inception" } };
    (fetch as any).mockResolvedValueOnce(makeJsonResponse(payload));

    const res = await fetchAndSaveByTmdbId("123");

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (fetch as any).mock.calls[0];
    expect(url).toBe(`${BASE}/movies/123`);
    expect(init.method).toBe("GET");
    expect(res.data?.title).toBe("Inception");
  });

  it("updateMovieByCinecircleId calls PUT with body", async () => {
    const payload = { message: "updated", data: { movieId: "m1", title: "New Title" } };
    (fetch as any).mockResolvedValueOnce(makeJsonResponse(payload));

    const res = await updateMovieByCinecircleId("m1", { title: "New Title" });

    const [url, init] = (fetch as any).mock.calls[0];
    expect(url).toBe(`${BASE}/movies/cinecircle/m1`);
    expect(init.method).toBe("PUT");
    expect(init.body).toBe(JSON.stringify({ title: "New Title" }));
    expect(res.message).toBe("updated");
    expect(res.data?.title).toBe("New Title");
  });

  it("deleteMovie calls DELETE", async () => {
    (fetch as any).mockResolvedValueOnce(makeJsonResponse({ message: "deleted" }));

    const res = await deleteMovie("m1");

    const [url, init] = (fetch as any).mock.calls[0];
    expect(url).toBe(`${BASE}/movies/m1`);
    expect(init.method).toBe("DELETE");
    expect(res.message).toBe("deleted");
  });
});
