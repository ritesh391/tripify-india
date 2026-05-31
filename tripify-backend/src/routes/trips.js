const express = require('express');
const router = express.Router();
const { createTrip, getMyTrips, getTripById, deleteTrip } = require('../controllers/tripController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createTrip);
router.get('/', authMiddleware, getMyTrips);
router.get('/:id', authMiddleware, getTripById);
router.delete('/:id', authMiddleware, deleteTrip);

module.exports = router;