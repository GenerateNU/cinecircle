import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import { PrismaClient } from '@prisma/client';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Root endpoint (JSON response for consistency)
  app.get('/', (_req, res) => {
    res.json({
      status: 'success',
      message: 'CineCircle backend is running!',
    });
  });

  app.use('/docs', async (req, res) => {
    const apiReference = PrismaClient;
    return apiReference({
      url: '/swagger-output.json',
      theme: 'laserwave',
    })(req, res);
  });

  // Register all API routes
  app.use(routes);

  // 404 Handler (for undefined routes)
  app.use((_req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Not Found',
    });
  });

  return app;
}