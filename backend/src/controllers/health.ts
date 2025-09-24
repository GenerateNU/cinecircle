import type { Request, Response } from 'express';
import { prisma } from '../services/db.js';
import path from 'path';
import fs from 'fs';

export const ping = (_req: Request, res: Response) => {
  res.json({ message: 'pong from backend!' });
};

export const dbTest = async (_req: Request, res: Response) => {
  try {
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
};

export const serveSwagger = (_req: Request, res: Response) => {
  const swaggerPath = path.join(process.cwd(), 'src/docs/swagger-output.json');
  if (fs.existsSync(swaggerPath)) {
    res.sendFile(swaggerPath);
  } else {
    res.status(404).json({ message: 'Swagger documentation not found. Run npm run docs first.' });
  }
};
