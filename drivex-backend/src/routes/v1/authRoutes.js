import express from 'express';
import { AuthController } from '../../controllers/authController.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} from '../../validators/authValidator.js';
import { validate } from '../../middleware/validationMiddleware.js';
import { authLimiter } from '../../middleware/rateLimitMiddleware.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Routes (protected with authLimiter)
router.post('/register', authLimiter, registerValidator, validate, AuthController.register);
router.post('/login', authLimiter, loginValidator, validate, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, AuthController.forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validate, AuthController.resetPassword);

// Authenticated Routes
router.get('/me', authenticate, AuthController.me);

export default router;
