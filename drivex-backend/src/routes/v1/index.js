import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import locationRoutes from './locationRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import userRoutes from './userRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import adminRoutes from './adminRoutes.js';
import { successResponse } from '../../utils/response.js';

const router = express.Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return successResponse(res, {
    status: 'healthy',
    database: dbStatus,
    service: 'DriveX India Rental REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Route Modules
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/locations', locationRoutes);
router.use('/payments', paymentRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/users', userRoutes);
router.use('/uploads', uploadRoutes);
router.use('/admin', adminRoutes);

export default router;
