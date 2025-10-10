import request from "supertest";
import express, { Request, Response } from "express";
import { createApp } from "../../app";
import { HTTP_STATUS } from "../helpers/constants.js";
import { deleteMovie, getMovie, getMovieById } from "../../controllers/tmdb.js";
import { prisma } from "../../services/db.js";
import { Prisma } from "@prisma/client";

/**
 * Movie API Tests
 *
 * Tests the GET /movies/:movieId endpoint which fetches movies from TMDB
 * and saves them to the local database.
 *
 * Route: GET /movies/:movieId (movieId is the TMDB ID)
 */
describe("Movie API Tests", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = createApp();
  });

  afterAll(async () => {
    // Give time for any pending connections to close
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  describe("GET /movies/:movieId", () => {
    it("should fetch a movie from TMDB and save to database", async () => {
      // Should be The Shawshank Redemption
      const tmdbId = "278";

      const response = await request(app)
        .get(`/movies/${tmdbId}`)
        .expect(HTTP_STATUS.OK)
        .expect("Content-Type", /json/);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("data");
      expect(response.body.message).toBe(
        "Movie fetched from TMDB and saved to DB",
      );

      const movie = response.body.data;
      expect(movie).toHaveProperty("movieId");
      expect(movie).toHaveProperty("title");
      expect(typeof movie.title).toBe("string");
    });

    it("should return complete movie details with correct schema", async () => {
      const tmdbId = "550"; // Fight Club

      const response = await request(app)
        .get(`/movies/${tmdbId}`)
        .expect(HTTP_STATUS.OK);

      const movie = response.body.data;

      // Verify all expected fields from the database schema
      expect(movie).toHaveProperty("movieId");
      expect(movie).toHaveProperty("title");
      expect(movie).toHaveProperty("description");
      expect(movie).toHaveProperty("localRating");
      expect(movie).toHaveProperty("imdbRating");
      expect(movie).toHaveProperty("languages");
      expect(movie).toHaveProperty("numRatings");

      // Verify data types
      expect(typeof movie.movieId).toBe("string");
      expect(typeof movie.title).toBe("string");
      expect(Array.isArray(movie.languages)).toBe(true);

      // IMDB rating should be a number if present
      if (movie.imdbRating !== null) {
        expect(typeof movie.imdbRating).toBe("number");
      }
    });

    it("should return 500 for invalid TMDB ID", async () => {
      const response = await request(app)
        .get("/movies/invalid-tmdb-id")
        .expect(HTTP_STATUS.INTERNAL_SERVER_ERROR);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Failed to fetch/save movie");
    });

    it("should handle TMDB API errors gracefully", async () => {
      // Using a non-existent TMDB ID
      const response = await request(app)
        .get("/movies/999999999")
        .expect(HTTP_STATUS.INTERNAL_SERVER_ERROR);

      expect(response.body).toHaveProperty("error");
    });

    it("should return JSON content type", async () => {
      const tmdbId = "278";

      await request(app)
        .get(`/movies/${tmdbId}`)
        .expect(HTTP_STATUS.OK)
        .expect("Content-Type", /json/);
    });

    it("should update existing movie if already in database", async () => {
      const tmdbId = "278";

      // First request - creates the movie
      const firstResponse = await request(app)
        .get(`/movies/${tmdbId}`)
        .expect(HTTP_STATUS.OK);

      // Second request - should update the existing movie
      const secondResponse = await request(app)
        .get(`/movies/${tmdbId}`)
        .expect(HTTP_STATUS.OK);

      // Both should return the same title and description
      expect(firstResponse.body.data.title).toBe(
        secondResponse.body.data.title,
      );
      expect(firstResponse.body.data.description).toBe(
        secondResponse.body.data.description,
      );
    });
  });

  /**
   * Get Movie by ID API Tests
   *
   * Tests the controller in isolation with mocked Prisma client.
   * These do not depend on Express routing or Supertest.
   */
  describe("getMovieById Controller API Tests", () => {
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

    it("should return 200 and the movie payload when found", async () => {
      mockRequest.params = { movieId: "existing-uuid" };

      // Simulate a DB row where imdbRating is stored as BigInt
      const dbMovie = {
        movieId: "existing-uuid",
        title: "The Shawshank Redemption",
        description: "A hopeful drama.",
        languages: ["English"],
        imdbRating: BigInt(87), // controller converts this to Number
        localRating: 4.8,
        numRatings: 2500,
        // ...any other fields your schema returns are fine to omit
      };

      const findSpy = jest
        .spyOn(prisma.movie, "findUnique")
        .mockResolvedValueOnce(dbMovie as any);

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(findSpy).toHaveBeenCalledWith({
        where: { movieId: "existing-uuid" },
      });

      // Success path does not explicitly set a status, so default should be 200
      expect(responseObject.status).not.toHaveBeenCalled();

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie found successfully",
        data: {
          ...dbMovie,
          imdbRating: 87, // BigInt -> Number conversion verified
        },
      });
    });

    it("should return 400 if movieId is not provided", async () => {
      mockRequest.params = {}; // No movieId

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie ID is required",
      });
    });

    it("should return 404 if movie is not found", async () => {
      mockRequest.params = { movieId: "non-existent-uuid" };

      // Mock Prisma to return null
      jest.spyOn(prisma.movie, "findUnique").mockResolvedValueOnce(null as any);

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { movieId: "non-existent-uuid" },
      });
      expect(responseObject.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie not found.",
      });
    });


    it("should return 500 on database error", async () => {
      mockRequest.params = { movieId: "some-uuid" };

      const dbError = new Error("Database connection failed");
      jest.spyOn(prisma.movie, "findUnique").mockRejectedValueOnce(dbError);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await getMovieById(mockRequest as Request, mockResponse as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith("getMovieById error:", dbError);
      expect(responseObject.status).toHaveBeenCalledWith(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "failed to retrieve movie",
        error: "Database connection failed",
      });

      consoleErrorSpy.mockRestore();
    });
  });

  /**
   * DELETE Movie API Tests
   *
   * Tests the deleteMovie controller in isolation with mocks.
   */
  describe("deleteMovie Controller API Tests", () => {
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
    
    it("should return 200 and success message when deletion succeeds", async () => {
      mockRequest.params = { movieId: "existing-uuid" };

      // Mock Prisma to resolve successfully (deleted record is not used by controller)
      const deleteSpy = jest
        .spyOn(prisma.movie, "delete")
        .mockResolvedValueOnce({} as any);

      await deleteMovie(mockRequest as Request, mockResponse as Response);

      expect(deleteSpy).toHaveBeenCalledWith({
        where: { movieId: "existing-uuid" },
      });

      // Controller doesn't set status explicitly on success, so it should be the default 200
      expect(responseObject.status).not.toHaveBeenCalled();

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie deleted successfully",
      });
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
  });
});
