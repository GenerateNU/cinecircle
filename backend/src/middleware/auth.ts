import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { SUPABASE_JWT_SECRET, SUPABASE_URL } from "../config/env.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
}

// Create JWKS client for Supabase
const client = jwksClient({
  jwksUri: `${SUPABASE_URL}/auth/v1/jwks`,
  cache: true,
  cacheMaxAge: 600000, // 10 minutes
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress || "Unknown";
  const userAgent = req.get("User-Agent") || "Unknown";

  console.log(`[${timestamp}] Authentication attempt from IP: ${ip}`);
  console.log(`[${timestamp}] User-Agent: ${userAgent}`);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(
      `[${timestamp}] Authentication failed: Missing or invalid authorization header`,
    );
    return res.status(401).json({
      message: "Unauthorized: Missing or invalid token",
      timestamp,
      ip,
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log(
      `[${timestamp}] Authentication failed: Token not found in header`,
    );
    return res.status(401).json({
      message: "Unauthorized: Token not found in header",
      timestamp,
      ip,
    });
  }

  try {
    console.log(`[${timestamp}] Attempting JWT verification...`);

    // First try JWKS verification (for production Supabase tokens)
    jwt.verify(
      token,
      getKey,
      { algorithms: ["RS256"] },
      (err, decoded: any) => {
        if (err) {
          console.log(
            `[${timestamp}] JWKS verification failed, trying fallback: ${err.message}`,
          );

          // Fallback to simple JWT verification with secret (for development)
          try {
            const fallbackDecoded = jwt.verify(
              token,
              SUPABASE_JWT_SECRET,
            ) as any;
            console.log(
              `[${timestamp}] Fallback JWT verification successful for user: ${fallbackDecoded.sub}`,
            );

            req.user = {
              id: fallbackDecoded.sub,
              email: fallbackDecoded.email,
              role: fallbackDecoded.role,
            };
            next();
          } catch (fallbackError) {
            console.error(
              `[${timestamp}] Fallback JWT verification failed:`,
              fallbackError,
            );
            return res.status(401).json({
              message: "Unauthorized: Token verification failed",
              timestamp,
              ip,
            });
          }
        } else {
          console.log(
            `[${timestamp}] JWKS verification successful for user: ${decoded.sub}`,
          );

          req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
          };
          next();
        }
      },
    );
  } catch (error) {
    console.error(`[${timestamp}] JWT verification error:`, error);
    return res.status(401).json({
      message: "Unauthorized: Token verification failed",
      timestamp,
      ip,
    });
  }
};
