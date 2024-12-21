import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User } from '../models/User';
import { ErrorResponse } from '../utils/errorResponse';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      
      if (!decoded || !decoded.id) {
        return next(new ErrorResponse('Invalid token structure', 401));
      }

      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new ErrorResponse(`No user found with ID: ${decoded.id}`, 404));
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return next(new ErrorResponse('Invalid token', 401));
      }
      if (err instanceof jwt.TokenExpiredError) {
        return next(new ErrorResponse('Token expired', 401));
      }
      return next(new ErrorResponse('Authentication error', 401));
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user?.role} is not authorized to access this route`, 403));
    }
    next();
  };
};
