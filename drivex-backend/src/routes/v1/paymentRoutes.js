import express from 'express';
import { PaymentController } from '../../controllers/paymentController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', authenticate, PaymentController.createOrder);
router.post('/verify', authenticate, PaymentController.verifyPayment);
router.post('/webhook', PaymentController.webhook);

export default router;
