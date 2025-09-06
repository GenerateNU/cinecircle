import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { apiReference } from '@scalar/express-api-reference';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Prisma client initialization
const prisma = new PrismaClient();

// Test database connection
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('Connected to Supabase PostgreSQL via Prisma');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

connectDatabase();

app.get('/', (_req, res) => {
  res.send('CineCircle backend is running!');
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong from backend!' });
});

// Database test endpoint
app.get('/api/db-test', async (_req, res) => {
  try {
    // Test Prisma connection with a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as postgres_version`;
    res.json({ 
      message: 'Prisma connection successful!', 
      data: Array.isArray(result) ? result[0] : result
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Serve swagger JSON
app.get('/swagger-output.json', (_req, res) => {
  const swaggerPath = path.join(process.cwd(), 'src/swagger-output.json');
  if (fs.existsSync(swaggerPath)) {
    res.sendFile(swaggerPath);
  } else {
    res.status(404).json({ message: 'Swagger documentation not found. Run npm run docs first.' });
  }
});

// API Documentation
app.use(
  '/docs',
  apiReference({
    url: '/swagger-output.json',
    theme: 'laserwave',
  }),
);

export default app;
