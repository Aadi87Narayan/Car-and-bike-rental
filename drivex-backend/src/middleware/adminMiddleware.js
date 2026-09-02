import { errorResponse } from '../utils/response.js';

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return errorResponse(res, 'Authentication required.', 401, 'UNAUTHENTICATED');
  }

  if (req.user.role !== 'admin' && req.user.role !== 'fleet_manager') {
    return errorResponse(
      res,
      'Access denied. Administrator privileges are required to perform this action.',
      403,
      'FORBIDDEN'
    );
  }

  next();
}
