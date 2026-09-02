import path from 'path';
import { Document } from '../models/Document.js';
import { User } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class UploadController {
  /**
   * POST /api/v1/uploads/profile
   */
  static async uploadProfileImage(req, res, next) {
    try {
      if (!req.file) {
        return errorResponse(res, 'No image file uploaded.', 400, 'NO_FILE');
      }

      const relativePath = `/uploads/profiles/${req.file.filename}`;
      await User.findByIdAndUpdate(req.user._id, { profileImage: relativePath });

      return successResponse(
        res,
        { imageUrl: relativePath },
        'Profile picture uploaded successfully.'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/uploads/document
   * Secure KYC document upload (Driving License, Aadhaar, etc.)
   */
  static async uploadDocument(req, res, next) {
    try {
      if (!req.file) {
        return errorResponse(res, 'No document file uploaded.', 400, 'NO_FILE');
      }

      const { documentType = 'driving_license', documentNumber = '' } = req.body;
      const relativePath = `/uploads/documents/${req.file.filename}`;

      const doc = await Document.create({
        user: req.user._id,
        documentType,
        documentNumber,
        fileUrl: relativePath,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        status: 'pending'
      });

      return successResponse(
        res,
        { document: doc },
        'KYC Document uploaded securely and queued for verification.',
        201
      );
    } catch (error) {
      next(error);
    }
  }
}
