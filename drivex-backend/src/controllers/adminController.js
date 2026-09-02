import { User } from '../models/User.js';
import { Vehicle } from '../models/Vehicle.js';
import { Booking } from '../models/Booking.js';
import { Location } from '../models/Location.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class AdminController {
  /**
   * GET /api/v1/admin/dashboard
   * Real-time server-calculated KPI metrics
   */
  static async getDashboardStats(req, res, next) {
    try {
      const [
        totalUsers,
        totalVehicles,
        carsCount,
        bikesCount,
        availableVehicles,
        bookingsSummary,
        revenueData
      ] = await Promise.all([
        User.countDocuments({ role: 'user', active: true }),
        Vehicle.countDocuments({ active: true }),
        Vehicle.countDocuments({ type: 'car', active: true }),
        Vehicle.countDocuments({ type: { $in: ['bike', 'scooter', 'ev'] }, active: true }),
        Vehicle.countDocuments({ availabilityStatus: 'available', active: true }),
        Booking.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]),
        Booking.aggregate([
          { $match: { paymentStatus: 'paid', status: { $ne: 'cancelled' } } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$pricing.finalPayableAmount' },
              totalBaseRentals: { $sum: '$pricing.baseRentalTotal' },
              totalTaxes: { $sum: '$pricing.taxGST' }
            }
          }
        ])
      ]);

      const statusMap = {
        pending: 0,
        confirmed: 0,
        active: 0,
        completed: 0,
        cancelled: 0
      };

      bookingsSummary.forEach((item) => {
        if (statusMap[item._id] !== undefined) {
          statusMap[item._id] = item.count;
        }
      });

      const totalRevenue = revenueData[0]?.totalRevenue || 0;

      return successResponse(res, {
        stats: {
          totalUsers,
          totalVehicles,
          carsCount,
          bikesCount,
          availableVehicles,
          bookings: {
            total: Object.values(statusMap).reduce((a, b) => a + b, 0),
            active: statusMap.active + statusMap.confirmed,
            completed: statusMap.completed,
            cancelled: statusMap.cancelled,
            pending: statusMap.pending
          },
          revenue: {
            totalRevenue,
            totalBaseRentals: revenueData[0]?.totalBaseRentals || 0,
            totalTaxes: revenueData[0]?.totalTaxes || 0
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/users
   */
  static async getAllUsers(req, res, next) {
    try {
      const users = await User.find().sort({ createdAt: -1 }).lean();
      return successResponse(res, { users });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/vehicles
   */
  static async getAllVehicles(req, res, next) {
    try {
      const vehicles = await Vehicle.find().sort({ createdAt: -1 }).populate('location').lean();
      return successResponse(res, { vehicles });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/vehicles
   */
  static async createVehicle(req, res, next) {
    try {
      // Find or create associated location hub
      let locationId = req.body.location;
      if (!locationId && req.body.cityName) {
        let loc = await Location.findOne({ city: new RegExp(`^${req.body.cityName}$`, 'i') });
        if (!loc) {
          loc = await Location.create({
            name: `${req.body.cityName} Central Hub`,
            city: req.body.cityName,
            state: 'India',
            address: `${req.body.cityName} Main Street`,
            coordinates: { type: 'Point', coordinates: [81.3629, 21.2121] }
          });
        }
        locationId = loc._id;
      }

      const vehicle = await Vehicle.create({
        ...req.body,
        location: locationId
      });

      return successResponse(res, { vehicle }, 'Vehicle added to fleet successfully.', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/vehicles/:id
   */
  static async updateVehicle(req, res, next) {
    try {
      const { id } = req.params;
      const vehicle = await Vehicle.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });

      if (!vehicle) {
        return errorResponse(res, 'Vehicle not found.', 404, 'NOT_FOUND');
      }

      return successResponse(res, { vehicle }, 'Vehicle updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/vehicles/:id
   */
  static async deleteVehicle(req, res, next) {
    try {
      const { id } = req.params;
      const vehicle = await Vehicle.findByIdAndUpdate(id, { active: false }, { new: true });

      if (!vehicle) {
        return errorResponse(res, 'Vehicle not found.', 404, 'NOT_FOUND');
      }

      return successResponse(res, null, 'Vehicle removed from active fleet.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/bookings
   */
  static async getAllBookings(req, res, next) {
    try {
      const bookings = await Booking.find()
        .sort({ createdAt: -1 })
        .populate('user', 'firstName lastName email phone')
        .populate('vehicle')
        .lean();

      return successResponse(res, { bookings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/bookings/:id/status
   */
  static async updateBookingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'];
      if (!allowedStatuses.includes(status)) {
        return errorResponse(res, 'Invalid booking status.', 400, 'INVALID_STATUS');
      }

      const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
      if (!booking) {
        return errorResponse(res, 'Booking not found.', 404, 'NOT_FOUND');
      }

      return successResponse(res, { booking }, `Booking status updated to ${status}.`);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/revenue
   */
  static async getRevenueAnalytics(req, res, next) {
    try {
      const monthlyRevenue = await Booking.aggregate([
        { $match: { paymentStatus: 'paid', status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$pricing.finalPayableAmount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
      ]);

      return successResponse(res, { monthlyRevenue });
    } catch (error) {
      next(error);
    }
  }
}
