import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    documentType: {
      type: String,
      enum: ['driving_license', 'aadhaar_card', 'passport', 'voter_id'],
      required: true
    },
    documentNumber: {
      type: String,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String
    },
    mimeType: {
      type: String
    },
    fileSize: {
      type: Number
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      index: true
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Document = mongoose.model('Document', documentSchema);
