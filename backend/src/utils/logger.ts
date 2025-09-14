import type { Request, Response, NextFunction } from 'express';

export interface LoggedRequest extends Request {
  startTime?: number;
}

export const requestLogger = (req: LoggedRequest, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  console.log(`[${timestamp}] ${method} ${url}`);
  
  // Log request body for POST/PUT requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';
    console.log(`[${timestamp}] Request Body:`, JSON.stringify(sanitizedBody, null, 2));
  }
  
  // Log query parameters
  if (Object.keys(req.query).length > 0) {
    console.log(`[${timestamp}] Query Params:`, JSON.stringify(req.query, null, 2));
  }
  
  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] Response ${statusCode} - Duration: ${duration}ms`);
    
    // Log response body (truncated for large responses)
    const responseStr = JSON.stringify(body);
    if (responseStr.length > 1000) {
      console.log(`[${timestamp}] Response Body: ${responseStr.substring(0, 1000)}... [TRUNCATED]`);
    } else {
      console.log(`[${timestamp}] Response Body:`, responseStr);
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  console.error(`[${timestamp}] ERROR in ${method} ${url}:`);
  console.error(`[${timestamp}] Error Message:`, error.message);
  console.error(`[${timestamp}] Error Stack:`, error.stack);
  
  next(error);
};

export const logAuthAttempt = (req: Request, success: boolean, userId?: string, error?: string) => {
  const timestamp = new Date().toISOString();
  
  if (success) {
    console.log(`[${timestamp}] AUTH SUCCESS - User: ${userId}`);
  } else {
    console.log(`[${timestamp}] AUTH FAILED - Error: ${error || 'Unknown error'}`);
  }
};
