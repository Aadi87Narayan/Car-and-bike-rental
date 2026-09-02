import { Favorite } from '../models/Favorite.js';
import { Vehicle } from '../models/Vehicle.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class FavoriteController {
  /**
   * GET /api/v1/favorites
   */
  static async getFavorites(req, res, next) {
    try {
      const favorites = await Favorite.find({ user: req.user._id })
        .populate({
          path: 'vehicle',
          populate: { path: 'location', select: 'name city' }
        })
        .lean();

      const vehicles = favorites
        .map((f) => f.vehicle)
        .filter((v) => v && v.active);

      return successResponse(res, { favorites: vehicles });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/favorites/:vehicleId
   */
  static async addFavorite(req, res, next) {
    try {
      const { vehicleId } = req.params;

      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle || !vehicle.active) {
        return errorResponse(res, 'Vehicle not found.', 404, 'VEHICLE_NOT_FOUND');
      }

      await Favorite.findOneAndUpdate(
        { user: req.user._id, vehicle: vehicleId },
        { user: req.user._id, vehicle: vehicleId },
        { upsert: true, new: true }
      );

      return successResponse(res, null, 'Vehicle added to favorites.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/favorites/:vehicleId
   */
  static async removeFavorite(req, res, next) {
    try {
      const { vehicleId } = req.params;
      await Favorite.findOneAndDelete({ user: req.user._id, vehicle: vehicleId });

      return successResponse(res, null, 'Vehicle removed from favorites.');
    } catch (error) {
      next(error);
    }
  }
}
