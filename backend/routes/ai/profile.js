const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/ai/profileController');
const auth = require('../../middleware/auth');

// Analyze and enhance profile
router.get('/analyze/:userId', auth, profileController.analyzeProfile);

// Get profile suggestions
router.get('/suggestions/:userId', auth, profileController.getProfileSuggestions);

// Update suggestion status
router.put('/suggestions/:userId/:suggestionId', auth, profileController.updateSuggestionStatus);

module.exports = router;
