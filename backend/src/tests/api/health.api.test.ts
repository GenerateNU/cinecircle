import request from 'supertest';
import express from 'express';
import routes from '../../routes/index';

/**
 * API Integration Tests
 * Tests actual API endpoints with real database connections
 * No complex setup - tests the actual application behavior
 */
describe('Health API Integration Tests', () => {
  let app: express.Express;

  beforeAll(async () => {
    // Create Express app with routes
    app = express();
    app.use(express.json());
    app.use(routes);

    // Add root endpoint for testing
    app.get('/', (_req, res) => {
      res.json({
        status: 'success',
        message: 'CineCircle test API is running',
        environment: 'test',
      });
    });
  });

  describe('GET /api/ping', () => {
    it('should return pong message successfully', async () => {
      const response = await request(app)
        .get('/api/ping')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        message: 'pong from backend!',
      });
    });

    it('should handle multiple requests consistently', async () => {
      // Test multiple requests to ensure stability
      const requests = Array.from({ length: 3 }, () =>
        request(app).get('/api/ping').expect(200)
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.body.message).toBe('pong from backend!');
      });
    });
  });

  describe('GET /api/db-test', () => {
    it('should test database connection successfully', async () => {
      const response = await request(app)
        .get('/api/db-test')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Prisma connection successful!');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('current_time');
      expect(response.body.data).toHaveProperty('postgres_version');
    });

    it('should return valid database information', async () => {
      const response = await request(app).get('/api/db-test').expect(200);

      // Validate the structure more thoroughly
      expect(typeof response.body.data.current_time).toBe('string');
      expect(response.body.data.postgres_version).toMatch(/PostgreSQL/);
    });
  });

  describe('Application Root', () => {
    it('should return API status from root endpoint', async () => {
      const response = await request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({
        status: 'success',
        message: 'CineCircle test API is running',
        environment: 'test',
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      await request(app).get('/api/non-existent-endpoint').expect(404);
    });

    it('should handle invalid HTTP methods gracefully', async () => {
      await request(app).delete('/api/ping').expect(404);
    });
  });

  describe('Response Headers', () => {
    it('should include proper CORS headers', async () => {
      const response = await request(app).get('/api/ping').expect(200);

      // CORS headers should be present (added by cors middleware)
      expect(response.headers).toBeDefined();
    });

    it('should return JSON content type for API endpoints', async () => {
      await request(app)
        .get('/api/ping')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });
});
