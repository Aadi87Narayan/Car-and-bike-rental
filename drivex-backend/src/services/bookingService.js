import { Booking } from '../models/Booking.js';
import { Vehicle } from '../models/Vehicle.js';

export class BookingService {
  /**
   * Check if a vehicle has conflicting reservations in the given time window
   */
  static async checkAvailability(vehicleId, pickupDateTime, dropoffDateTime, excludeBookingId = null) {
    const query = {
      vehicle: vehicleId,
      status: { $in: ['confirmed', 'active', 'pending'] },
      // Overlap condition: (StartA < EndB) and (EndA > StartB)
      'pickup.dateTime': { $lt: dropoffDateTime },
      'dropoff.dateTime': { $gt: pickupDateTime }
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const conflictingBooking = await Booking.findOne(query).lean();
    return {
      isAvailable: !conflictingBooking,
      conflictingBooking
    };
  }

  /**
   * Find vehicle and verify operational status
   */
  static async validateVehicleForRental(vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId).populate('location');
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (!vehicle.active || vehicle.availabilityStatus === 'in_service' || vehicle.availabilityStatus === 'maintenance') {
      throw new Error(`Vehicle is currently unavailable for rental (Status: ${vehicle.availabilityStatus})`);
    }

    return vehicle;
  }
}
