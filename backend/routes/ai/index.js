const express = require('express');
const router = express.Router();

// Import all AI feature routes
const matchingRoutes = require('./matching');
const pricingRoutes = require('./pricing');
const profileRoutes = require('./profile');

// Mount routes
router.use('/matching', matchingRoutes);
router.use('/pricing', pricingRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
