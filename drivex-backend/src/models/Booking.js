import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
      index: true
    },
    vehicleType: {
      type: String,
      enum: ['car', 'bike', 'scooter', 'ev'],
      required: true
    },
    vehicleDetails: {
      name: String,
      brand: String,
      model: String,
      variant: String,
      image: String,
      fuelType: String,
      transmission: String
    },
    pickup: {
      location: { type: String, required: true },
      date: { type: String, required: true }, // YYYY-MM-DD
      time: { type: String, default: '10:00' },
      dateTime: { type: Date, required: true, index: true }
    },
    dropoff: {
      location: { type: String, required: true },
      date: { type: String, required: true }, // YYYY-MM-DD
      time: { type: String, default: '10:00' },
      dateTime: { type: Date, required: true, index: true }
    },
    duration: {
      totalDays: { type: Number, required: true, min: 1 },
      totalHours: { type: Number, required: true }
    },
    driverOption: {
      type: String,
      enum: ['self_drive', 'with_chauffeur'],
      default: 'self_drive'
    },
    driverInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      drivingLicense: { type: String, required: true },
      deliveryAddress: { type: String, default: 'Hub Pickup' }
    },
    addOns: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true }
      }
    ],
    pricing: {
      baseDailyRate: { type: Number, required: true },
      baseRentalTotal: { type: Number, required: true },
      addOnsTotal: { type: Number, default: 0 },
      taxGST: { type: Number, required: true }, // 18% GST standard in India
      taxPercentage: { type: Number, default: 18 },
      discountAmount: { type: Number, default: 0 },
      couponCode: { type: String, default: '' },
      refundableSecurityDeposit: { type: Number, required: true },
      finalPayableAmount: { type: Number, required: true }
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'],
      default: 'confirmed',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'authorized', 'paid', 'failed', 'refunded'],
      default: 'paid', // In mock/direct flow, can be pending or paid
      index: true
    },
    paymentDetails: {
      method: { type: String, default: 'upi' }, // upi, card, netbanking, cod
      transactionId: { type: String, default: '' },
      paidAt: { type: Date }
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'verified',
      index: true
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    cancelledAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes for conflict checks and efficient dashboard views
bookingSchema.index({ vehicle: 1, 'pickup.dateTime': 1, 'dropoff.dateTime': 1, status: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

export const Booking = mongoose.model('Booking', bookingSchema);
