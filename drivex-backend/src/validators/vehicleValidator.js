import { body } from 'express-validator';

export const vehicleValidator = [
  body('brand').trim().notEmpty().withMessage('Vehicle brand is required'),
  body('model').trim().notEmpty().withMessage('Vehicle model is required'),
  body('type')
    .isIn(['car', 'bike', 'scooter', 'ev'])
    .withMessage('Vehicle type must be car, bike, scooter, or ev'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('seatingCapacity')
    .isInt({ min: 1, max: 12 })
    .withMessage('Seating capacity must be a positive integer between 1 and 12'),
  body('fuelType')
    .isIn(['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'])
    .withMessage('Invalid fuel type'),
  body('transmission')
    .isIn(['Automatic', 'Manual', 'Single-Speed Automatic'])
    .withMessage('Invalid transmission type'),
  body('rental.pricePerDay')
    .isFloat({ min: 100 })
    .withMessage('Daily rental price must be at least ₹100'),
  body('rental.refundableDeposit')
    .isFloat({ min: 0 })
    .withMessage('Refundable deposit cannot be negative'),
  body('cityName').trim().notEmpty().withMessage('City hub name is required')
];
