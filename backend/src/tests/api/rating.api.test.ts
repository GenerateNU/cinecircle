import request from 'supertest';
import express, { NextFunction } from 'express';
import { createApp } from '../../app';
import { prisma } from '../../services/db';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../helpers/constants';
import { AuthenticatedRequest } from '../../middleware/auth';
import { v4 as uuid } from 'uuid';

jest.mock('../../middleware/auth', () => ({
  authenticateUser: (
    req: AuthenticatedRequest,
    res: any,
    next: NextFunction
  ) => {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    req.user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'testuser@example.com',
      role: 'USER',
    };
    next();
  },
}));

describe('Ratings API Tests', () => {
  let app: express.Express;
  const TEST_USER_ID = '123e4567-e89b-12d3-a456-426614174000';
  const TEST_MOVIE_ID = 'movie-1';

  const generateToken = () => {
    return jwt.sign(
      { id: TEST_USER_ID, email: 'testuser@example.com', role: 'USER' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  };

  const authHeader = () => ({
    Authorization: `Bearer ${generateToken()}`,
  });

  beforeAll(async () => {
    app = createApp();
    await prisma.rating.deleteMany({ where: { userId: TEST_USER_ID } });
  });

  afterAll(async () => {
    await prisma.rating.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.$disconnect();
  });

  describe('POST /api/ratings', () => {
    it('should create a rating for authenticated user', async () => {
      const payload = {
        movieId: TEST_MOVIE_ID,
        stars: 5,
        comment: 'Great movie!',
        tags: ['action', 'thriller'],
        votes: 0,
      };

      const res = await request(app)
        .post('/api/ratings')
        .send(payload)
        .set(authHeader())
        .expect(HTTP_STATUS.CREATED)
        .expect('Content-Type', /json/);

      expect(res.body).toHaveProperty('message', 'Rating created successfully');
      expect(res.body.rating).toMatchObject({
        userId: TEST_USER_ID,
        movieId: TEST_MOVIE_ID,
        stars: 5,
        comment: 'Great movie!',
        tags: ['action', 'thriller'],
        votes: 0,
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      const payload = {
        movieId: TEST_MOVIE_ID,
        stars: 4,
        comment: 'Nice!',
        votes: 0,
      };

      const res = await request(app)
        .post('/api/ratings')
        .send(payload)
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(res.body).toHaveProperty('message', 'User not authenticated');
    });

    it('should return 400 for invalid stars value', async () => {
      const payload = {
        movieId: TEST_MOVIE_ID,
        stars: 10,
        comment: 'Invalid stars',
        votes: 0,
      };

      const res = await request(app)
        .post('/api/ratings')
        .send(payload)
        .set(authHeader())
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(res.body).toHaveProperty(
        'message',
        'Stars must be between 0 and 5'
      );
    });
  });

  describe('GET /api/ratings', () => {
    beforeAll(async () => {
      await prisma.rating.createMany({
        data: [
          {
            id: 'rating-1',
            userId: TEST_USER_ID,
            movieId: 'movie-2',
            stars: 4,
            date: new Date(),
            votes: 0,
          },
          {
            id: 'rating-2',
            userId: TEST_USER_ID,
            movieId: 'movie-3',
            stars: 3,
            date: new Date(),
            votes: 0,
          },
        ],
      });
    });

    afterAll(async () => {
      await prisma.rating.deleteMany({ where: { userId: TEST_USER_ID } });
    });

    it('should return ratings for authenticated user', async () => {
      const res = await request(app)
        .get('/api/ratings')
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty('message');
      expect(res.body.ratings).toBeInstanceOf(Array);
      expect(res.body.ratings.length).toBeGreaterThan(0);
      res.body.ratings.forEach((rating: any) => {
        expect(rating.userId).toBe(TEST_USER_ID);
      });
    });
  });

  describe('DELETE /api/ratings/:id', () => {
    let ratingId: string;

    beforeAll(async () => {
      const rating = await prisma.rating.create({
        data: {
          id: uuid(),
          userId: TEST_USER_ID,
          movieId: 'movie-4',
          stars: 2,
          comment: 'Not my favorite',
          date: new Date(),
          votes: 0,
        },
      });
      ratingId = rating.id;
    });

    it('should delete a rating for authenticated user', async () => {
      const res = await request(app)
        .delete(`/api/ratings/${ratingId}`)
        .set(authHeader())
        .expect(HTTP_STATUS.OK);

      expect(res.body).toHaveProperty('message', 'Rating deleted');

      const deleted = await prisma.rating.findUnique({
        where: { id: ratingId },
      });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent rating', async () => {
      const res = await request(app)
        .delete(`/api/ratings/non-existent-id`)
        .set(authHeader())
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(res.body).toHaveProperty('message', 'Rating not found');
    });
  });
});
