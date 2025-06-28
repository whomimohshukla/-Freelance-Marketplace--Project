const express = require('express');
const router = express.Router();
const auth = require('../../Server/middleware/auth.middleware');
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


// router.put('/hiring', auth, clientController.updateHiring);


// router.put('/financials', auth, clientController.updateFinancials);


// router.put('/team', auth, clientController.addTeamMember);


// router.delete('/team/:teamMemberId', auth, clientController.removeTeamMember);


// router.put('/stats', auth, clientController.updateStats);

// router.put('/social-profiles', auth, clientController.updateSocialProfiles);

// router.put('/preferences', auth, clientController.updatePreferences);


// router.put('/payment-methods', auth, clientController.addPaymentMethod);


// router.delete('/payment-methods/:paymentMethodId', auth, clientController.removePaymentMethod);

module.exports = router;
