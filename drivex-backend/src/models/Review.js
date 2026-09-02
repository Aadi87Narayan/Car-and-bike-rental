import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating (1-5) is required'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    userName: {
      type: String,
      required: true
    },
    userCity: {
      type: String,
      default: 'India'
    },
    verifiedBooking: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ vehicle: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
