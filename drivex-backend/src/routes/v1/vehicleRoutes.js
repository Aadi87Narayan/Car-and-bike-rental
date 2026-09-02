import express from 'express';
import { VehicleController } from '../../controllers/vehicleController.js';
import { ReviewController } from '../../controllers/reviewController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public Vehicle Browsing & Search
router.get('/', VehicleController.getVehicles);
router.get('/search', VehicleController.searchVehicles);
router.get('/nearby', VehicleController.getNearbyVehicles);
router.get('/:id', VehicleController.getVehicleById);

// Reviews for a vehicle
router.get('/:vehicleId/reviews', ReviewController.getVehicleReviews);
router.post('/:vehicleId/reviews', authenticate, ReviewController.addReview);

export default router;
