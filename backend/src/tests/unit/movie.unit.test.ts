import { mapTmdbToMovie, fetchTmdbMovie, deleteMovie, getMovieById } from "../../controllers/tmdb.js";
import { Request, Response } from "express";
import { prisma } from "../../services/db.js";
import { Prisma } from "@prisma/client";

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
          {english_name: "English"},
          {english_name: "French"},
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
          localRating: "7.5",
          numRatings: "100",
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
          {english_name: "English"},
          {english_name: undefined},
          {english_name: "Spanish"},
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
        spoken_languages: [{english_name: "English"}],
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
        json: async () => ({id: 1, title: "Test"}),
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

  describe("deleteMovie", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
      // Reset mocks before each test
      mockRequest = {
        params: {},
      };

      responseObject = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      };

      mockResponse = responseObject;

      // Mock Prisma
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 400 if movieId is not provided", async () => {
      mockRequest.params = {}; // No movieId

      await deleteMovie(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie ID is required",
      });
    });

    it("should return 404 if movie is not found", async () => {
      mockRequest.params = {movieId: "non-existent-uuid"};

      // Mock Prisma to throw P2025 error (record not found)
      const notFoundError = new Prisma.PrismaClientKnownRequestError(
          "Record to delete does not exist",
          {
            code: "P2025",
            clientVersion: "6.15.0",
          }
      );

      jest.spyOn(prisma.movie, "delete").mockRejectedValueOnce(notFoundError);

      await deleteMovie(mockRequest as Request, mockResponse as Response);

      expect(prisma.movie.delete).toHaveBeenCalledWith({
        where: {movieId: "non-existent-uuid"},
      });
      expect(responseObject.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie not found",
      });
    });

    it("should delete movie successfully", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = {movieId: mockMovieId};

      const mockMovie = {
        movieId: mockMovieId,
        title: "Fight Club",
        description: "A ticking-time-bomb insomniac...",
        languages: ["English", "French"],
        imdbRating: BigInt(84),
        localRating: "7.5",
        numRatings: "100",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };

      // Mock Prisma to return deleted movie
      jest.spyOn(prisma.movie, "delete").mockResolvedValueOnce(mockMovie as any);

      await deleteMovie(mockRequest as Request, mockResponse as Response);

      expect(prisma.movie.delete).toHaveBeenCalledWith({
        where: {movieId: mockMovieId},
      });
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie deleted successfully",
      });
      expect(responseObject.status).not.toHaveBeenCalled(); // No error status
    });

    it("should return 500 on database error", async () => {
      mockRequest.params = {movieId: "some-uuid"};

      const dbError = new Error("Database connection failed");
      jest.spyOn(prisma.movie, "delete").mockRejectedValueOnce(dbError);

      // Spy on console.error to prevent test output pollution
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await deleteMovie(mockRequest as Request, mockResponse as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith("deleteMovie error:", dbError);
      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Failed to delete movie",
        error: "Database connection failed",
      });

      consoleErrorSpy.mockRestore();
    });

    it("should handle unknown errors", async () => {
      mockRequest.params = {movieId: "some-uuid"};

      // Throw a non-Error object
      jest.spyOn(prisma.movie, "delete").mockRejectedValueOnce("Unknown error");

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await deleteMovie(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Failed to delete movie",
        error: "Unknown error",
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getMovieById", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
      // Reset mocks before each test
      mockRequest = {
        params: {},
      };

      responseObject = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      };

      mockResponse = responseObject;

      // Mock Prisma
      jest.clearAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return 400 if movieId is not provided", async () => {
      mockRequest.params = {}; // No movieId

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie ID is required",
      });
    });

    it("should return 404 if movie is not found", async () => {
      mockRequest.params = { movieId: "non-existent-uuid" };

      // Mock Prisma to return null
      jest.spyOn(prisma.movie, "findUnique").mockResolvedValueOnce(null);

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { movieId: "non-existent-uuid" },
      });
      expect(responseObject.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie not found.",
      });
    });

    it("should retrieve movie successfully", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };

      const mockMovie = {
        movieId: mockMovieId,
        title: "Fight Club",
      };

      jest.spyOn(prisma.movie, "findUnique").mockResolvedValueOnce(mockMovie as any);

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(responseObject.json).toHaveBeenCalled();
      expect(responseObject.status).not.toHaveBeenCalled(); // Success = no error status
    });

    it("should return 500 on database error", async () => {
      mockRequest.params = { movieId: "some-uuid" };

      const dbError = new Error("Database connection failed");
      jest.spyOn(prisma.movie, "findUnique").mockRejectedValueOnce(dbError);

      // Spy on console.error to prevent test output pollution
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith("getMovieById error:", dbError);
      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "failed to retrieve movie",
        error: "Database connection failed",
      });

      consoleErrorSpy.mockRestore();
    });

    it("should handle unknown errors", async () => {
      mockRequest.params = { movieId: "some-uuid" };

      // Throw a non-Error object
      jest.spyOn(prisma.movie, "findUnique").mockRejectedValueOnce("Unknown error");

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "failed to retrieve movie",
        error: "unknown",
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
