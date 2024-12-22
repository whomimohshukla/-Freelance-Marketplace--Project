const express = require('express');
const router = express.Router();
const pricingController = require('../../controllers/ai/pricingController');
const auth = require('../../middleware/auth');

// Get price suggestion for a project
router.post('/suggest', auth, pricingController.suggestPrice);

// Get market rates for a category
router.get('/market-rates/:category', auth, pricingController.getMarketRates);

// Update market rates (admin only)
router.put('/market-rates/:category', auth, pricingController.updateMarketRates);

module.exports = router;
