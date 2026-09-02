import { Booking } from '../models/Booking.js';
import { Payment } from '../models/Payment.js';
import { PaymentService } from '../services/paymentService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class PaymentController {
  /**
   * POST /api/v1/payments/create-order
   */
  static async createOrder(req, res, next) {
    try {
      const { bookingId } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return errorResponse(res, 'Booking not found.', 404, 'BOOKING_NOT_FOUND');
      }

      const isOwner = booking.user.toString() === req.user._id.toString();
      if (!isOwner) {
        return errorResponse(res, 'Access denied.', 403, 'FORBIDDEN');
      }

      const amountToPay = booking.pricing.finalPayableAmount;
      const order = await PaymentService.createOrder(amountToPay, booking.bookingNumber, {
        email: req.user.email,
        phone: req.user.phone
      });

      // Record payment attempt
      await Payment.create({
        booking: booking._id,
        user: req.user._id,
        amount: amountToPay,
        currency: 'INR',
        gateway: order.isMock ? 'mock_gateway' : 'razorpay',
        razorpayOrderId: order.orderId,
        status: 'created'
      });

      return successResponse(res, { order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/payments/verify
   * Cryptographic verification of payment signature
   */
  static async verifyPayment(req, res, next) {
    try {
      const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return errorResponse(res, 'Booking not found.', 404, 'BOOKING_NOT_FOUND');
      }

      // Verify signature
      const isValid = PaymentService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      if (!isValid) {
        return errorResponse(res, 'Payment signature verification failed.', 400, 'PAYMENT_SIGNATURE_INVALID');
      }

      // Update payment record
      await Payment.findOneAndUpdate(
        { booking: booking._id },
        {
          razorpayPaymentId,
          razorpaySignature,
          status: 'captured',
          paymentMethod: 'razorpay_verified'
        },
        { upsert: true }
      );

      // Update Booking status
      booking.paymentStatus = 'paid';
      booking.paymentDetails = {
        method: 'razorpay',
        transactionId: razorpayPaymentId,
        paidAt: new Date()
      };
      await booking.save();

      return successResponse(res, { booking }, 'Payment verified and booking confirmed successfully!');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/payments/webhook
   * Razorpay Server-to-Server Webhook
   */
  static async webhook(req, res, next) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const rawBody = JSON.stringify(req.body);

      const isValid = PaymentService.verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        return res.status(400).json({ status: 'invalid_signature' });
      }

      const event = req.body.event;
      if (event === 'payment.captured') {
        const paymentEntity = req.body.payload?.payment?.entity;
        if (paymentEntity?.order_id) {
          const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });
          if (payment) {
            payment.status = 'captured';
            payment.razorpayPaymentId = paymentEntity.id;
            await payment.save();

            await Booking.findByIdAndUpdate(payment.booking, {
              paymentStatus: 'paid'
            });
          }
        }
      }

      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      next(error);
    }
  }
}
