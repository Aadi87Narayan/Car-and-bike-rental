import express from 'express';
import { BookingController } from '../../controllers/bookingController.js';
import { createBookingValidator } from '../../validators/bookingValidator.js';
import { validate } from '../../middleware/validationMiddleware.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

router.post('/', createBookingValidator, validate, BookingController.createBooking);
router.get('/', BookingController.getMyBookings);
router.get('/:id', BookingController.getBookingById);
router.patch('/:id/cancel', BookingController.cancelBooking);
router.get('/:id/receipt', BookingController.getBookingReceipt);

export default router;
