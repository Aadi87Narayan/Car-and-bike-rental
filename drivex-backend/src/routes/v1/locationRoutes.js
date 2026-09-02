import express from 'express';
import { LocationController } from '../../controllers/locationController.js';

const router = express.Router();

router.get('/hubs', LocationController.getHubs);
router.get('/search', LocationController.searchLocations);
router.get('/geocode', LocationController.geocode);
router.get('/reverse-geocode', LocationController.reverseGeocode);
router.post('/route', LocationController.getRoute);

export default router;
