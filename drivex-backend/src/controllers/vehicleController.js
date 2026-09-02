import { Vehicle } from '../models/Vehicle.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class VehicleController {
  /**
   * GET /api/v1/vehicles
   * Filter, Sort, Paginate
   */
  static async getVehicles(req, res, next) {
    try {
      const {
        type,
        brand,
        model,
        category,
        fuelType,
        transmission,
        minPrice,
        maxPrice,
        minSeats,
        maxSeats,
        location,
        city,
        availability,
        rating,
        featured,
        search,
        sort = 'recommended',
        page = 1,
        limit = 12
      } = req.query;

      const filter = { active: true };

      // Vehicle Type (car, bike, scooter, ev)
      if (type && type !== 'all') {
        filter.type = type.toLowerCase();
      }

      // Brand
      if (brand && brand !== 'All') {
        filter.brand = brand;
      }

      // Model
      if (model) {
        filter.model = new RegExp(model, 'i');
      }

      // Category
      if (category && category !== 'All') {
        filter.category = new RegExp(`^${category}$`, 'i');
      }

      // Fuel Type
      if (fuelType && fuelType !== 'All') {
        filter.fuelType = fuelType;
      }

      // Transmission
      if (transmission && transmission !== 'All') {
        filter.transmission = transmission;
      }

      // Price Range (Daily Rate)
      if (minPrice || maxPrice) {
        filter['rental.pricePerDay'] = {};
        if (minPrice) filter['rental.pricePerDay'].$gte = parseFloat(minPrice);
        if (maxPrice) filter['rental.pricePerDay'].$lte = parseFloat(maxPrice);
      }

      // Seating Capacity
      if (minSeats || maxSeats) {
        filter.seatingCapacity = {};
        if (minSeats) filter.seatingCapacity.$gte = parseInt(minSeats, 10);
        if (maxSeats) filter.seatingCapacity.$lte = parseInt(maxSeats, 10);
      }

      // Location / City Name
      const targetCity = city || location;
      if (targetCity && targetCity !== 'All') {
        filter.$or = [
          { cityName: new RegExp(targetCity, 'i') },
          { availableCities: { $in: [new RegExp(targetCity, 'i')] } }
        ];
      }

      // Availability Status
      if (availability) {
        filter.availabilityStatus = availability;
      }

      // Minimum Rating
      if (rating) {
        filter.rating = { $gte: parseFloat(rating) };
      }

      // Featured Flag
      if (featured === 'true') {
        filter.isFeatured = true;
      }

      // Text Search
      if (search) {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { brand: searchRegex },
          { model: searchRegex },
          { variant: searchRegex },
          { category: searchRegex },
          { cityName: searchRegex }
        ];
      }

      // Sorting
      let sortOptions = { isFeatured: -1, createdAt: -1 };
      if (sort === 'price_asc' || sort === 'price-low') {
        sortOptions = { 'rental.pricePerDay': 1 };
      } else if (sort === 'price_desc' || sort === 'price-high') {
        sortOptions = { 'rental.pricePerDay': -1 };
      } else if (sort === 'rating') {
        sortOptions = { rating: -1, reviewsCount: -1 };
      } else if (sort === 'newest') {
        sortOptions = { createdAt: -1 };
      }

      // Pagination
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
      const skip = (pageNum - 1) * limitNum;

      const [vehicles, total] = await Promise.all([
        Vehicle.find(filter)
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum)
          .populate('location', 'name city state address coordinates')
          .lean(),
        Vehicle.countDocuments(filter)
      ]);

      return successResponse(res, {
        vehicles,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/vehicles/:id
   */
  static async getVehicleById(req, res, next) {
    try {
      const { id } = req.params;
      const vehicle = await Vehicle.findById(id).populate('location');

      if (!vehicle || !vehicle.active) {
        return errorResponse(res, 'Vehicle not found.', 404, 'VEHICLE_NOT_FOUND');
      }

      return successResponse(res, { vehicle });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/vehicles/search
   */
  static async searchVehicles(req, res, next) {
    try {
      const { q } = req.query;
      if (!q || !q.trim()) {
        return successResponse(res, { vehicles: [] });
      }

      const searchRegex = new RegExp(q.trim(), 'i');
      const vehicles = await Vehicle.find({
        active: true,
        $or: [
          { brand: searchRegex },
          { model: searchRegex },
          { variant: searchRegex },
          { category: searchRegex },
          { cityName: searchRegex }
        ]
      })
        .limit(10)
        .populate('location', 'name city')
        .lean();

      return successResponse(res, { vehicles });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/vehicles/nearby
   * Geospatial MongoDB $nearSphere query
   */
  static async getNearbyVehicles(req, res, next) {
    try {
      const { lat, lng, radius = 25, type } = req.query;

      if (!lat || !lng) {
        return errorResponse(res, 'Latitude (lat) and Longitude (lng) query parameters are required.', 400, 'GEO_PARAMS_REQUIRED');
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusInMeters = parseFloat(radius) * 1000; // km to meters

      const query = {
        active: true,
        coordinates: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: radiusInMeters
          }
        }
      };

      if (type && type !== 'all') {
        query.type = type.toLowerCase();
      }

      const vehicles = await Vehicle.find(query)
        .limit(20)
        .populate('location')
        .lean();

      return successResponse(res, {
        vehicles,
        meta: {
          searchCenter: { lat: latitude, lng: longitude },
          radiusKm: parseFloat(radius),
          count: vehicles.length
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
