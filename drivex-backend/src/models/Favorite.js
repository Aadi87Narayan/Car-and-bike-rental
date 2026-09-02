import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
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
    }
  },
  {
    timestamps: true
  }
);

// One favorite record per user-vehicle pair
favoriteSchema.index({ user: 1, vehicle: 1 }, { unique: true });

export const Favorite = mongoose.model('Favorite', favoriteSchema);
