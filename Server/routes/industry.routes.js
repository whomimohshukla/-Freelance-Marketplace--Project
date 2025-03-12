const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const industryController = require('../controllers/industry.controller');

// @route   GET /api/industries
// @desc    Get all industries with filters
// @access  Public
router.get('/', industryController.getIndustries);

// @route   GET /api/industries/trending
// @desc    Get trending industries
// @access  Public
router.get('/trending', industryController.getTrendingIndustries);

// @route   GET /api/industries/:idOrSlug
// @desc    Get industry by ID or slug
// @access  Public
router.get('/:idOrSlug', industryController.getIndustry);

// @route   POST /api/industries
// @desc    Create new industry
// @access  Private/Admin
router.post('/', [auth, admin], industryController.createIndustry);

// @route   PUT /api/industries/:id
// @desc    Update industry
// @access  Private/Admin
router.put('/:id', [auth, admin], industryController.updateIndustry);

// @route   DELETE /api/industries/:id
// @desc    Delete industry
// @access  Private/Admin
router.delete('/:id', [auth, admin], industryController.deleteIndustry);

// @route   PUT /api/industries/:id/market-stats
// @desc    Update industry market stats
// @access  Private/Admin
router.put('/:id/market-stats', [auth, admin], industryController.updateMarketStats);

// @route   POST /api/industries/:id/trends
// @desc    Add industry trend
// @access  Private/Admin
router.post('/:id/trends', [auth, admin], industryController.addIndustryTrend);

module.exports = router;
