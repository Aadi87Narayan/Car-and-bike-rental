import express from 'express';
import { AdminController } from '../../controllers/adminController.js';
import { vehicleValidator } from '../../validators/vehicleValidator.js';
import { validate } from '../../middleware/validationMiddleware.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { requireAdmin } from '../../middleware/adminMiddleware.js';

const router = express.Router();

// Strict Security: All admin routes REQUIRE authentication + admin role
router.use(authenticate, requireAdmin);

// Dashboard & Analytics
router.get('/dashboard', AdminController.getDashboardStats);
router.get('/revenue', AdminController.getRevenueAnalytics);

// User Management
router.get('/users', AdminController.getAllUsers);

// Fleet Management (CRUD)
router.get('/vehicles', AdminController.getAllVehicles);
router.post('/vehicles', vehicleValidator, validate, AdminController.createVehicle);
router.patch('/vehicles/:id', AdminController.updateVehicle);
router.delete('/vehicles/:id', AdminController.deleteVehicle);

// Booking Management
router.get('/bookings', AdminController.getAllBookings);
router.patch('/bookings/:id/status', AdminController.updateBookingStatus);

export default router;
