const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const freelancerController = require('../controllers/core-Project/freelancer/freelancerProfile.controller');


// freelancers
// @route   POST /api/freelancers/profile
// @desc    Create or update freelancer profile
// @access  Private
router.post('/profile', auth, freelancerController.createOrUpdateProfile);

// @route   GET /api/freelancers/profile
// @desc    Get current authenticated freelancer profile
// @access  Private
router.get('/profile', auth, freelancerController.getMyProfile);

// @route   GET /api/freelancers/profile/:userId
// @desc    Get freelancer profile by user ID
// @access  Public
router.get('/profile/:userId', freelancerController.getProfile);

// @route   PUT /api/freelancers/portfolio
// @desc    Add portfolio item
// @access  Private
router.put('/portfolio', auth, freelancerController.updatePortfolio);

// @route   DELETE /api/freelancers/portfolio/:portfolioId
// @desc    Delete portfolio item
// @access  Private
router.delete('/portfolio/:portfolioId', auth, freelancerController.deletePortfolioItem);

// @route   PUT /api/freelancers/skills
// @desc    Update skills
// @access  Private
router.put('/skills', auth, freelancerController.updateSkills);

// @route   PUT /api/freelancers/work-experience
// @desc    Add work experience
// @access  Private
router.put('/work-experience', auth, freelancerController.updateWorkExperience);

// @route   PUT /api/freelancers/education
// @desc    Add education
// @access  Private
router.put('/education', auth, freelancerController.updateEducation);

// @route   PUT /api/freelancers/certifications
// @desc    Add certification
// @access  Private
router.put('/certifications', auth, freelancerController.updateCertifications);

// @route   PUT /api/freelancers/availability
// @desc    Update availability status
// @access  Private
router.put('/availability', auth, freelancerController.updateAvailability);

// @route   GET /api/freelancers/search
// @desc    Search freelancers with filters
// @access  Public
router.get('/search', freelancerController.getFreelancerProfile);

// @route   PUT /api/freelancers/stats
// @desc    Update freelancer stats
// @access  Private
router.put('/stats', auth, freelancerController.updateStats);

// @route   PUT /api/freelancers/social
// @desc    Update social profiles
// @access  Private
router.put('/social', auth, freelancerController.updateSocialProfiles);

// @route   GET /api/freelancers/top-rated
// @desc    Get top rated freelancers
// @access  Public
router.get('/top-rated', freelancerController.getTopRatedFreelancers);

module.exports = router;
