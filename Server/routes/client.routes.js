const express = require('express');
const router = express.Router();
const auth = require('../../Server/middleware/auth.middleware');
const clientController = require('../controllers/client.controller');

// @route   GET /api/clients/search
// @desc    Search clients with filters
// @access  Public
router.get('/search', clientController.searchClients);

// @route   GET /api/clients/top
// @desc    Get top rated clients
// @access  Public
router.get('/top', clientController.getTopClients);

// @route   POST /api/clients/profile
// @desc    Create or update client profile
// @access  Private
router.post('/profile', auth, clientController.createOrUpdateProfile);

// @route   GET /api/clients/profile/:userId
// @desc    Get client profile by user ID
// @access  Public
router.get('/profile/:userId', clientController.getProfile);

// @route   PUT /api/clients/company
// @desc    Update company details
// @access  Private
router.put('/company', auth, clientController.updateCompany);

// @route   PUT /api/clients/business-details
// @desc    Update business details
// @access  Private
router.put('/business-details', auth, clientController.updateBusinessDetails);

// @route   PUT /api/clients/hiring
// @desc    Update hiring preferences
// @access  Private
router.put('/hiring', auth, clientController.updateHiring);

// @route   PUT /api/clients/financials
// @desc    Update financial information
// @access  Private
router.put('/financials', auth, clientController.updateFinancials);

// @route   PUT /api/clients/team
// @desc    Add team member
// @access  Private
router.put('/team', auth, clientController.addTeamMember);

// @route   DELETE /api/clients/team/:teamMemberId
// @desc    Remove team member
// @access  Private
router.delete('/team/:teamMemberId', auth, clientController.removeTeamMember);

// @route   PUT /api/clients/stats
// @desc    Update client stats
// @access  Private
router.put('/stats', auth, clientController.updateStats);

// @route   PUT /api/clients/social-profiles
// @desc    Update social profiles
// @access  Private
router.put('/social-profiles', auth, clientController.updateSocialProfiles);

// @route   PUT /api/clients/preferences
// @desc    Update preferences
// @access  Private
router.put('/preferences', auth, clientController.updatePreferences);

// @route   PUT /api/clients/payment-methods
// @desc    Add payment method
// @access  Private
router.put('/payment-methods', auth, clientController.addPaymentMethod);

// @route   DELETE /api/clients/payment-methods/:paymentMethodId
// @desc    Remove payment method
// @access  Private
router.delete('/payment-methods/:paymentMethodId', auth, clientController.removePaymentMethod);

module.exports = router;
