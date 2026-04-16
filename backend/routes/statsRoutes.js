// backend/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const { getStatsData } = require('../controllers/statsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getStatsData);

module.exports = router;