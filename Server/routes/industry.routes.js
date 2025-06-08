const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
// const admin = require('../../middleware/admin');
const industryController = require('../controllers/core-Project/Industry(category)/industry.controller');

// Parent Industry Routes
// @route   GET /api/industries/parents
// @desc    Get all parent industries
// @access  Public
router.get('/parents', industryController.getParentIndustries);

// @route   GET /api/industries/parents/:idOrSlug
// @desc    Get parent industry by ID or slug
// @access  Public
router.get('/parents/:idOrSlug', industryController.getParentIndustry);

// @route   POST /api/industries/parents
// @desc    Create new parent industry
// @access  Private/Admin
router.post('/parents', auth, industryController.createParentIndustry);

// @route   PUT /api/industries/parents/:id
// @desc    Update parent industry
// @access  Private/Admin
router.put('/parents/:id', auth, industryController.updateParentIndustry);

// @route   DELETE /api/industries/parents/:id
// @desc    Delete parent industry
// @access  Private/Admin
router.delete('/parents/:id', auth, industryController.deleteParentIndustry);

// Child Industry Routes
// @route   GET /api/industries/:parentId/children
// @desc    Get all child industries for a parent
// @access  Public
router.get('/:parentId/children', industryController.getChildIndustries);

// @route   PUT /api/industries/:id/parent
// @desc    Set parent for an industry
// @access  Private/Admin
router.put('/:id/parent', auth, industryController.setParentIndustry);

// General Industry Routes
// @route   GET /api/industries
// @desc    Get all industries with filters
// @access  Public
router.get('/', industryController.getIndustries);

// @route   GET /api/industries/trending
// @desc    Get trending industries
// @access  Public
router.get('/trending', industryController.getTrendingIndustries);

// @route   GET /api/industries/:id/hierarchy
// @desc    Get industry hierarchy (ancestors and children)
// @access  Public
router.get('/:id/hierarchy', industryController.getIndustryHierarchy);

// @route   GET /api/industries/:idOrSlug
// @desc    Get industry by ID or slug
// @access  Public
router.get('/:idOrSlug', industryController.getIndustry);

// @route   POST /api/industries
// @desc    Create new industry
// @access  Private/Admin
router.post('/', auth, industryController.createIndustry);

// @route   PUT /api/industries/:id
// @desc    Update industry
// @access  Private/Admin
router.put('/:id', auth, industryController.updateIndustry);

// @route   DELETE /api/industries/:id
// @desc    Delete industry
// @access  Private/Admin
router.delete('/:id', auth, industryController.deleteIndustry);

// Industry Features Routes
// @route   PUT /api/industries/:id/market-stats
// @desc    Update industry market stats
// @access  Private/Admin
router.put('/:id/market-stats', auth, industryController.updateMarketStats);

// @route   POST /api/industries/:id/trends
// @desc    Add industry trend
// @access  Private/Admin
router.post('/:id/trends', auth, industryController.addIndustryTrend);

module.exports = router;
