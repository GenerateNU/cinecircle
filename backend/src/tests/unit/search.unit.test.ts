import { searchMovies, searchUsers, searchReviews, searchPosts } from "../../controllers/search";
import { Request, Response } from "express";
import { prisma } from "../../services/db";

describe("Search Controller Unit Tests", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: any;

    beforeEach(() => {
        mockRequest = {
            query: {},
        };

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

    describe("searchMovies", () => {
        it("should return 400 if query parameter is missing", async () => {
            mockRequest.query = {};

            await searchMovies(mockRequest as Request, mockResponse as Response);

            expect(responseObject.status).toHaveBeenCalledWith(400);
            expect(responseObject.json).toHaveBeenCalledWith({
                message: "Query parameter 'q' is required",
            });
        });

        it("should return 400 if maxResults exceeds 100", async () => {
            mockRequest.query = { q: "test", maxResults: "150" };

            await searchMovies(mockRequest as Request, mockResponse as Response);

            expect(responseObject.status).toHaveBeenCalledWith(400);
            expect(responseObject.json).toHaveBeenCalledWith({
                message: "maxResults cannot exceed 100",
            });
        });

        it("should search movies successfully", async () => {
            mockRequest.query = { q: "fight" };

            const mockMovies = [
                {
                    movieId: "uuid-1",
                    title: "Fight Club",
                    description: "A movie about fighting",
                    imdbRating: BigInt(84),
                    localRating: "0",
                    languages: ["English"],
                    numRatings: "100",
                },
                {
                    movieId: "uuid-2",
                    title: "Fighting",
                    description: "Another movie",
                    imdbRating: BigInt(75),
                    localRating: "0",
                    languages: ["English"],
                    numRatings: "50",
                },
                {
                    movieId: "uuid-3",
                    title: "The Fighter",
                    description: "Boxing movie",
                    imdbRating: BigInt(80),
                    localRating: "0",
                    languages: ["English"],
                    numRatings: "75",
                },
            ];

            // Mock 3 movies so TMDB fallback won't trigger
            jest.spyOn(prisma.movie, "findMany").mockResolvedValueOnce(mockMovies as any);

            await searchMovies(mockRequest as Request, mockResponse as Response);

            expect(prisma.movie.findMany).toHaveBeenCalled();
            expect(responseObject.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "movies",
                    query: "fight",
                    count: 3,  // Changed to 3
                    sources: {
                        local: 3,  // All 3 from local
                        tmdb: 0,   // None from TMDB
                    },
                })
            );
        });

        it("should convert BigInt to number in results", async () => {
            mockRequest.query = { q: "test" };

            const mockMovies = [
                {
                    movieId: "uuid",
                    title: "Test Movie",
                    description: "Test",
                    imdbRating: BigInt(75),
                    localRating: "0",
                    languages: [],
                    numRatings: "0",
                },
            ];

            jest.spyOn(prisma.movie, "findMany").mockResolvedValueOnce(mockMovies as any);

            await searchMovies(mockRequest as Request, mockResponse as Response);

            const callArgs = responseObject.json.mock.calls[0][0];
            expect(callArgs.results[0].imdbRating).toBe(75);
            expect(typeof callArgs.results[0].imdbRating).toBe("number");
        });

        it("should handle database errors", async () => {
            mockRequest.query = { q: "test" };

            const dbError = new Error("Database connection failed");
            jest.spyOn(prisma.movie, "findMany").mockRejectedValueOnce(dbError);

            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

            await searchMovies(mockRequest as Request, mockResponse as Response);

            expect(responseObject.status).toHaveBeenCalledWith(500);
            expect(responseObject.json).toHaveBeenCalledWith({
                message: "Failed to search movies",
                error: "Database connection failed",
            });

            consoleErrorSpy.mockRestore();
        });
    });

    describe("searchUsers", () => {
        it("should return 400 if query parameter is missing", async () => {
            mockRequest.query = {};

            await searchUsers(mockRequest as Request, mockResponse as Response);

            expect(responseObject.status).toHaveBeenCalledWith(400);
            expect(responseObject.json).toHaveBeenCalledWith({
                message: "Query parameter 'q' is required",
            });
        });

        it("should return 400 if limit exceeds 50", async () => {
            mockRequest.query = { q: "test", limit: "100" };

            await searchUsers(mockRequest as Request, mockResponse as Response);

            expect(responseObject.status).toHaveBeenCalledWith(400);
            expect(responseObject.json).toHaveBeenCalledWith({
                message: "limit cannot exceed 50",
            });
        });

        it("should search users successfully", async () => {
            mockRequest.query = { q: "john" };

            const mockUsers = [
                {
                    userId: "user-uuid",
                    username: "john_doe",
                    onboardingCompleted: null,
                    primaryLanguage: null,
                    secondaryLanguage: [],
                    profilePicture: null,
                    country: null,
                    city: null,
                    displayName: null,
                    favoriteGenres: [],
                    favoriteMovies: [],
                    bio: null,
                    moviesToWatch: [],
                    moviesCompleted: [],
                    eventsSaved: [],
                    eventsAttended: [],
                    privateAccount: null,
                    spoiler: null,
                    createdAt: new Date(),
                    updatedAt: null,
                },
            ];

            jest.spyOn(prisma.userProfile, "findMany").mockResolvedValueOnce(mockUsers as any);

            await searchUsers(mockRequest as Request, mockResponse as Response);

            expect(prisma.userProfile.findMany).toHaveBeenCalled();
            expect(responseObject.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "users",
                    query: "john",
                    count: 1,
                    results: expect.arrayContaining([
                        expect.objectContaining({
                            userId: "user-uuid",
                            username: "john_doe",
                            favoriteMovies: [],
                        })
                    ]),
                })
            );
        });
    });

    describe("searchReviews", () => {
        it("should return 400 if query parameter is missing", async () => {
            mockRequest.query = {};

            await searchReviews(mockRequest as Request, mockResponse as Response);

            expect(responseObject.status).toHaveBeenCalledWith(400);
        });

        it("should search reviews successfully", async () => {
            mockRequest.query = { q: "excellent" };

            const mockReviews = [
                {
                    id: "review-uuid",
                    userId: "user-uuid",
                    movieId: "movie-uuid",
                    stars: 5,
                    comment: "Excellent movie!",
                    tags: ["action", "thriller"],
                    date: new Date(),
                    votes: 10,
                    user: {
                        userId: "user-uuid",
                        username: "john_doe",
                    },
                },
            ];

            jest.spyOn(prisma.rating, "findMany").mockResolvedValueOnce(mockReviews as any);

            await searchReviews(mockRequest as Request, mockResponse as Response);

            expect(responseObject.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "reviews",
                    count: 1,
                    results: mockReviews,
                })
            );
        });

        it("should filter by minimum stars", async () => {
            mockRequest.query = { q: "good", minStars: "4" };

            jest.spyOn(prisma.rating, "findMany").mockResolvedValueOnce([]);

            await searchReviews(mockRequest as Request, mockResponse as Response);

            expect(prisma.rating.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        stars: { gte: 4 },
                    }),
                })
            );
        });
    });

    describe("searchPosts", () => {
        it("should return 400 if query parameter is missing", async () => {
            mockRequest.query = {};

            await searchPosts(mockRequest as Request, mockResponse as Response);

            expect(responseObject.status).toHaveBeenCalledWith(400);
        });

        it("should search posts successfully", async () => {
            mockRequest.query = { q: "cinema" };

            const mockPosts = [
                {
                    id: "post-uuid",
                    userId: "user-uuid",
                    content: "I love cinema!",
                    type: "SHORT",
                    votes: 5,
                    createdAt: new Date(),
                    user: {
                        userId: "user-uuid",
                        username: "john_doe",
                    },
                    _count: {
                        comments: 3,
                    },
                },
            ];

            jest.spyOn(prisma.post, "findMany").mockResolvedValueOnce(mockPosts as any);

            await searchPosts(mockRequest as Request, mockResponse as Response);

            expect(responseObject.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "posts",
                    count: 1,
                    results: mockPosts,
                })
            );
        });

        it("should filter by post type", async () => {
            mockRequest.query = { q: "discussion", type: "LONG" };

            jest.spyOn(prisma.post, "findMany").mockResolvedValueOnce([]);

            await searchPosts(mockRequest as Request, mockResponse as Response);

            expect(prisma.post.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        type: "LONG",
                    }),
                })
            );
        });
    });
});