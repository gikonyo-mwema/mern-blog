import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// Shared cookie options (same as in signout)
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
};

export const verifyToken = (req, res, next) => {
  // Extract token from cookie or header (Authorization or authorization)
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = req.cookies?.access_token || bearerToken;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized - No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err.message);

      // Clear invalid token cookie
      res.clearCookie('access_token', COOKIE_OPTIONS);
      return next(errorHandler(401, 'Unauthorized - Invalid token'));
    }

    req.user = user;
    next();
  });
};
