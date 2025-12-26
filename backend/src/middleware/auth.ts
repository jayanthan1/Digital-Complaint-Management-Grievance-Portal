import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { AuthToken, UserRole } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthToken;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[authMiddleware] Authorization header:', authHeader ? 'PRESENT' : 'MISSING');
    
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.error('[authMiddleware] No token provided in Authorization header');
      console.error('[authMiddleware] Auth header value:', authHeader);
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    console.log('[authMiddleware] Token found, attempting to verify...');
    const decoded = verifyToken(token);
    console.log('[authMiddleware] Token verified successfully. User ID:', decoded.id);
    
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('[authMiddleware] Token verification failed:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const roleMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }
    next();
  };
};
