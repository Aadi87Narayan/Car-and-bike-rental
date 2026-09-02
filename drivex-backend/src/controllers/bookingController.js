import { Booking } from '../models/Booking.js';
import { BookingService } from '../services/bookingService.js';
import { PricingService } from '../services/pricingService.js';
import { NotificationService } from '../services/notificationService.js';
import { generateBookingNumber } from '../utils/bookingNumber.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class BookingController {
  /**
   * POST /api/v1/bookings
   * Creates a new booking with strict server-side price calculation and date conflict prevention
   */
  static async createBooking(req, res, next) {
    try {
      const {
        vehicleId,
        pickup,
        dropoff,
        driverOption = 'self_drive',
        driverInfo,
        selectedAddons = [],
        couponCode = '',
        paymentMethod = 'upi'
      } = req.body;

      // 1. Verify vehicle exists and is active
      const vehicle = await BookingService.validateVehicleForRental(vehicleId);

      // 2. Authoritative Server-side Price & Duration Calculation
      const { duration, validAddOns, pricing } = PricingService.calculatePricing(
        vehicle,
        pickup.date,
        pickup.time,
        dropoff.date,
        dropoff.time,
        selectedAddons,
        couponCode
      );

      // 3. Collision / Conflict Prevention Check
      const { isAvailable, conflictingBooking } = await BookingService.checkAvailability(
        vehicle._id,
        duration.pickupDateTime,
        duration.dropoffDateTime
      );

      if (!isAvailable) {
        return errorResponse(
          res,
          'This vehicle is already reserved for the selected date range. Please choose alternative dates or another model.',
          409,
          'BOOKING_CONFLICT',
          [
            {
              conflictingPeriod: {
                from: conflictingBooking.pickup.dateTime,
                to: conflictingBooking.dropoff.dateTime
              }
            }
          ]
        );
      }

      // 4. Generate unique Booking Number
      const bookingNumber = generateBookingNumber();

      // 5. Create Booking Document
      const booking = await Booking.create({
        bookingNumber,
        user: req.user._id,
        vehicle: vehicle._id,
        vehicleType: vehicle.type,
        vehicleDetails: {
          name: vehicle.name || `${vehicle.brand} ${vehicle.model}`,
          brand: vehicle.brand,
          model: vehicle.model,
          variant: vehicle.variant,
          image: vehicle.images?.[0]?.url || '',
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission
        },
        pickup: {
          location: pickup.location || vehicle.cityName,
          date: pickup.date,
          time: pickup.time || '10:00',
          dateTime: duration.pickupDateTime
        },
        dropoff: {
          location: dropoff.location || pickup.location || vehicle.cityName,
          date: dropoff.date,
          time: dropoff.time || '10:00',
          dateTime: duration.dropoffDateTime
        },
        duration: {
          totalDays: duration.totalDays,
          totalHours: duration.totalHours
        },
        driverOption,
        driverInfo: {
          fullName: driverInfo.fullName || req.user.name,
          email: driverInfo.email || req.user.email,
          phone: driverInfo.phone || req.user.phone,
          drivingLicense: driverInfo.drivingLicense || req.user.drivingLicenseNumber || 'DL-VERIFIED',
          deliveryAddress: driverInfo.deliveryAddress || 'Hub Pickup'
        },
        addOns: validAddOns,
        pricing,
        status: 'confirmed',
        paymentStatus: 'paid', // Auto-authorized in direct booking flow
        paymentDetails: {
          method: paymentMethod,
          transactionId: `TXN-${Date.now()}`,
          paidAt: new Date()
        },
        verificationStatus: 'verified'
      });

      // 6. Send asynchronous confirmation notification
      NotificationService.sendBookingConfirmation(booking, req.user);

      return successResponse(
        res,
        { booking },
        'Booking confirmed successfully! Have a safe drive.',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings
   * Retrieves all bookings for the authenticated user
   */
  static async getMyBookings(req, res, next) {
    try {
      const bookings = await Booking.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('vehicle')
        .lean();

      return successResponse(res, { bookings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings/:id
   */
  static async getBookingById(req, res, next) {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id).populate('vehicle user', 'firstName lastName email phone');

      if (!booking) {
        return errorResponse(res, 'Booking not found.', 404, 'BOOKING_NOT_FOUND');
      }

      // Security: Ensure user only accesses their own booking unless admin
      const isOwner = booking.user._id.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin' || req.user.role === 'fleet_manager';

      if (!isOwner && !isAdmin) {
        return errorResponse(res, 'Access denied to this booking.', 403, 'FORBIDDEN');
      }

      return successResponse(res, { booking });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/bookings/:id/cancel
   */
  static async cancelBooking(req, res, next) {
    try {
      const { id } = req.params;
      const { reason = 'Customer requested cancellation' } = req.body;

      const booking = await Booking.findById(id);
      if (!booking) {
        return errorResponse(res, 'Booking not found.', 404, 'BOOKING_NOT_FOUND');
      }

      const isOwner = booking.user.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return errorResponse(res, 'Access denied.', 403, 'FORBIDDEN');
      }

      if (booking.status === 'cancelled' || booking.status === 'completed') {
        return errorResponse(res, `Cannot cancel a booking that is already ${booking.status}.`, 400, 'INVALID_STATUS');
      }

      booking.status = 'cancelled';
      booking.cancellationReason = reason;
      booking.cancelledAt = new Date();
      await booking.save();

      return successResponse(res, { booking }, 'Booking has been cancelled successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings/:id/receipt
   */
  static async getBookingReceipt(req, res, next) {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id).populate('vehicle');

      if (!booking) {
        return errorResponse(res, 'Booking not found.', 404, 'BOOKING_NOT_FOUND');
      }

      const isOwner = booking.user.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return errorResponse(res, 'Access denied.', 403, 'FORBIDDEN');
      }

      const invoiceData = {
        invoiceNumber: `INV-${booking.bookingNumber}`,
        bookingNumber: booking.bookingNumber,
        date: booking.createdAt,
        customer: booking.driverInfo,
        vehicle: booking.vehicleDetails,
        rentalDuration: `${booking.duration.totalDays} Days (${booking.pickup.date} to ${booking.dropoff.date})`,
        breakdown: booking.pricing,
        paymentStatus: booking.paymentStatus,
        company: {
          name: 'DriveX Mobility Pvt. Ltd.',
          gstin: '22AAAAA0000A1Z5',
          address: 'Central Hub, Great Eastern Road, Bhilai, Chhattisgarh, India - 490020',
          supportEmail: 'support@drivex.in',
          supportPhone: '+91 98765 12340'
        }
      };

      return successResponse(res, { invoice: invoiceData });
    } catch (error) {
      next(error);
    }
  }
}
