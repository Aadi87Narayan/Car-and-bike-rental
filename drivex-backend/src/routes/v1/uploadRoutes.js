import express from 'express';
import { UploadController } from '../../controllers/uploadController.js';
import { upload } from '../../middleware/uploadMiddleware.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/profile', upload.single('profile'), UploadController.uploadProfileImage);
router.post('/document', upload.single('document'), UploadController.uploadDocument);

export default router;
