import express from 'express';
import { UserController } from '../../controllers/userController.js';
import { updateProfileValidator, changePasswordValidator } from '../../validators/userValidator.js';
import { validate } from '../../middleware/validationMiddleware.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/me', UserController.getProfile);
router.patch('/me', updateProfileValidator, validate, UserController.updateProfile);
router.patch('/me/password', changePasswordValidator, validate, UserController.changePassword);

export default router;
