import { AuthService } from '../services/authService.js';
import { User } from '../models/User.js';
import { errorResponse } from '../utils/response.js';

export async function authenticate(req, res, next) {
  try {
    let token = null;

    // Check Authorization Header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Authentication required. Please log in to proceed.', 401, 'UNAUTHENTICATED');
    }

    // Verify token
    let decoded;
    try {
      decoded = AuthService.verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Access token has expired. Please refresh your session.', 401, 'TOKEN_EXPIRED');
      }
      return errorResponse(res, 'Invalid authentication token.', 401, 'INVALID_TOKEN');
    }

    // Fetch user from DB to ensure account is active
    const user = await User.findById(decoded.id);
    if (!user || !user.active) {
      return errorResponse(res, 'User account not found or disabled.', 401, 'USER_INACTIVE');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware (attaches user if token is present, but doesn't block guests)
 */
export async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = AuthService.verifyAccessToken(token);
        const user = await User.findById(decoded.id);
        if (user && user.active) {
          req.user = user;
        }
      } catch (e) {
        // Ignore errors in optional authentication
      }
    }
    next();
  } catch (err) {
    next();
  }
}
