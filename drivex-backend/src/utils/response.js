/**
 * Standardized API Response Utilities
 */

export function successResponse(res, data = {}, message = null, statusCode = 200) {
  const payload = {
    success: true,
    data
  };

  if (message) {
    payload.message = message;
  }

  return res.status(statusCode).json(payload);
}

export function errorResponse(res, message = 'An error occurred', statusCode = 500, code = 'SERVER_ERROR', details = []) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details
    }
  });
}
