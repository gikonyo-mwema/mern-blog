import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// Cookie configuration with enhanced security
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: '/',
  ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN })
};

/**
 * Verify JWT token from cookies only
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyToken = (req, res, next) => {
  // Get token from cookies only
  const token = req.cookies?.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized - No authentication token found'));
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err.name, err.message);
      
      // Clear the invalid cookie
      res.clearCookie('access_token', COOKIE_OPTIONS);

      // Provide specific error messages
      let errorMessage = 'Authentication failed';
      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Session expired - Please log in again';
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid authentication token';
      }

      return next(errorHandler(401, errorMessage));
    }

    // Attach the decoded user information to the request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      isAdmin: decoded.isAdmin || false
    };

    // Refresh the cookie to extend session
    const newToken = jwt.sign(
      { 
        id: decoded.id, 
        username: decoded.username,
        email: decoded.email,
        isAdmin: decoded.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('access_token', newToken, COOKIE_OPTIONS);
    next();
  });
};

/**
 * Verify admin privileges middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user?.isAdmin) {
      return next(errorHandler(403, 'Forbidden - Admin privileges required'));
    }
    next();
  });
};

/**
 * Verify user ownership or admin privileges
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyUserOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return next(errorHandler(403, 'Forbidden - Not authorized for this operation'));
    }
    next();
  });
};

/**
 * Middleware to attach user info without blocking requests
 * (Useful for optional authentication)
 */
export const attachUserIfAvailable = (req, res, next) => {
  const token = req.cookies?.access_token;
  
  if (!token) return next();

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        isAdmin: decoded.isAdmin || false
      };
    }
    next();
  });
};