import crypto from 'crypto';
import { ENV } from '../config/env.js';

export class PaymentService {
  /**
   * Create Razorpay Order or fallback to local test order
   */
  static async createOrder(amountInRupees, receiptBookingNumber, customerInfo = {}) {
    const amountInPaise = Math.round(amountInRupees * 100);

    // If Razorpay API credentials exist, use live/sandbox Razorpay API
    if (ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET) {
      try {
        const authHeader = Buffer.from(`${ENV.RAZORPAY_KEY_ID}:${ENV.RAZORPAY_KEY_SECRET}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authHeader}`
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: receiptBookingNumber,
            notes: {
              customerEmail: customerInfo.email || '',
              customerPhone: customerInfo.phone || ''
            }
          })
        });

        const orderData = await response.json();
        if (orderData && orderData.id) {
          return {
            orderId: orderData.id,
            amount: amountInRupees,
            currency: 'INR',
            keyId: ENV.RAZORPAY_KEY_ID,
            isMock: false
          };
        }
      } catch (err) {
        console.warn(`[PaymentService] Razorpay order creation fallback: ${err.message}`);
      }
    }

    // Direct Secure Local Order for Development / Demo
    const mockOrderId = `order_dx_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    return {
      orderId: mockOrderId,
      amount: amountInRupees,
      currency: 'INR',
      keyId: ENV.RAZORPAY_KEY_ID || 'rzp_test_drivex_demo',
      isMock: true
    };
  }

  /**
   * Verify Razorpay Payment Signature using HMAC SHA256
   */
  static verifySignature(orderId, paymentId, signature) {
    if (!ENV.RAZORPAY_KEY_SECRET) {
      // In dev mode without keys, approve mock transactions with correct format
      return paymentId && paymentId.length > 5;
    }

    const hmac = crypto.createHmac('sha256', ENV.RAZORPAY_KEY_SECRET);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === signature;
  }

  /**
   * Verify Webhook Signature
   */
  static verifyWebhookSignature(rawBody, signature) {
    if (!ENV.RAZORPAY_WEBHOOK_SECRET) return true;

    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  }
}
