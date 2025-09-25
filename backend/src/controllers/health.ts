import type { Request, Response } from 'express';
import { prisma } from '../services/db';
import path from 'path';
import fs from 'fs';

export const ping = (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ping endpoint called from IP: ${req.ip || 'unknown'}`);
  
  try {
    res.json({ 
      message: 'pong from backend!',
      timestamp,
      endpoint: '/api/ping',
      serverTime: new Date().toISOString()
    });
    console.log(`[${timestamp}] ping response sent successfully`);
  } catch (error) {
    console.error(`[${timestamp}] ping error:`, error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/ping'
    });
  }
};

export const dbTest = async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] dbTest endpoint called from IP: ${req.ip || 'unknown'}`);
  
  try {
    console.log(`[${timestamp}] Attempting database connection...`);
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as postgres_version`;
    
    const responseData = {
      message: 'Prisma connection successful!',
      data: Array.isArray(result) ? result[0] : result,
      timestamp,
      endpoint: '/api/db-test'
    };
    
    console.log(`[${timestamp}] Database test successful:`, responseData.data);
    res.json(responseData);
  } catch (error) {
    console.error(`[${timestamp}] Database test error:`, error);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/api/db-test'
    });
  }
};

export const serveSwagger = (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] serveSwagger endpoint called from IP: ${req.ip || 'unknown'}`);
  
  try {
    const swaggerPath = path.join(process.cwd(), 'src/docs/swagger-output.json');
    console.log(`[${timestamp}] Looking for swagger file at: ${swaggerPath}`);
    
    if (fs.existsSync(swaggerPath)) {
      console.log(`[${timestamp}] Swagger file found, serving...`);
      res.sendFile(swaggerPath);
    } else {
      console.log(`[${timestamp}] Swagger file not found`);
      res.status(404).json({ 
        message: 'Swagger documentation not found. Run npm run docs first.',
        timestamp,
        endpoint: '/swagger-output.json'
      });
    }
  } catch (error) {
    console.error(`[${timestamp}] serveSwagger error:`, error);
    res.status(500).json({
      message: 'Internal server error while serving swagger',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
      endpoint: '/swagger-output.json'
    });
  }
};
