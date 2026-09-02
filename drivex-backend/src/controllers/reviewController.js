import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import { Vehicle } from '../models/Vehicle.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class ReviewController {
  /**
   * GET /api/v1/vehicles/:vehicleId/reviews
   */
  static async getVehicleReviews(req, res, next) {
    try {
      const { vehicleId } = req.params;
      const reviews = await Review.find({ vehicle: vehicleId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      return successResponse(res, { reviews });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/vehicles/:vehicleId/reviews
   * Strict verification: User must have a completed or confirmed booking for this vehicle!
   */
  static async addReview(req, res, next) {
    try {
      const { vehicleId } = req.params;
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return errorResponse(res, 'Rating must be between 1 and 5 stars.', 400, 'INVALID_RATING');
      }

      if (!comment || comment.trim().length < 5) {
        return errorResponse(res, 'Review comment must be at least 5 characters.', 400, 'INVALID_COMMENT');
      }

      // Check if user has an eligible booking for this vehicle
      const eligibleBooking = await Booking.findOne({
        user: req.user._id,
        vehicle: vehicleId,
        status: { $in: ['confirmed', 'completed', 'active'] }
      });

      if (!eligibleBooking && req.user.role !== 'admin') {
        return errorResponse(
          res,
          'You can only submit a verified review after booking this vehicle.',
          403,
          'VERIFIED_BOOKING_REQUIRED'
        );
      }

      // Check if user already reviewed from this specific booking
      const existingReview = await Review.findOne({
        user: req.user._id,
        vehicle: vehicleId,
        booking: eligibleBooking?._id
      });

      if (existingReview) {
        return errorResponse(res, 'You have already submitted a review for this booking.', 409, 'DUPLICATE_REVIEW');
      }

      // Create Review
      const review = await Review.create({
        vehicle: vehicleId,
        user: req.user._id,
        booking: eligibleBooking?._id,
        rating: Number(rating),
        comment: comment.trim(),
        userName: req.user.name,
        userCity: req.user.city || 'India',
        verifiedBooking: true
      });

      // Recalculate average rating for the vehicle
      const allReviews = await Review.find({ vehicle: vehicleId });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await Vehicle.findByIdAndUpdate(vehicleId, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewsCount: allReviews.length
      });

      return successResponse(res, { review }, 'Thank you! Your verified review has been posted.', 201);
    } catch (error) {
      next(error);
    }
  }
}
