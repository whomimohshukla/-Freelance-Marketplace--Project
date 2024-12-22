const express = require('express');
const router = express.Router();
const matchingController = require('../../controllers/ai/matchingController');
const auth = require('../../middleware/auth');

// Get matches for a project
router.get('/project/:projectId', auth, matchingController.findMatches);

// Get specific match details
router.get('/match/:matchId', auth, matchingController.getMatchDetails);

// Update match score
router.put('/match/:matchId', auth, matchingController.updateMatchScore);

module.exports = router;
