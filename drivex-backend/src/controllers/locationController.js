import { Location } from '../models/Location.js';
import { MapService } from '../services/mapService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class LocationController {
  /**
   * GET /api/v1/locations/hubs
   * Get all active DriveX rental locations/hubs
   */
  static async getHubs(req, res, next) {
    try {
      const hubs = await Location.find({ active: true }).sort({ city: 1 });
      return successResponse(res, { hubs });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/locations/search?q=Bhilai
   */
  static async searchLocations(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        return successResponse(res, { results: [] });
      }

      const results = await MapService.searchPlaces(q);
      return successResponse(res, { results });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/locations/geocode?address=Bhilai
   */
  static async geocode(req, res, next) {
    try {
      const { address } = req.query;
      if (!address) {
        return errorResponse(res, 'Address query parameter is required.', 400, 'ADDRESS_REQUIRED');
      }

      const location = await MapService.geocodeAddress(address);
      return successResponse(res, { location });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/locations/reverse-geocode?lat=...&lng=...
   */
  static async reverseGeocode(req, res, next) {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        return errorResponse(res, 'lat and lng parameters are required.', 400, 'COORDINATES_REQUIRED');
      }

      const address = await MapService.reverseGeocode(lat, lng);
      return successResponse(res, { address });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/locations/route
   */
  static async getRoute(req, res, next) {
    try {
      const { origin, destination } = req.body;

      if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
        return errorResponse(
          res,
          'Both origin {lat, lng} and destination {lat, lng} coordinates are required.',
          400,
          'INVALID_ROUTE_PARAMS'
        );
      }

      const route = await MapService.getRoute(origin, destination);
      return successResponse(res, route);
    } catch (error) {
      next(error);
    }
  }
}
