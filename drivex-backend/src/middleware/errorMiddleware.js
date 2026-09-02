import { ENV } from '../config/env.js';
import { errorResponse } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.code || 'SERVER_ERROR';
  let details = [];

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_ID';
    message = `Resource not found with invalid identifier: ${err.value}`;
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE_RESOURCE';
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    errorCode = 'VALIDATION_ERROR';
    details = Object.values(err.errors || {}).map((val) => ({
      field: val.path,
      message: val.message
    }));
    message = 'Validation failed. Please verify the provided fields.';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Invalid authentication token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Session expired. Please log in again.';
  }

  // Multer File Upload Errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    errorCode = 'FILE_UPLOAD_ERROR';
    message = `Upload error: ${err.message}`;
  }

  // Log error stack during development
  if (!ENV.isProduction && statusCode === 500) {
    console.error('🔥 [Unhandled Error]:', err);
  }

  return errorResponse(res, message, statusCode, errorCode, details);
}

// 404 Route Not Found Middleware
export function notFoundHandler(req, res) {
  return errorResponse(
    res,
    `Route ${req.method} ${req.originalUrl} not found on DriveX API server.`,
    404,
    'ROUTE_NOT_FOUND'
  );
}
