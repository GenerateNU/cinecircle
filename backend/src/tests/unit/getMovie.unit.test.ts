import { getMovieById } from "../../controllers/tmdb.js";
import { Request, Response } from "express";
import { prisma } from "../../services/db.js";


/**
* Unit Tests for getMovieById Controller
*
* Tests the endpoint in isolation with mocked Prisma client.
* No real database calls.
*/
describe("getMovieById Controller Unit Tests", () => {
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


 it("should return movie data successfully with converted BigInt", async () => {
   const mockMovieId = "550e8400-e29b-41d4-a716-446655440000";
   mockRequest.params = { movieId: mockMovieId };


   const mockMovie = {
     movieId: mockMovieId,
     title: "Fight Club",
     description: "A ticking-time-bomb insomniac...",
     languages: ["English", "French"],
     imdbRating: BigInt(84), // Stored as BigInt
     localRating: 7.5,
     numRatings: 100,
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
       imdbRating: 84, // Converted to number
     },
   });
   expect(responseObject.status).not.toHaveBeenCalled(); // No error status
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
     localRating: 0,
     numRatings: 0,
     createdAt: new Date("2024-01-01"),
     updatedAt: new Date("2024-01-01"),
   };


   jest.spyOn(prisma.movie, "findUnique").mockResolvedValueOnce(mockMovie as any);


   await getMovieById(mockRequest as Request, mockResponse as Response);


   expect(responseObject.json).toHaveBeenCalledWith({
     message: "Movie found successfully",
     data: {
       ...mockMovie,
       imdbRating: null, // Remains null
     },
   });
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

