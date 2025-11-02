import { mapTmdbToMovie, fetchTmdbMovie, deleteMovie, getMovieById, getMovie, updateMovie, mapMovieToPrismaUpdate } from "../../controllers/tmdb.js";
import type { Movie } from "../../types/models";
import { Request, Response } from "express";
import { prisma } from "../../services/db.js";
import { Prisma } from "@prisma/client";
jest.mock("crypto", () => {
  const actual = jest.requireActual("crypto");
  return {
    ...actual,
    randomUUID: jest.fn(
      () => "550e8400-e29b-41d4-a716-446655440000"
    ),
  };
});


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
      expect(responseObject.status).not.toHaveBeenCalled(); 
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

  describe("getMovie", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = { params: {} };
    responseObject = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockResponse = responseObject;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should fetch movie from TMDB and save to database successfully", async () => {
    mockRequest.params = { movieId: "550" };

    const mockTmdbResponse = {
      id: 550,
      title: "Fight Club",
      overview: "A ticking-time-bomb insomniac...",
      vote_average: 8.4,
      spoken_languages: [{ english_name: "English" }],
    };

    const mockSavedMovie = {
      movieId: "550e8400-e29b-41d4-a716-446655440000",
      title: "Fight Club",
      description: "A ticking-time-bomb insomniac...",
      languages: ["English"],
      imdbRating: BigInt(84),
      localRating: "0",
      numRatings: "0",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    };

    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockTmdbResponse,
    });

    jest.spyOn(prisma.movie, "upsert").mockResolvedValueOnce(mockSavedMovie as any);

    await getMovie(mockRequest as Request, mockResponse as Response);

    expect(global.fetch).toHaveBeenCalled();

    expect(prisma.movie.upsert).toHaveBeenCalledWith({
      where: { movieId: "550e8400-e29b-41d4-a716-446655440000" },
      create: expect.objectContaining({
        movieId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Fight Club",
        description: "A ticking-time-bomb insomniac...",
        languages: ["English"],
        localRating: "0",
        numRatings: "0",
      }),
      update: expect.objectContaining({
        movieId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Fight Club",
        description: "A ticking-time-bomb insomniac...",
        languages: ["English"],
        localRating: "0",
        numRatings: "0",
      }),
    });

    expect(responseObject.json).toHaveBeenCalledWith({
      message: "Movie fetched from TMDB and saved to DB",
      data: expect.objectContaining({
        movieId: mockSavedMovie.movieId,
        title: "Fight Club",
        imdbRating: 84,
      }),
    });
    expect(responseObject.status).not.toHaveBeenCalled();
  });

  it("should update existing movie if already in database", async () => {
    mockRequest.params = { movieId: "550" };

    const mockTmdbResponse = {
      id: 550,
      title: "Fight Club",
      overview: "Updated description",
      vote_average: 8.5,
      spoken_languages: [{ english_name: "English" }],
    };

    const updatedMovie = {
      movieId: "existing-uuid",
      title: "Fight Club",
      description: "Updated description",
      languages: ["English"],
      imdbRating: BigInt(85),
      localRating: "0",
      numRatings: "0",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    };

    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockTmdbResponse,
    });

    jest.spyOn(prisma.movie, "upsert").mockResolvedValueOnce(updatedMovie as any);

    await getMovie(mockRequest as Request, mockResponse as Response);

    expect(prisma.movie.upsert).toHaveBeenCalledWith({
      where: { movieId: "550e8400-e29b-41d4-a716-446655440000" },
      create: expect.objectContaining({
        movieId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Fight Club",
        description: "Updated description",
      }),
      update: expect.objectContaining({
        movieId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Fight Club",
        description: "Updated description",
      }),
    });

    expect(responseObject.json).toHaveBeenCalledWith({
      message: "Movie fetched from TMDB and saved to DB",
      data: expect.objectContaining({
        description: "Updated description",
        imdbRating: 85,
      }),
    });
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


    it("should return movie data successfully with converted BigInt", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };


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


      // Mock Prisma to return movie
      jest.spyOn(prisma.movie, "findUnique").mockResolvedValueOnce(mockMovie as any);


      await getMovieById(mockRequest as Request, mockResponse as Response);


      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { movieId: mockMovieId },
      });
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie found successfully",
        data: {
          ...mockMovie,
          imdbRating: 84, 
        },
      });
      expect(responseObject.status).not.toHaveBeenCalled(); 
    });


    it("should handle null imdbRating", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };


      const mockMovie = {
        movieId: mockMovieId,
        title: "Test Movie",
        description: "Test description",
        languages: ["English"],
        imdbRating: null, // No rating
        localRating: "0",
        numRatings: "0",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      };


      jest.spyOn(prisma.movie, "findUnique").mockResolvedValueOnce(mockMovie as any);


      await getMovieById(mockRequest as Request, mockResponse as Response);


      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie found successfully",
        data: {
          ...mockMovie,
          imdbRating: null, 
        },
      });
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

  describe("updateMovie", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
      // Reset mocks before each test
      mockRequest = {
        params: {},
        body: {},
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

    it("should update movie successfully with all fields", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };
      mockRequest.body = {
        title: "Updated Fight Club",
        description: "Updated description",
        languages: ["English", "Spanish"],
        imdbRating: BigInt(90),
        localRating: "8.5",
        numRatings: "200",
      };

      const mockUpdatedMovie = {
        movieId: mockMovieId,
        title: "Updated Fight Club",
        description: "Updated description",
        languages: ["English", "Spanish"],
        imdbRating: BigInt(90),
        localRating: "8.5",
        numRatings: "200",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      jest.spyOn(prisma.movie, "update").mockResolvedValueOnce(mockUpdatedMovie as any);

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(prisma.movie.update).toHaveBeenCalledWith({
        where: { movieId: mockMovieId },
        data: {
          title: "Updated Fight Club",
          description: "Updated description",
          languages: ["English", "Spanish"],
          imdbRating: BigInt(90),
          localRating: "8.5",
          numRatings: "200",
        },
      });

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie updated successfully",
        data: {
          ...mockUpdatedMovie,
          imdbRating: 90,
        },
      });
      expect(responseObject.status).not.toHaveBeenCalled(); 
    });

    it("should update movie with partial fields (title only)", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };
      mockRequest.body = {
        title: "New Title Only",
      };

      const mockUpdatedMovie = {
        movieId: mockMovieId,
        title: "New Title Only",
        description: "Original description",
        languages: ["English"],
        imdbRating: BigInt(84),
        localRating: "7.5",
        numRatings: "100",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      jest.spyOn(prisma.movie, "update").mockResolvedValueOnce(mockUpdatedMovie as any);

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(prisma.movie.update).toHaveBeenCalledWith({
        where: { movieId: mockMovieId },
        data: {
          title: "New Title Only",
        },
      });

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie updated successfully",
        data: {
          ...mockUpdatedMovie,
          imdbRating: 84,
        },
      });
    });

    it("should convert localRating and numRatings to numbers", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };
      mockRequest.body = {
        localRating: "8.5", 
        numRatings: "250", 
      };

      const mockUpdatedMovie = {
        movieId: mockMovieId,
        title: "Test Movie",
        description: "Test description",
        languages: ["English"],
        imdbRating: BigInt(84),
        localRating: "8.5",
        numRatings: "250",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      jest.spyOn(prisma.movie, "update").mockResolvedValueOnce(mockUpdatedMovie as any);

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(prisma.movie.update).toHaveBeenCalledWith({
        where: { movieId: mockMovieId },
        data: {
          localRating: "8.5", 
          numRatings: "250", 
        },
      });

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie updated successfully",
        data: {
          ...mockUpdatedMovie,
          imdbRating: 84,
        },
      });
    });

    it("should handle null imdbRating in response", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };
      mockRequest.body = {
        title: "Movie with No Rating",
      };

      const mockUpdatedMovie = {
        movieId: mockMovieId,
        title: "Movie with No Rating",
        description: "Test description",
        languages: ["English"],
        imdbRating: null, // No rating
        localRating: "0",
        numRatings: "0",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      jest.spyOn(prisma.movie, "update").mockResolvedValueOnce(mockUpdatedMovie as any);

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie updated successfully",
        data: {
          ...mockUpdatedMovie,
          imdbRating: null, // Remains null
        },
      });
    });

    it("should handle unknown errors", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };
      mockRequest.body = {
        title: "Updated Title",
      };

      // Throw a non-Error object
      jest.spyOn(prisma.movie, "update").mockRejectedValueOnce("Unknown error");

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Failed to update movie",
        error: "Unknown error",
      });

      consoleErrorSpy.mockRestore();
    });
  });
});

describe("movie mapper", () => {
  test("update: explicit null clears fields, undefined is ignored", () => {
    const patch: Partial<Movie> = {
      title: null,                   // should clear to null
      languages: null,               // JSON null
      imdbRating: null,              // BigInt null
      localRating: undefined,        // ignored
      numRatings: "10",
    };
    const out = mapMovieToPrismaUpdate(patch);
    expect(out.title).toBeNull();
    expect(out.languages).toBe(Prisma.DbNull);
    expect(out.imdbRating).toBeNull();
    expect(out.localRating).toBeUndefined();
    expect(out.numRatings).toBe("10");
  });

  test("update: languages coerces any arrayish to string[]", () => {
    const patch: Partial<Movie> = { languages: [1, "en", null] as any };
    const out = mapMovieToPrismaUpdate(patch);
    expect(out.languages).toEqual(["1", "en"]);
  });

  test("update: imdbRating accepts string numbers", () => {
    const out = mapMovieToPrismaUpdate({ imdbRating: 7.8 });
    expect(out.imdbRating).toBe(BigInt(8));
  });
});