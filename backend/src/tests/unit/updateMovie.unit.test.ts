import { updateMovie } from "../../controllers/tmdb.js";
import { Request, Response } from "express";
import { prisma } from "../../services/db.js";
import { Prisma } from "@prisma/client";

/**
 * Unit Tests for updateMovie Controller
 *
 * Tests the endpoint in isolation with mocked Prisma client.
 * No real database calls.
 */
describe("updateMovie Controller Unit Tests", () => {
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

    it("should return 400 if movieId is not provided", async () => {
      mockRequest.params = {}; // No movieId
      mockRequest.body = { title: "Updated Title" };

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie ID is required",
      });
    });

    it("should return 400 if no fields to update are provided", async () => {
      mockRequest.params = { movieId: "550e8400-e29b-41d4-a716-446655440000" };
      mockRequest.body = {}; // No update fields

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(responseObject.status).toHaveBeenCalledWith(400);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "No fields to update",
      });
    });

    it("should update movie successfully with all fields", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };
      mockRequest.body = {
        title: "Updated Fight Club",
        description: "Updated description",
        languages: ["English", "Spanish"],
        imdbRating: BigInt(90),
        localRating: 8.5,
        numRatings: 200,
      };

      const mockUpdatedMovie = {
        movieId: mockMovieId,
        title: "Updated Fight Club",
        description: "Updated description",
        languages: ["English", "Spanish"],
        imdbRating: BigInt(90),
        localRating: 8.5,
        numRatings: 200,
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
          localRating: 8.5,
          numRatings: 200,
        },
      });

      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie updated successfully",
        data: {
          ...mockUpdatedMovie,
          imdbRating: 90, // Converted to number
        },
      });
      expect(responseObject.status).not.toHaveBeenCalled(); // No error status
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
        localRating: 7.5,
        numRatings: 100,
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
        localRating: "8.5", // String that should be converted
        numRatings: "250", // String that should be converted
      };

      const mockUpdatedMovie = {
        movieId: mockMovieId,
        title: "Test Movie",
        description: "Test description",
        languages: ["English"],
        imdbRating: BigInt(84),
        localRating: 8.5,
        numRatings: 250,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      jest.spyOn(prisma.movie, "update").mockResolvedValueOnce(mockUpdatedMovie as any);

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(prisma.movie.update).toHaveBeenCalledWith({
        where: { movieId: mockMovieId },
        data: {
          localRating: 8.5, // Converted to number
          numRatings: 250, // Converted to number
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
        localRating: 0,
        numRatings: 0,
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

    it("should return 404 if movie is not found (P2025 error)", async () => {
      const mockMovieId = "non-existent-uuid";
      mockRequest.params = { movieId: mockMovieId };
      mockRequest.body = {
        title: "Updated Title",
      };

      const prismaError = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        {
          code: "P2025",
          clientVersion: "4.0.0",
        }
      );

      jest.spyOn(prisma.movie, "update").mockRejectedValueOnce(prismaError);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith("updateMovie error:", prismaError);
      expect(responseObject.status).toHaveBeenCalledWith(404);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Movie not found",
      });

      consoleErrorSpy.mockRestore();
    });

    it("should return 500 on database error", async () => {
      const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
      mockRequest.params = { movieId: mockMovieId };
      mockRequest.body = {
        title: "Updated Title",
      };

      const dbError = new Error("Database connection failed");
      jest.spyOn(prisma.movie, "update").mockRejectedValueOnce(dbError);

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await updateMovie(mockRequest as Request, mockResponse as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith("updateMovie error:", dbError);
      expect(responseObject.status).toHaveBeenCalledWith(500);
      expect(responseObject.json).toHaveBeenCalledWith({
        message: "Failed to update movie",
        error: "Database connection failed",
      });

      consoleErrorSpy.mockRestore();
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