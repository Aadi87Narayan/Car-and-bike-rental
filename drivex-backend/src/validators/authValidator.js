import { body } from 'express-validator';

export const registerValidator = [
  body('firstName')
    .isString()
    .withMessage('First name must be a string')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .escape(),

  body('lastName')
    .isString()
    .withMessage('Last name must be a string')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .escape(),

  body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .isString()
    .withMessage('Phone must be a string')
    .trim()
    .custom((val) => {
      // Normalize Indian phone numbers: +91XXXXXXXXXX or 10 digits
      const cleaned = val.replace(/[\s\-()]/g, '');
      const indianPhoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
      if (!indianPhoneRegex.test(cleaned)) {
        throw new Error('Please enter a valid Indian mobile number (+91 or 10 digits starting with 6-9)');
      }
      return true;
    }),

  body('drivingLicenseNumber')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Driving license must be a string')
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage('Driving license must be between 5 and 30 characters')
    .escape(),

  body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
];

export const loginValidator = [
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Password is required')
];

export const forgotPasswordValidator = [
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address')
];

export const resetPasswordValidator = [
  body('token')
    .isString()
    .withMessage('Reset token must be a string')
    .notEmpty()
    .withMessage('Reset token is required'),

  body('newPassword')
    .isString()
    .withMessage('New password must be a string')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number')
];
