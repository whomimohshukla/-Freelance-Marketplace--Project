const express = require('express');
const router = express.Router();
const auth  = require('../middleware/auth.middleware')
const {
    createTeam,
    searchTeams,
    getTeamById,
    updateTeam,
    addTeamMember,
    removeTeamMember,
    addTeamProject,
    updateMemberStatus,
    addTeamReview,
    deleteTeam,
    updateTeamProject,
    updateTeamSkills,
    updateTeamAvailability,
    updateTeamCommunication,
    addTeamDocument,
    removeTeamDocument, updateTeamBilling
} = require('../controllers/core-Project/teamMembers/team.Controller');

// Public routes
router.get('/search', searchTeams);
router.get('/:id', getTeamById);

// Protected routes (require authentication)
router.use(auth);

// Team CRUD
router.post('/', createTeam);
router.route('/:id')
    .put(updateTeam)
    .delete(deleteTeam);

// Member management
router.route('/:id/members')
    .post(addTeamMember)
    .delete(removeTeamMember);
router.patch('/:id/members/status', updateMemberStatus);

// Project management
router.post('/:id/projects', addTeamProject);
router.patch('/:id/projects/:projectId', updateTeamProject);

// Reviews
router.post('/:id/reviews', addTeamReview);

// Skills management
router.patch('/:id/skills', updateTeamSkills);

// Availability management
router.patch('/:id/availability', updateTeamAvailability);

// Communication settings
router.patch('/:id/communication', updateTeamCommunication);

// // Document management
router.route('/:id/documents')
    .post(addTeamDocument)
    .delete(removeTeamDocument);

// // Billing management
router.patch('/:id/billing', updateTeamBilling);

module.exports = router;