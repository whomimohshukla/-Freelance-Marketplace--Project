const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const clientController = require("../controllers/core-Project/client-Freelancing/client.controller");
const isClient  = require('../middleware/auth.middleware');




router.get('/search', clientController.searchClients);


router.get('/top', clientController.getTopClients);


router.post('/profile', auth,isClient, clientController.createOrUpdateProfile);

// Get current authenticated client profile
router.get('/profile', auth, clientController.getProfile);

router.get('/profile/:userId', auth, clientController.getProfile);

router.put('/company', auth, clientController.updateCompany);


router.put('/business-details', auth, clientController.updateBusinessDetails);


// Hiring preferences endpoint could go here if implemented later


// Financials
router.put('/financials', auth, clientController.updateFinancials);


// Team management
router.put('/team', auth, clientController.addTeamMember);


router.delete('/team/:memberId', auth, clientController.removeTeamMember);

// Search users to invite to team (by email/name)
router.get('/team/search', auth, clientController.searchTeamUsers);


// Stats (optional)
router.put('/stats', auth, clientController.updateStats);

router.put('/social-profiles', auth, clientController.updateSocialProfiles);

// router.put('/preferences', auth, clientController.updatePreferences);
router.put('/preferences', auth, clientController.updatePreferences);


// Payment methods
router.put('/payment-methods', auth, clientController.addPaymentMethod);
router.delete('/payment-methods/:methodId', auth, clientController.removePaymentMethod);

module.exports = router;
