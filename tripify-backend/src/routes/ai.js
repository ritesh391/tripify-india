const express = require('express');
const router = express.Router();
const { createItinerary, chat, transport, timing, live, insights,  marketplace } = require('../controllers/aiController');

router.post('/itinerary', createItinerary);
router.post('/chat', chat);
router.post('/transport', transport);
router.post('/timing', timing);
router.post('/live', live);
router.post('/insights', insights);
router.post('/marketplace', marketplace);
module.exports = router;