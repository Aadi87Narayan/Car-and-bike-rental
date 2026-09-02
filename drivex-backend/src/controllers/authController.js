import crypto from 'crypto';
import { User } from '../models/User.js';
import { AuthService } from '../services/authService.js';
import { NotificationService } from '../services/notificationService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static async register(req, res, next) {
    try {
      const { firstName, lastName, email, phone, password } = req.body;

      // Check if email already registered
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return errorResponse(res, 'An account with this email address already exists.', 409, 'EMAIL_EXISTS');
      }

      // Check if phone already registered
      const existingPhone = await User.findOne({ phone: phone.trim() });
      if (existingPhone) {
        return errorResponse(res, 'An account with this phone number already exists.', 409, 'PHONE_EXISTS');
      }

      // Hash password
      const passwordHash = await User.hashPassword(password);

      // Create new user (Role strictly defaults to 'user' - NEVER accept 'admin' from body)
      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone: phone.trim(),
        passwordHash,
        role: 'user',
        drivingLicenseNumber: req.body.drivingLicenseNumber || '',
        verification: {
          emailVerified: false,
          phoneVerified: true, // Demo Indian verification
          identityVerified: false,
          drivingLicenseVerified: !!req.body.drivingLicenseNumber
        }
      });

      // Generate tokens
      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      // Save hashed/stored refresh token in user document
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      // Set HTTP-Only Cookie
      AuthService.setRefreshCookie(res, refreshToken);

      return successResponse(
        res,
        {
          accessToken,
          user: AuthService.formatUserPayload(user)
        },
        'Registration successful. Welcome to DriveX!',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Query user including passwordHash
      const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
      if (!user || !user.active) {
        return errorResponse(res, 'Invalid email or password.', 401, 'INVALID_CREDENTIALS');
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return errorResponse(res, 'Invalid email or password.', 401, 'INVALID_CREDENTIALS');
      }

      // Generate tokens
      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      // Set HTTP-Only Cookie
      AuthService.setRefreshCookie(res, refreshToken);

      return successResponse(
        res,
        {
          accessToken,
          user: AuthService.formatUserPayload(user)
        },
        'Login successful.'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  static async refresh(req, res, next) {
    try {
      // Read refresh token from HTTP-only cookie or Authorization header fallback
      const token = req.cookies?.drivex_refresh_token || req.body?.refreshToken;

      if (!token) {
        return errorResponse(res, 'Refresh token required.', 401, 'REFRESH_TOKEN_REQUIRED');
      }

      let decoded;
      try {
        decoded = AuthService.verifyRefreshToken(token);
      } catch (err) {
        AuthService.clearRefreshCookie(res);
        return errorResponse(res, 'Invalid or expired refresh token. Please log in again.', 401, 'REFRESH_TOKEN_EXPIRED');
      }

      const user = await User.findById(decoded.id).select('+refreshToken');
      if (!user || !user.active) {
        AuthService.clearRefreshCookie(res);
        return errorResponse(res, 'User session no longer valid.', 401, 'USER_INVALID');
      }

      // Rotate Access Token (and optionally refresh token)
      const newAccessToken = AuthService.generateAccessToken(user);

      return successResponse(
        res,
        {
          accessToken: newAccessToken,
          user: AuthService.formatUserPayload(user)
        },
        'Session refreshed successfully.'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  static async logout(req, res, next) {
    try {
      const token = req.cookies?.drivex_refresh_token;
      if (token) {
        try {
          const decoded = AuthService.verifyRefreshToken(token);
          await User.findByIdAndUpdate(decoded.id, { $unset: { refreshToken: 1 } });
        } catch (e) {
          // Continue cleanup
        }
      }

      AuthService.clearRefreshCookie(res);
      return successResponse(res, null, 'Logged out successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  static async me(req, res) {
    return successResponse(res, {
      user: AuthService.formatUserPayload(req.user)
    });
  }

  /**
   * POST /api/v1/auth/forgot-password
   */
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      // Always return identical success message to prevent user enumeration attacks
      const responseMessage = 'If an account with this email exists, a password reset link has been dispatched.';

      if (!user) {
        return successResponse(res, null, responseMessage);
      }

      // Generate random reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes validity
      await user.save({ validateBeforeSave: false });

      const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
      await NotificationService.sendPasswordResetEmail(user.email, resetUrl);

      return successResponse(res, null, responseMessage);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/reset-password
   */
  static async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        return errorResponse(res, 'Password reset token is invalid or has expired.', 400, 'INVALID_RESET_TOKEN');
      }

      user.passwordHash = await User.hashPassword(newPassword);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      return successResponse(res, null, 'Password reset successfully. You may now log in with your new password.');
    } catch (error) {
      next(error);
    }
  }
}
