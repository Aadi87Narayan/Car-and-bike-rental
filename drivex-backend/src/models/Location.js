import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location/Hub name is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      index: true
    },
    state: {
      type: String,
      required: [true, 'State name is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'India'
    },
    address: {
      type: String,
      required: [true, 'Hub street address is required'],
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
      },
      // [longitude, latitude] as per GeoJSON specification
      coordinates: {
        type: [Number],
        required: true
      }
    },
    operatingHours: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '23:00' }
    },
    contactPhone: {
      type: String,
      default: '+919876543210'
    },
    active: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// MongoDB 2dsphere index for geospatial proximity searching
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ city: 1, active: 1 });

export const Location = mongoose.model('Location', locationSchema);
