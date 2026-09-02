import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true
    },
    model: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
      index: true
    },
    variant: {
      type: String,
      trim: true,
      default: 'Standard'
    },
    type: {
      type: String,
      enum: ['car', 'bike', 'scooter', 'ev'],
      required: [true, 'Vehicle type is required'],
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required (e.g., SUV, Sedan, Cruiser, Sports, Electric)'],
      trim: true,
      index: true
    },
    seatingCapacity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      index: true
    },
    doors: {
      type: Number,
      default: 4
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'],
      required: true,
      index: true
    },
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual', 'Single-Speed Automatic'],
      required: true,
      index: true
    },
    drivetrain: {
      type: String,
      default: 'Front-Wheel Drive'
    },
    engine: {
      displacementCC: { type: Number, default: 0 },
      powerBHP: { type: Number, default: 0 },
      torqueNm: { type: Number, default: 0 }
    },
    battery: {
      capacityKWh: { type: Number, default: 0 },
      rangeKm: { type: Number, default: 0 }
    },
    rental: {
      pricePerHour: { type: Number, default: 0 },
      pricePerDay: { type: Number, required: [true, 'Daily rental price is required'], min: 0 },
      pricePerWeek: { type: Number, default: 0 },
      refundableDeposit: { type: Number, required: [true, 'Security deposit is required'], min: 0 }
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
      index: true
    },
    cityName: {
      type: String,
      required: true,
      index: true
    },
    availableCities: [
      {
        type: String,
        trim: true
      }
    ],
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [81.3629, 21.2121] // Default Bhilai coordinates
      }
    },
    specifications: {
      acceleration: { type: String, default: '0-100 in 9.5s' },
      topSpeed: { type: String, default: '180 km/h' },
      mileage: { type: String, default: '16.5 km/l' },
      luggageCapacity: { type: String, default: '400 Litres' },
      fuelTankCapacity: { type: String, default: '45 Litres' },
      curbWeight: { type: String, default: '1200 kg' }
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: 'DriveX Fleet Vehicle' }
      }
    ],
    colorOptions: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true }
      }
    ],
    description: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
      index: true
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'reserved', 'in_service', 'maintenance'],
      default: 'available',
      index: true
    },
    active: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual Name for full display (e.g., Hyundai Creta SX (O))
vehicleSchema.virtual('name').get(function () {
  return `${this.brand} ${this.model} ${this.variant || ''}`.trim();
});

// Virtual primary image
vehicleSchema.virtual('image').get(function () {
  return this.images && this.images.length > 0 ? this.images[0].url : '';
});

// Indexes for high performance searching and filtering
vehicleSchema.index({ type: 1, category: 1, active: 1 });
vehicleSchema.index({ brand: 1, model: 1 });
vehicleSchema.index({ 'rental.pricePerDay': 1 });
vehicleSchema.index({ rating: -1 });
vehicleSchema.index({ coordinates: '2dsphere' });
vehicleSchema.index({
  brand: 'text',
  model: 'text',
  variant: 'text',
  category: 'text',
  cityName: 'text'
});

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
