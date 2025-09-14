import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { SUPABASE_JWT_SECRET, SUPABASE_URL } from '../config/env.ts'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email?: string
    role?: string
    [key: string]: any
  }
}

// Create JWKS client for Supabase
const client = jwksClient({
  jwksUri: `${SUPABASE_URL}/auth/v1/jwks`,
  cache: true,
  cacheMaxAge: 600000, // 10 minutes
  rateLimit: true,
  jwksRequestsPerMinute: 5
})

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err)
      return
    }
    const signingKey = key?.getPublicKey()
    callback(null, signingKey)
  })
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token not found in header' });
  }

  try {
    // First try JWKS verification (for production Supabase tokens)
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded: any) => {
      if (err) {
        // Fallback to simple JWT verification with secret (for development)
        try {
          const fallbackDecoded = jwt.verify(token, SUPABASE_JWT_SECRET) as any
          req.user = {
            id: fallbackDecoded.sub,
            email: fallbackDecoded.email,
            role: fallbackDecoded.role,
          }
          next()
        } catch (fallbackError) {
          console.error('JWT verification failed:', fallbackError)
          return res.status(401).json({ message: 'Unauthorized: Token verification failed' })
        }
      } else {
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
        }
        next()
      }
    })
  } catch (error) {
    console.error('JWT verification failed:', error)
    return res.status(401).json({ message: 'Unauthorized: Token verification failed' })
  }
}
