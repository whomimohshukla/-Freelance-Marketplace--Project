// projectController.js
const mongoose = require('mongoose');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const ClientProfile = require('../models/client.model');
const FreelancerProfile = require('../models/freelancerProfile.model');
const Analytics = require('../models/analytics.model');
const { ObjectId } = mongoose.Types;

/**
 * Project Controller
 * Handles all project-related operations
 */
const projectController = {
  /**
   * Create a new project
   * @route POST /api/projects
   * @access Private - Client only
   */
  createProject: async (req, res) => {
    try {
      // Verify user is a client
      if (req.user.role !== 'client') {
        return res.status(403).json({
          success: false,
          error: 'Only clients can create projects'
        });
      }

      // Create project with client ID
      const projectData = {
        ...req.body,
        client: req.user.id,
        status: req.body.status || 'Draft'
      };

      // Create new project
      const newProject = await Project.create(projectData);

      // Update client profile to add project to active projects
      if (newProject.status === 'Open') {
        await ClientProfile.findOneAndUpdate(
          { user: req.user.id },
          { 
            $push: { 'projects.active': newProject._id },
            $inc: { 'stats.activeProjects': 1, 'stats.totalProjects': 1 }
          }
        );
      }

      // Track analytics
      await Analytics.create({
        user: req.user.id,
        type: 'Project View',
        data: {
          action: 'create',
          page: 'project-creation',
          source: req.headers.referer || 'direct'
        }
      });

      return res.status(201).json({
        success: true,
        data: newProject
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Get all projects with filtering and pagination
   * @route GET /api/projects
   * @access Public
   */
  getAllProjects: async (req, res) => {
    try {
      const {
        status = 'Open',
        category,
        skills,
        budget,
        duration,
        page = 1,
        limit = 10,
        sort = '-createdAt'
      } = req.query;

      // Build query
      const query = { status };

      // Filter by category
      if (category) {
        if (!ObjectId.isValid(category)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid category ID format'
          });
        }
        query.category = new ObjectId(category);
      }

      // Filter by skills
      if (skills) {
        const skillIds = skills.split(',');
        if (skillIds.some(id => !ObjectId.isValid(id))) {
          return res.status(400).json({
            success: false,
            error: 'Invalid skill ID format'
          });
        }
        query['skills.skill'] = { $in: skillIds.map(id => new ObjectId(id)) };
      }

      // Filter by budget range
      if (budget) {
        const [min, max] = budget.split('-').map(Number);
        if (min) query['budget.minAmount'] = { $gte: min };
        if (max) query['budget.maxAmount'] = { $lte: max };
      }

      // Filter by duration
      if (duration) {
        query.duration = duration;
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const projects = await Project.find(query)
        .populate('client', 'firstName lastName avatar')
        .populate('category', 'name')
        .populate('skills.skill', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sort);

      // Get total count for pagination
      const total = await Project.countDocuments(query);

      // Track analytics for search if user is logged in
      if (req.user) {
        await Analytics.create({
          user: req.user.id,
          type: 'Search',
          data: {
            page: 'projects',
            action: 'search',
            source: req.headers.referer || 'direct'
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          projects,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Get project by ID
   * @route GET /api/projects/:id
   * @access Public
   */
  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid project ID format'
        });
      }

      // Find project and populate references
      const project = await Project.findById(id)
        .populate('client', 'firstName lastName email avatar')
        .populate('clientCompany', 'company')
        .populate('category', 'name')
        .populate('skills.skill', 'name category')
        .populate('selectedFreelancer', 'firstName lastName avatar')
        .populate({
          path: 'proposals.freelancer',
          select: 'firstName lastName avatar'
        })
        .populate({
          path: 'proposals.freelancerProfile',
          select: 'title hourlyRate rating'
        })
        .populate({
          path: 'milestones.tasks',
          select: 'title description status'
        })
        .populate({
          path: 'milestones.payment',
          select: 'amount status'
        });

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Increment view count
      await Project.findByIdAndUpdate(id, {
        $inc: { 'metrics.views': 1 }
      });

      // Track analytics if user is logged in
      if (req.user) {
        await Analytics.create({
          user: req.user.id,
          type: 'Project View',
          data: {
            page: `project-${id}`,
            action: 'view',
            source: req.headers.referer || 'direct'
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Update project
   * @route PUT /api/projects/:id
   * @access Private - Project owner or admin
   */
  updateProject: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid project ID format'
        });
      }

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Check ownership
      if (project.client.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this project'
        });
      }

      // Handle status change
      const oldStatus = project.status;
      const newStatus = req.body.status || oldStatus;

      // Update project
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      // Update client profile if status changed
      if (oldStatus !== newStatus) {
        const clientProfile = await ClientProfile.findOne({ user: project.client });
        
        if (clientProfile) {
          // Handle status transitions
          if (oldStatus === 'Draft' && newStatus === 'Open') {
            await ClientProfile.findOneAndUpdate(
              { user: project.client },
              { 
                $push: { 'projects.active': project._id },
                $inc: { 'stats.activeProjects': 1, 'stats.totalProjects': 1 }
              }
            );
          } else if (oldStatus === 'Open' && newStatus === 'Cancelled') {
            await ClientProfile.findOneAndUpdate(
              { user: project.client },
              { 
                $pull: { 'projects.active': project._id },
                $push: { 'projects.cancelled': project._id },
                $inc: { 'stats.activeProjects': -1 }
              }
            );
          } else if (oldStatus !== 'Completed' && newStatus === 'Completed') {
            await ClientProfile.findOneAndUpdate(
              { user: project.client },
              { 
                $pull: { 'projects.active': project._id },
                $push: { 'projects.completed': project._id },
                $inc: { 'stats.activeProjects': -1, 'stats.completedProjects': 1 }
              }
            );
            
            // Update freelancer stats if applicable
            if (project.selectedFreelancer) {
              await FreelancerProfile.findOneAndUpdate(
                { user: project.selectedFreelancer },
                { 
                  $inc: { 
                    'stats.completedProjects': 1,
                    'stats.ongoingProjects': -1
                  }
                }
              );
            }
          }
        }
      }

      return res.status(200).json({
        success: true,
        data: updatedProject
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Delete project
   * @route DELETE /api/projects/:id
   * @access Private - Project owner or admin
   */
  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid project ID format'
        });
      }

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Check ownership
      if (project.client.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this project'
        });
      }

      // Only allow deletion of Draft projects
      if (project.status !== 'Draft') {
        return res.status(400).json({
          success: false,
          error: 'Only draft projects can be deleted. Please cancel the project instead.'
        });
      }

      // Delete project
      await Project.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Get client's projects
   * @route GET /api/projects/client
   * @access Private - Client only
   */
  getClientProjects: async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      // Build query
      const query = { client: req.user.id };

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const projects = await Project.find(query)
        .populate('category', 'name')
        .populate('skills.skill', 'name')
        .populate('selectedFreelancer', 'firstName lastName avatar')
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-createdAt');

      // Get total count for pagination
      const total = await Project.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: {
          projects,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Get freelancer's projects
   * @route GET /api/projects/freelancer
   * @access Private - Freelancer only
   */
  getFreelancerProjects: async (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;

      // Build query
      const query = { selectedFreelancer: req.user.id };

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const projects = await Project.find(query)
        .populate('client', 'firstName lastName avatar')
        .populate('category', 'name')
        .populate('skills.skill', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-createdAt');

      // Get total count for pagination
      const total = await Project.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: {
          projects,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Submit proposal for a project
   * @route POST /api/projects/:id/proposals
   * @access Private - Freelancer only
   */
  submitProposal: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid project ID format'
        });
      }

      // Validate user is a freelancer
      if (req.user.role !== 'freelancer') {
        return res.status(403).json({
          success: false,
          error: 'Only freelancers can submit proposals'
        });
      }

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Check if project is open for proposals
      if (project.status !== 'Open') {
        return res.status(400).json({
          success: false,
          error: 'Project is not open for proposals'
        });
      }

      // Check if freelancer already submitted a proposal
      const existingProposal = project.proposals.find(
        p => p.freelancer.toString() === req.user.id
      );

      if (existingProposal) {
        return res.status(400).json({
          success: false,
          error: 'You have already submitted a proposal for this project'
        });
      }

      // Get freelancer profile
      const freelancerProfile = await FreelancerProfile.findOne({ user: req.user.id });

      if (!freelancerProfile) {
        return res.status(400).json({
          success: false,
          error: 'You must complete your freelancer profile before submitting proposals'
        });
      }

      // Create proposal object
      const proposal = {
        freelancer: req.user.id,
        freelancerProfile: freelancerProfile._id,
        coverLetter: req.body.coverLetter,
        proposedAmount: req.body.proposedAmount,
        estimatedDuration: req.body.estimatedDuration,
        attachments: req.body.attachments || []
      };

      // Add proposal to project
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { 
          $push: { proposals: proposal },
          $inc: { 'metrics.proposals': 1 }
        },
        { new: true }
      );

      // Track analytics
      await Analytics.create({
        user: req.user.id,
        type: 'Proposal',
        data: {
          action: 'submit',
          page: `project-${id}`,
          source: req.headers.referer || 'direct'
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedProject.proposals[updatedProject.proposals.length - 1]
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Update proposal status
   * @route PUT /api/projects/:id/proposals/:proposalId
   * @access Private - Client only
   */
  updateProposalStatus: async (req, res) => {
    try {
      const { id, proposalId } = req.params;
      const { status } = req.body;

      // Validate ObjectIds
      if (!ObjectId.isValid(id) || !ObjectId.isValid(proposalId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ID format'
        });
      }

      // Validate status
      const validStatuses = ["Pending", "Shortlisted", "Accepted", "Rejected", "Withdrawn"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Check ownership
      if (project.client.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update proposals for this project'
        });
      }

      // Find proposal
      const proposalIndex = project.proposals.findIndex(
        p => p._id.toString() === proposalId
      );

      if (proposalIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Proposal not found'
        });
      }

      // Handle accepting a proposal
      if (status === 'Accepted') {
        // Check if project already has a selected freelancer
        if (project.selectedFreelancer) {
          return res.status(400).json({
            success: false,
            error: 'A freelancer has already been selected for this project'
          });
        }

        // Get freelancer from proposal
        const freelancerId = project.proposals[proposalIndex].freelancer;

        // Update project status and select freelancer
        await Project.findByIdAndUpdate(id, {
          $set: {
            status: 'In Progress',
            selectedFreelancer: freelancerId,
            'proposals.$[elem].status': 'Rejected'
          }
        }, {
          arrayFilters: [{ 'elem._id': { $ne: new ObjectId(proposalId) } }]
        });

        // Update freelancer stats
        await FreelancerProfile.findOneAndUpdate(
          { user: freelancerId },
          { $inc: { 'stats.ongoingProjects': 1 } }
        );
      }

      // Update proposal status
      const updatedProject = await Project.findOneAndUpdate(
        { _id: id, 'proposals._id': proposalId },
        { $set: { 'proposals.$.status': status } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        data: updatedProject.proposals.find(p => p._id.toString() === proposalId)
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Withdraw proposal
   * @route DELETE /api/projects/:id/proposals/:proposalId
   * @access Private - Proposal owner only
   */
  withdrawProposal: async (req, res) => {
    try {
      const { id, proposalId } = req.params;

      // Validate ObjectIds
      if (!ObjectId.isValid(id) || !ObjectId.isValid(proposalId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ID format'
        });
      }

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Find proposal
      const proposal = project.proposals.find(
        p => p._id.toString() === proposalId
      );

      if (!proposal) {
        return res.status(404).json({
          success: false,
          error: 'Proposal not found'
        });
      }

      // Check ownership
      if (proposal.freelancer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to withdraw this proposal'
        });
      }

      // Check if proposal can be withdrawn
      if (proposal.status === 'Accepted') {
        return res.status(400).json({
          success: false,
          error: 'Cannot withdraw an accepted proposal'
        });
      }

      // Update proposal status to withdrawn
      const updatedProject = await Project.findOneAndUpdate(
        { _id: id, 'proposals._id': proposalId },
        { $set: { 'proposals.$.status': 'Withdrawn' } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Add milestone to project
   * @route POST /api/projects/:id/milestones
   * @access Private - Project owner only
   */
  addMilestone: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid project ID format'
        });
      }

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Check ownership
      if (project.client.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to add milestones to this project'
        });
      }

      // Create milestone object
      const milestone = {
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        dueDate: req.body.dueDate,
        status: 'Pending',
        tasks: []
      };

      // Add milestone to project
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { $push: { milestones: milestone } },
        { new: true }
      );

      // Update project budget pending amount
      await Project.findByIdAndUpdate(id, {
        $inc: { 'budget.pending': milestone.amount }
      });

      return res.status(200).json({
        success: true,
        data: updatedProject.milestones[updatedProject.milestones.length - 1]
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Update milestone status
   * @route PUT /api/projects/:id/milestones/:milestoneId
   * @access Private - Project owner or freelancer
   */
  updateMilestoneStatus: async (req, res) => {
    try {
      const { id, milestoneId } = req.params;
      const { status } = req.body;

      // Validate ObjectIds
      if (!ObjectId.isValid(id) || !ObjectId.isValid(milestoneId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid ID format'
        });
      }

      // Validate status
      const validStatuses = ["Pending", "In Progress", "Completed", "Approved", "Disputed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Check authorization
      const isClient = project.client.toString() === req.user.id;
      const isFreelancer = project.selectedFreelancer && 
                          project.selectedFreelancer.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';

      if (!isClient && !isFreelancer && !isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update milestones for this project'
        });
      }

      // Find milestone
      const milestoneIndex = project.milestones.findIndex(
        m => m._id.toString() === milestoneId
      );

      if (milestoneIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Milestone not found'
        });
      }

      // Check status transition permissions
      const currentStatus = project.milestones[milestoneIndex].status;

      // Only freelancer can mark as completed
      if (status === 'Completed' && !isFreelancer && !isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Only the assigned freelancer can mark a milestone as completed'
        });
      }

      // Only client can approve
      if (status === 'Approved' && !isClient && !isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Only the client can approve a milestone'
        });
      }

      // Update milestone status
      const updatedProject = await Project.findOneAndUpdate(
        { _id: id, 'milestones._id': milestoneId },
        { $set: { 'milestones.$.status': status } },
        { new: true }
      );

      // Update project progress
      await updatedProject.updateProgress();

      return res.status(200).json({
        success: true,
        data: updatedProject.milestones.find(m => m._id.toString() === milestoneId)
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Add attachment to project
   * @route POST /api/projects/:id/attachments
   * @access Private - Project participants only
   */
  addAttachment: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid project ID format'
        });
      }

      // Find project
      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      // Check authorization
      const isClient = project.client.toString() === req.user.id;
      const isFreelancer = project.selectedFreelancer && 
                          project.selectedFreelancer.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';

      if (!isClient && !isFreelancer && !isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to add attachments to this project'
        });
      }

      // Create attachment object
      const attachment = {
        name: req.body.name,
        url: req.body.url,
        type: req.body.type,
        size: req.body.size,
        uploadedBy: req.user.id,
        uploadedAt: new Date()
      };

      // Add attachment to project
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { $push: { attachments: attachment } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        data: updatedProject.attachments[updatedProject.attachments.length - 1]
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * Get similar projects
   * @route GET /api/projects/:id/similar
   * @access Public
   */
  getSimilarProjects: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid project ID format'
        });
      }

      // Find similar projects
      const similarProjects = await Project.findSimilar(id);

      return res.status(200).json({