import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return errorResponse(
      res,
      'Validation failed. Please correct the highlighted errors.',
      422,
      'VALIDATION_ERROR',
      errorDetails
    );
  }
  next();
}
