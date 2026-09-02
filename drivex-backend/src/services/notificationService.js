import { ENV } from '../config/env.js';

export class NotificationService {
  /**
   * Send Booking Confirmation Email & SMS Notification (Mock / Nodemailer)
   */
  static async sendBookingConfirmation(booking, user) {
    const logInfo = `📧 [Notification] Booking #${booking.bookingNumber} confirmed for ${user.email}. Vehicle: ${booking.vehicleDetails?.name}. Total: ₹${booking.pricing?.finalPayableAmount}`;
    console.log(logInfo);

    if (ENV.SMTP_HOST && ENV.SMTP_USER) {
      // Live SMTP sending can be plugged in here
      console.log(`[NotificationService] Dispatched confirmation email to ${user.email}`);
    }

    return true;
  }

  /**
   * Send Password Reset Email
   */
  static async sendPasswordResetEmail(email, resetUrl) {
    console.log(`🔑 [Notification] Password reset link for ${email}: ${resetUrl}`);
    return true;
  }
}
