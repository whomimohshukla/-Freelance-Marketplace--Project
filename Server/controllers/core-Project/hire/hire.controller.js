const mongoose = require('mongoose');
const ProjectInvitation = require('../../../models/projectInvitation.model');
const FreelancerProfile = require('../../../models/freelancer.model');
const User = require('../../../models/user.model');
const Project = require('../../../models/project.model');
const emailService = require('../../../utils/emailServices');

/**
 * @desc    Send hire invitation to freelancer
 * @route   POST /api/v1/hire/invite
 * @access  Private (Client only)
 */
exports.sendHireInvitation = async (req, res) => {
  try {
    const clientId = req.user.id;
    const {
      freelancerId,
      title,
      description,
      budgetType,
      budgetAmount,
      duration,
      startDate,
      skills,
      message,
    } = req.body;

    // Validate required fields
    if (!freelancerId || !title || !description || !budgetType || !budgetAmount || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: freelancerId, title, description, budgetType, budgetAmount, duration',
      });
    }

    // Validate freelancer exists and has profile
    const freelancer = await User.findById(freelancerId);
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        error: 'Freelancer not found',
      });
    }

    const freelancerProfile = await FreelancerProfile.findOne({ user: freelancerId });
    if (!freelancerProfile) {
      return res.status(404).json({
        success: false,
        error: 'Freelancer profile not found',
      });
    }

    // Check for existing pending invitation
    const existingInvitation = await ProjectInvitation.findOne({
      client: clientId,
      freelancer: freelancerId,
      status: 'Pending',
    });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        error: 'You already have a pending invitation to this freelancer',
      });
    }

    // Create invitation
    const invitation = await ProjectInvitation.create({
      client: clientId,
      freelancer: freelancerId,
      freelancerProfile: freelancerProfile._id,
      title,
      description,
      budget: {
        type: budgetType,
        amount: budgetAmount,
      },
      duration,
      startDate: startDate || null,
      skills: skills || [],
      clientMessage: message || '',
    });

    // Populate for response
    await invitation.populate([
      { path: 'client', select: 'firstName lastName email avatar' },
      { path: 'freelancer', select: 'firstName lastName email avatar' },
    ]);

    // Send email notification to freelancer
    try {
      const freelancerName = `${invitation.freelancer.firstName} ${invitation.freelancer.lastName}`;
      const clientName = `${invitation.client.firstName} ${invitation.client.lastName}`;
      const invitationUrl = `${process.env.FRONTEND_URL}/dashboard/invitations/${invitation._id}`;
      
      await emailService.sendHireInvitationEmail(invitation.freelancer.email, {
        freelancerName,
        clientName,
        projectTitle: invitation.title,
        projectDescription: invitation.description,
        budgetType: invitation.budget.type,
        budgetAmount: invitation.budget.amount,
        duration: invitation.duration,
        startDate: invitation.startDate,
        skills: invitation.skills,
        clientMessage: invitation.clientMessage,
        invitationUrl,
      });
      console.log('✅ Hire invitation email sent to:', invitation.freelancer.email);
    } catch (emailError) {
      console.error('❌ Failed to send invitation email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return res.status(201).json({
      success: true,
      data: invitation,
      message: 'Hire invitation sent successfully',
    });
  } catch (error) {
    console.error('Send hire invitation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send hire invitation',
    });
  }
};

/**
 * @desc    Get client's sent invitations
 * @route   GET /api/v1/hire/sent
 * @access  Private (Client)
 */
exports.getSentInvitations = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { client: clientId };
    if (status) query.status = status;

    const invitations = await ProjectInvitation.find(query)
      .populate('freelancer', 'firstName lastName email avatar')
      .populate('freelancerProfile', 'title rating hourlyRate')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ProjectInvitation.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: invitations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get sent invitations error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get invitations',
    });
  }
};

/**
 * @desc    Get freelancer's received invitations
 * @route   GET /api/v1/hire/received
 * @access  Private (Freelancer)
 */
exports.getReceivedInvitations = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { freelancer: freelancerId };
    if (status) query.status = status;

    const invitations = await ProjectInvitation.find(query)
      .populate('client', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ProjectInvitation.countDocuments(query);

    // Mark as viewed
    await ProjectInvitation.updateMany(
      { freelancer: freelancerId, viewedAt: null },
      { viewedAt: new Date() }
    );

    return res.status(200).json({
      success: true,
      data: invitations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get received invitations error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get invitations',
    });
  }
};

/**
 * @desc    Respond to hire invitation (Accept/Reject)
 * @route   PUT /api/v1/hire/respond/:invitationId
 * @access  Private (Freelancer)
 */
exports.respondToInvitation = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const { invitationId } = req.params;
    const { status, response } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either Accepted or Rejected',
      });
    }

    const invitation = await ProjectInvitation.findOne({
      _id: invitationId,
      freelancer: freelancerId,
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found',
      });
    }

    if (invitation.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        error: 'This invitation has already been responded to',
      });
    }

    // Check if expired
    await invitation.checkExpiry();
    if (invitation.status === 'Expired') {
      return res.status(400).json({
        success: false,
        error: 'This invitation has expired',
      });
    }

    // Update invitation
    invitation.status = status;
    invitation.freelancerResponse = response || '';
    invitation.respondedAt = new Date();

    // If accepted, create project
    if (status === 'Accepted') {
      const project = await Project.create({
        client: invitation.client,
        title: invitation.title,
        description: invitation.description,
        budget: {
          type: invitation.budget.type,
          currency: invitation.budget.currency,
          minAmount: invitation.budget.amount,
          maxAmount: invitation.budget.amount,
        },
        duration: invitation.duration,
        status: 'In Progress',
        selectedFreelancer: freelancerId,
        startDate: invitation.startDate || new Date(),
        // Default Industry - should be updated later
        Industry: new mongoose.Types.ObjectId(), // Placeholder
      });

      invitation.project = project._id;
      
      // TODO: Send notification to client
    }

    await invitation.save();
    await invitation.populate([
      { path: 'client', select: 'firstName lastName email avatar' },
      { path: 'project' },
    ]);

    return res.status(200).json({
      success: true,
      data: invitation,
      message: `Invitation ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error('Respond to invitation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to respond to invitation',
    });
  }
};

/**
 * @desc    Cancel hire invitation
 * @route   DELETE /api/v1/hire/cancel/:invitationId
 * @access  Private (Client)
 */
exports.cancelInvitation = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { invitationId } = req.params;

    const invitation = await ProjectInvitation.findOne({
      _id: invitationId,
      client: clientId,
    });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found',
      });
    }

    if (invitation.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        error: 'Only pending invitations can be cancelled',
      });
    }

    invitation.status = 'Cancelled';
    await invitation.save();

    return res.status(200).json({
      success: true,
      message: 'Invitation cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel invitation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to cancel invitation',
    });
  }
};

/**
 * @desc    Get invitation details
 * @route   GET /api/v1/hire/invitation/:invitationId
 * @access  Private
 */
exports.getInvitationDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { invitationId } = req.params;

    const invitation = await ProjectInvitation.findById(invitationId)
      .populate('client', 'firstName lastName email avatar')
      .populate('freelancer', 'firstName lastName email avatar')
      .populate('freelancerProfile', 'title rating hourlyRate skills')
      .populate('project');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found',
      });
    }

    // Check if user is authorized (client or freelancer)
    if (
      invitation.client._id.toString() !== userId &&
      invitation.freelancer._id.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this invitation',
      });
    }

    return res.status(200).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('Get invitation details error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get invitation details',
    });
  }
};
