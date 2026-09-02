import express from 'express';
import { FavoriteController } from '../../controllers/favoriteController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', FavoriteController.getFavorites);
router.post('/:vehicleId', FavoriteController.addFavorite);
router.delete('/:vehicleId', FavoriteController.removeFavorite);

export default router;
