import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export class AuthService {
  /**
   * Generate short-lived Access Token (15m)
   */
  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user._id || user.id,
        email: user.email,
        role: user.role
      },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: ENV.JWT_ACCESS_EXPIRES }
    );
  }

  /**
   * Generate long-lived Refresh Token (7d)
   */
  static generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user._id || user.id
      },
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: ENV.JWT_REFRESH_EXPIRES }
    );
  }

  /**
   * Verify Access Token
   */
  static verifyAccessToken(token) {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
  }

  /**
   * Verify Refresh Token
   */
  static verifyRefreshToken(token) {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  }

  /**
   * Format safe user object for response
   */
  static formatUserPayload(user) {
    return {
      id: user._id || user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage || '',
      verification: user.verification || {},
      drivingLicenseNumber: user.drivingLicenseNumber || '',
      createdAt: user.createdAt
    };
  }

  /**
   * Set HTTP-Only Refresh Cookie
   */
  static setRefreshCookie(res, refreshToken) {
    const isProd = ENV.isProduction;
    res.cookie('drivex_refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd, // True on HTTPS production
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
  }

  /**
   * Clear HTTP-Only Refresh Cookie
   */
  static clearRefreshCookie(res) {
    const isProd = ENV.isProduction;
    res.clearCookie('drivex_refresh_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax'
    });
  }
}
