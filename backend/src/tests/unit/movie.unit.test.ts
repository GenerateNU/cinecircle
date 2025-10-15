import { mapTmdbToMovie, fetchTmdbMovie } from "../../controllers/tmdb.js";

/**
 * Unit Tests for Movie Controller
 *
 * Tests individual functions in isolation with mocked dependencies.
 * No real database or external API calls.
 */
describe("Movie Controller Unit Tests", () => {
  describe("mapTmdbToMovie", () => {
    it("should correctly map TMDB data to Movie schema", () => {
      const tmdbMovie = {
        id: 550,
        title: "Fight Club",
        overview:
          "A ticking-time-bomb insomniac and a slippery soap salesman...",
        vote_average: 8.4,
        spoken_languages: [
          { english_name: "English" },
          { english_name: "French" },
        ],
      };

      const result = mapTmdbToMovie(tmdbMovie);

      expect(result.title).toBe("Fight Club");
      expect(result.description).toBe(
        "A ticking-time-bomb insomniac and a slippery soap salesman...",
      );
      expect(result.imdbRating).toBe(84); // 8.4 * 10
      expect(result.languages).toEqual(["English", "French"]);
      expect(result.localRating).toBe("0");
      expect(result.numRatings).toBe("0");
      expect(result.movieId).toBeDefined(); // Should generate UUID
    });

    it("should handle missing optional fields with defaults", () => {
      const tmdbMovie = {
        id: 123,
        title: "Test Movie",
        // No overview, vote_average, or languages
      };

      const result = mapTmdbToMovie(tmdbMovie);

      expect(result.title).toBe("Test Movie");
      expect(result.description).toBe("");
      expect(result.imdbRating).toBe(0);
      expect(result.languages).toEqual([]);
    });

    it("should apply custom defaults when provided", () => {
      const tmdbMovie = {
        id: 123,
        title: "Test Movie",
      };

      const result = mapTmdbToMovie(tmdbMovie, {
        defaults: {
          localRating: 7.5,
          numRatings: 100,
        },
      });

      expect(result.localRating).toBe("7.5");
      expect(result.numRatings).toBe("100");
    });

    it("should filter out undefined language names", () => {
      const tmdbMovie = {
        id: 123,
        title: "Test Movie",
        spoken_languages: [
          { english_name: "English" },
          { english_name: undefined },
          { english_name: "Spanish" },
        ],
      };

      const result = mapTmdbToMovie(tmdbMovie);

      expect(result.languages).toEqual(["English", "Spanish"]);
    });
  });

  describe("fetchTmdbMovie", () => {
    // Mock global fetch
    const originalFetch = global.fetch;

    beforeEach(() => {
      // @ts-ignore - Mock fetch
      global.fetch = jest.fn();
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it("should fetch movie data from TMDB API", async () => {
      const mockResponse = {
        id: 550,
        title: "Fight Club",
        overview: "A ticking-time-bomb insomniac...",
        vote_average: 8.4,
        spoken_languages: [{ english_name: "English" }],
      };

      // @ts-ignore
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchTmdbMovie("550");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/movie/550",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            accept: "application/json",
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error on failed TMDB request", async () => {
      // @ts-ignore
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(fetchTmdbMovie("999999")).rejects.toThrow(
        "TMDB 404 Not Found",
      );
    });

    it("should include authorization header with API token", async () => {
      const mockToken = "test-token-123";
      process.env.TMDB_API_TOKEN = mockToken;

      // @ts-ignore
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, title: "Test" }),
      });

      await fetchTmdbMovie("1");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        }),
      );
    });
  });
});
