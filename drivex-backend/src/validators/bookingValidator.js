import { body } from 'express-validator';

export const createBookingValidator = [
  body('vehicleId')
    .notEmpty()
    .withMessage('Vehicle ID is required')
    .isMongoId()
    .withMessage('Invalid Vehicle ID format'),

  body('pickup.date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Pickup date must be in YYYY-MM-DD format'),

  body('dropoff.date')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Dropoff date must be in YYYY-MM-DD format'),

  body('driverInfo.fullName')
    .trim()
    .notEmpty()
    .withMessage('Driver full name is required'),

  body('driverInfo.phone')
    .trim()
    .notEmpty()
    .withMessage('Driver phone number is required'),

  body('driverInfo.drivingLicense')
    .trim()
    .notEmpty()
    .withMessage('Driver driving licence number is required')
];
