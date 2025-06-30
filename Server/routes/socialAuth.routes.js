const express = require('express');
const router = express.Router();

// Social authentication controller
const socialAuthController = require('../controllers/userControllers/socialAuth.controller');

// POST /api/auth/github  -> exchange GitHub OAuth code
router.post('/github', socialAuthController.githubAuth);

// POST /api/auth/linkedin -> exchange LinkedIn OAuth code
router.post('/linkedin', socialAuthController.linkedinAuth);

// POST /api/auth/social/complete -> finish sign-up after choosing role
router.post('/social/complete', socialAuthController.completeSocialRegistration);

module.exports = router;
