const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const hireController = require('../controllers/core-Project/hire/hire.controller');

// @route   POST /api/v1/hire/invite
// @desc    Send hire invitation to freelancer
// @access  Private (Client)
router.post('/invite', auth, hireController.sendHireInvitation);

// @route   GET /api/v1/hire/sent
// @desc    Get client's sent invitations
// @access  Private (Client)
router.get('/sent', auth, hireController.getSentInvitations);

// @route   GET /api/v1/hire/received
// @desc    Get freelancer's received invitations
// @access  Private (Freelancer)
router.get('/received', auth, hireController.getReceivedInvitations);

// @route   GET /api/v1/hire/invitation/:invitationId
// @desc    Get invitation details
// @access  Private
router.get('/invitation/:invitationId', auth, hireController.getInvitationDetails);

// @route   PUT /api/v1/hire/respond/:invitationId
// @desc    Respond to hire invitation (Accept/Reject)
// @access  Private (Freelancer)
router.put('/respond/:invitationId', auth, hireController.respondToInvitation);

// @route   DELETE /api/v1/hire/cancel/:invitationId
// @desc    Cancel hire invitation
// @access  Private (Client)
router.delete('/cancel/:invitationId', auth, hireController.cancelInvitation);

module.exports = router;
