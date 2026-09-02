import { User } from '../models/User.js';
import { AuthService } from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class UserController {
  /**
   * GET /api/v1/users/me
   */
  static async getProfile(req, res) {
    return successResponse(res, {
      user: AuthService.formatUserPayload(req.user)
    });
  }

  /**
   * PATCH /api/v1/users/me
   * Whitelist-only updates (strictly prevents tampering with role or verification flags)
   */
  static async updateProfile(req, res, next) {
    try {
      const allowedUpdates = ['firstName', 'lastName', 'drivingLicenseNumber', 'profileImage'];
      const updates = {};

      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true
      });

      return successResponse(
        res,
        { user: AuthService.formatUserPayload(updatedUser) },
        'Profile updated successfully.'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/me/password
   */
  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id).select('+passwordHash');
      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return errorResponse(res, 'Current password is incorrect.', 400, 'INCORRECT_PASSWORD');
      }

      user.passwordHash = await User.hashPassword(newPassword);
      await user.save();

      return successResponse(res, null, 'Password updated successfully.');
    } catch (error) {
      next(error);
    }
  }
}
