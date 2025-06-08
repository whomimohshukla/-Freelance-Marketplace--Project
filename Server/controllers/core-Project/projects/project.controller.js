
const Project = require("../../../models/project.model");
const User = require("../../../models/user.model");
const IndustryData = require("../../../models/industry.model");
const Skill = require("../../../models/skills.model");

const FreelancerProfile = require("../../../models/freelancer.model");
const ClientProfile = require("../../../models/client.model");
const Team = require("../../../models/teams.model");
const Review = require("../../../models/review.model");
const Analytics = require("../../../models/analytics.model");
const mongoose = require("mongoose");

/**
 * CREATE PROJECT - Client creates a new project
 * Features: Basic project info, skills requirements, budget, timeline
 */

exports.createProject = async (req, res) => {
	try {
		const {
			title,
			description,
			Industry,
			skills,
			budget,
			duration,
			startDate,
			endDate,
			attachments,
		} = req.body;

		// Validate required fields
		if (
			!title ||
			!description ||
			!Industry ||
			!skills ||
			!budget ||
			!duration
		) {
			return res.status(400).json({
				success: false,
				error: "Missing required fields",
			});
		}

		// Validate skills array
		if (!Array.isArray(skills) || skills.length === 0) {
			return res.status(400).json({
				success: false,
				error: "Skills must be a non-empty array",
			});
		}

		const clientId = req.user.id;

		// Validate the client id
		const client = await User.findById(clientId);
		if (!client || client.role !== "client") {
			return res
				.status(403)
				.json({ message: "Only clients can create projects" });
		}
		const existingProjectByTitle = await Project.findOne({
			client: clientId,
			title: title.trim(),
		});

		if (existingProjectByTitle) {
			return res.status(409).json({
				success: false,
				error: "You already have a project with this title",
				conflictType: "title_duplicate",
				existingProject: {
					id: existingProjectByTitle._id,
					title: existingProjectByTitle.title,
					status: existingProjectByTitle.status,
				},
			});
		}

		// Validate Industry exists in database
		const industryExists = await IndustryData.findById(Industry);
		if (!industryExists) {
			return res.status(400).json({
				success: false,
				error: "Invalid industry ID. Industry does not exist.",
			});
		}

		// Extract skill IDs from the skills array
		const skillIds = skills.map((skill) => skill.skillId);

		// Validate all skills exist in database
		const existingSkills = await Skill.find({ _id: { $in: skillIds } });

		if (existingSkills.length !== skillIds.length) {
			// Find which skills don't exist
			const existingSkillIds = existingSkills.map((skill) =>
				skill._id.toString()
			);
			const invalidSkillIds = skillIds.filter(
				(skillId) => !existingSkillIds.includes(skillId.toString())
			);

			return res.status(400).json({
				success: false,
				error: "Invalid skill IDs found",
				invalidSkills: invalidSkillIds,
			});
		}

		// Validate skill structure and experience levels
		const validExperienceLevels = [
			"Beginner",
			"Intermediate",
			"Advanced",
			"Expert",
		];
		const validPriorities = ["Must Have", "Nice to Have", "Optional"];

		for (const skill of skills) {
			// Check if skillId exists
			if (!skill.skillId) {
				return res.status(400).json({
					success: false,
					error: "Each skill must have a skillId",
				});
			}

			// Check if experienceLevel is valid
			if (
				!skill.experienceLevel ||
				!validExperienceLevels.includes(skill.experienceLevel)
			) {
				return res.status(400).json({
					success: false,
					error: `Invalid experience level. Must be one of: ${validExperienceLevels.join(
						", "
					)}`,
				});
			}

			// Check if priority is valid (if provided)
			if (skill.priority && !validPriorities.includes(skill.priority)) {
				return res.status(400).json({
					success: false,
					error: `Invalid priority level. Must be one of: ${validPriorities.join(
						", "
					)}`,
				});
			}
		}
		const allowedStatuses = ["Draft", "Open"];
		// Create project
		const newProject = new Project({
			client: clientId,
			title,
			description,
			Industry,
			skills: skills.map((skill) => ({
				skill: skill.skillId,
				experienceLevel: skill.experienceLevel,
				priority: skill.priority || "Must Have",
			})),
			budget: {
				type: budget.type,
				currency: budget.currency || "USD",
				minAmount: budget.minAmount,
				maxAmount: budget.maxAmount,
			},
			duration,
			startDate,
			endDate,
			attachments: attachments || [],
			status: allowedStatuses.includes(req.body.status)
				? req.body.status
				: "Draft",
		});

		const savedProject = await newProject.save();

		// Populate project details for response
		const populatedProject = await Project.findById(savedProject._id)
			.populate("client", "firstName lastName email")
			.populate("Industry")
			.populate("skills.skill");

		// Track analytics
		// await this.trackAnalytics(clientId, "Project Creation", {
		// 	projectId: savedProject._id,
		// 	action: "create_project",
		// });

		res.status(201).json({
			success: true,
			message: "Project created successfully",
			project: populatedProject,
		});
	} catch (error) {
		console.error("Error creating project:", error);
		res.status(500).json({
			success: false,
			message: "Error creating project",
			error: error.message,
		});
	}
};
/**
 * GET ALL PROJECTS - With advanced filtering and pagination
 * Features: Search, filter by skills, budget, status, Industry
 */

exports.getAllProjects = async (req, res) => {
	try {
		const {
			page = 1,
			limit = 10,
			search,
			skills,
			minBudget,
			maxBudget,
			Industry,
			status,
			duration,
			sortBy = "createdAt",
			sortOrder = "desc",
		} = req.query;

		// Build query object
		let query = { status: { $ne: "Draft" } };

		// Search functionality
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		// Filter by skills
		if (skills) {
			const skillIds = skills.split(",");
			query["skills.skill"] = { $in: skillIds };
		}

		// Filter by budget range
		if (minBudget || maxBudget) {
			query["budget.minAmount"] = {};
			if (minBudget) query["budget.minAmount"].$gte = parseInt(minBudget);
			if (maxBudget)
				query["budget.maxAmount"] = { $lte: parseInt(maxBudget) };
		}

		// Filter by Industry
		if (Industry) {
			query.Industry = Industry;
		}

		// Filter by status
		if (status) {
			query.status = status;
		}

		// Filter by duration
		if (duration) {
			query.duration = duration;
		}

		// Pagination
		const skip = (page - 1) * limit;
		const sortOptions = {};
		sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

		const projects = await Project.find(query)
			.populate("client", "firstName lastName avatar")
			.populate("Industry")
			.populate("skills.skill", "name Industry")
			.sort(sortOptions)
			.skip(skip)
			.limit(parseInt(limit));

		const totalProjects = await Project.countDocuments(query);

		res.json({
			success: true,
			projects,
			pagination: {
				currentPage: parseInt(page),
				totalPages: Math.ceil(totalProjects / limit),
				totalProjects,
				hasNext: page * limit < totalProjects,
				hasPrev: page > 1,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching projects",
			error: error.message,
		});
	}
};

/**
 * GET PROJECT BY ID - With full project details
 * Features: Complete project info, proposals, milestones, team members
 */

exports.getProjectById = async (req, res) => {
	try {
		const { projectId } = req.params;
		const userId = req.user.id;

		const project = await Project.findById(projectId)
			.populate("client", "firstName lastName email avatar")
			.populate("Industry")
			.populate("skills.skill", "name Industry description")
			.populate("proposals.freelancer", "firstName lastName avatar")
			.populate("proposals.freelancerProfile")
			.populate("selectedFreelancer", "firstName lastName avatar")
			.populate("team")
			.populate("reviews");

		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// Increment view count
		await Project.findByIdAndUpdate(projectId, {
			$inc: { "metrics.views": 1 },
		});

		// Track analytics
		// await this.trackAnalytics(userId, "Project View", {
		// 	projectId: projectId,
		// 	action: "view_project",
		// });

		res.json({
			success: true,
			project,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching project",
			error: error.message,
		});
	}
};
/**
 * UPDATE PROJECT - Client can update project details
 * Features: Update all project fields, change status
 */
exports.updateProject = async (req, res) => {
	try {
		const { projectId } = req.params;
		const userId = req.user.id;

		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		if (project.client.toString() !== userId.toString()) {
			return res.status(403).json({
				success: false,
				message: "Access denied",
			});
		}

		// Check if project can be updated BEFORE making changes
		if (["Completed", "Cancelled"].includes(project.status)) {
			return res.status(400).json({
				success: false,
				message: "Cannot update completed or cancelled projects",
			});
		}

		const {
			title,
			description,
			Industry,
			skills,
			budget,
			duration,
			startDate,
			endDate,
			attachments,
		} = req.body;

		// Build update object dynamically
		const updateData = {};

		if (title !== undefined) updateData.title = title;
		if (description !== undefined) updateData.description = description;
		if (Industry !== undefined) updateData.Industry = Industry;
		if (skills !== undefined) updateData.skills = skills;
		if (budget !== undefined) updateData.budget = budget;
		if (duration !== undefined) updateData.duration = duration;
		if (startDate !== undefined) updateData.startDate = startDate;
		if (endDate !== undefined) updateData.endDate = endDate;
		if (attachments !== undefined) updateData.attachments = attachments;

		// Add updatedAt timestamp
		updateData.updatedAt = new Date();

		// Update the project
		const updatedProject = await Project.findByIdAndUpdate(
			projectId,
			updateData,
			{ new: true, runValidators: true }
		).populate("client category skills.skill");

		res.json({
			success: true,
			message: "Project updated successfully",
			data: updatedProject, // Include the updated project data
		});
	} catch (error) {
		console.error("Error updating project:", error);
		res.status(500).json({
			success: false,
			message: "Error updating project",
			error: error.message,
		});
	}
};

/**
 * DELETE PROJECT - Soft delete project
 * Features: Mark as cancelled, handle ongoing proposals
 */

exports.deleteProject = async (req, res) => {
	try {
		const { projectId } = req.params;
		const userId = req.user.id;

		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// Check ownership
		if (project.client.toString() !== userId) {
			return res.status(403).json({
				success: false,
				message: "Only project owner can delete the project",
			});
		}

		// Cannot delete if project is in progress or completed
		if (["In Progress", "Completed"].includes(project.status)) {
			return res.status(400).json({
				success: false,
				message: "Cannot delete projects that are in progress or completed",
			});
		}

		// Soft delete - mark as cancelled
		await Project.findByIdAndUpdate(projectId, {
			status: "Cancelled",
			updatedAt: new Date(),
		});

		//if hard delete
		// await Project.findByIdAndDelete(projectId);

		// Notify freelancers with pending proposals
		// (In a real app, you'd send notifications here)

		res.json({
			success: true,
			message: "Project deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error deleting project",
			error: error.message,
		});
	}
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/**
 * SUBMIT PROPOSAL - Freelancer submits proposal for project
 * Features: Cover letter, proposed amount, timeline, attachments
 */

exports.submitProposal = async (req, res) => {
	try {
		const { projectId } = req.params;
		const { coverLetter, proposedAmount, estimatedDuration, attachments } =
			req.body;
		const freelancerId = req.user.id;

		// Validate freelancer
		const freelancer = await User.findById(freelancerId);
		if (!freelancer || freelancer.role !== "freelancer") {
			return res.status(403).json({
				success: false,
				message: "Only freelancers can submit proposals",
			});
		}

		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// Check if project is still open for proposals
		if (project.status !== "Open") {
			return res.status(400).json({
				success: false,
				message: "Project is not open for proposals",
			});
		}

		// Check if freelancer already submitted a proposal
		const existingProposal = project.proposals.find(
			(p) => p.freelancer.toString() === freelancerId
		);
		if (existingProposal) {
			return res.status(400).json({
				success: false,
				message: "You have already submitted a proposal for this project",
			});
		}

		// Get freelancer profile
		const freelancerProfile = await FreelancerProfile.findOne({
			user: freelancerId,
		});

		const proposal = {
			freelancer: freelancerId,
			freelancerProfile: freelancerProfile?._id,
			coverLetter,
			proposedAmount,
			estimatedDuration,
			attachments: attachments || [],
			status: "Pending",
			submittedAt: new Date(),
		};

		project.proposals.push(proposal);
		await project.save();

		// Track analytics
		// await this.trackAnalytics(freelancerId, "Proposal", {
		// 	projectId: projectId,
		// 	action: "submit_proposal",
		// });

		res.status(201).json({
			success: true,
			message: "Proposal submitted successfully",
			proposal,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error submitting proposal",
			error: error.message,
		});
	}
};

/**
 * GET PROJECT PROPOSALS - Client views all proposals for their project
 * Features: Pagination, sorting, filtering by status
 */

exports.getProjectProposals = async (req, res) => {
	try {
		const { projectId } = req.params;
		const { status, sortBy = "submittedAt", sortOrder = "desc" } = req.query;
		const userId = req.user.id;

		const project = await Project.findById(projectId)
			.populate({
				path: "proposals.freelancer",
				select: "firstName lastName avatar",
			})
			.populate({
				path: "proposals.freelancerProfile",
				select: "title bio hourlyRate rating stats",
			});

		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// Check if user is the project owner
		if (project.client.toString() !== userId) {
			return res.status(403).json({
				success: false,
				message: "Only project owner can view proposals",
			});
		}

		let proposals = project.proposals;

		// Filter by status if provided
		if (status) {
			proposals = proposals.filter((p) => p.status === status);
		}

		// Sort proposals
		proposals.sort((a, b) => {
			const aValue = a[sortBy];
			const bValue = b[sortBy];
			if (sortOrder === "desc") {
				return bValue > aValue ? 1 : -1;
			}
			return aValue > bValue ? 1 : -1;
		});

		res.json({
			success: true,
			proposals,
			totalProposals: proposals.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching proposals",
			error: error.message,
		});
	}
};
/**
 * UPDATE PROPOSAL STATUS - Client can shortlist, accept, or reject proposals
 * Features: Shortlist, accept, reject proposals with notes
 */
exports.updateProposalStatus = async (req, res) => {
	try {
		// Trim whitespace from parameters to handle newlines and spaces
		const projectId = req.params.projectId.trim();
		const proposalId = req.params.proposalId.trim();
		const { status, notes, rating } = req.body;
		const userId = req.user.id;

		// Additional validation for MongoDB ObjectId format
		const mongoose = require("mongoose");
		if (!mongoose.Types.ObjectId.isValid(projectId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid project ID format",
			});
		}

		if (!mongoose.Types.ObjectId.isValid(proposalId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid proposal ID format",
			});
		}

		// Validate status
		const validStatuses = ["Pending", "Accepted", "Rejected"];
		if (!validStatuses.includes(status)) {
			return res.status(400).json({
				success: false,
				message: `Invalid status. Must be one of: ${validStatuses.join(
					", "
				)}`,
			});
		}

		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// Check if user is the project owner
		if (project.client.toString() !== userId) {
			return res.status(403).json({
				success: false,
				message: "Only project owner can update proposal status",
			});
		}

		// Debug: Log proposals array
		console.log("All proposals:", project.proposals);
		console.log("Looking for proposalId:", proposalId);

		// Find proposal using find() method instead of id()
		const proposal = project.proposals.find(
			(p) => p._id.toString() === proposalId
		);

		console.log("Found proposal:", proposal);

		if (!proposal) {
			return res.status(404).json({
				success: false,
				message: "Proposal not found",
				debug: {
					projectId,
					proposalId,
					availableProposals: project.proposals.map((p) => ({
						id: p._id.toString(),
						freelancer: p.freelancer.toString(),
					})),
				},
			});
		}

		// Check if proposal is already processed
		if (proposal.status !== "Pending" && status !== "Pending") {
			return res.status(400).json({
				success: false,
				message: `Cannot update proposal that is already ${proposal.status}`,
			});
		}

		// Update proposal
		proposal.status = status;
		if (notes) proposal.notes = notes;
		if (rating) proposal.rating = rating;
		proposal.updatedAt = new Date();

		// If accepting a proposal, set selected freelancer and reject others
		if (status === "Accepted") {
			project.selectedFreelancer = proposal.freelancer;
			project.status = "In Progress";

			// Reject all other pending proposals
			project.proposals.forEach((p) => {
				if (p._id.toString() !== proposalId && p.status === "Pending") {
					p.status = "Rejected";
					p.updatedAt = new Date();
				}
			});
		}

		// Update project's updatedAt timestamp
		project.updatedAt = new Date();

		await project.save();

		// Populate the updated project to get full details
		const updatedProject = await Project.findById(projectId)
			.populate("proposals.freelancer", "firstName lastName email avatar")
			.populate("selectedFreelancer", "firstName lastName email avatar");

		const updatedProposal = updatedProject.proposals.find(
			(p) => p._id.toString() === proposalId
		);

		// Track analytics
		// await this.trackAnalytics(userId, "Proposal Status Update", {
		// 	projectId: projectId,
		// 	proposalId: proposalId,
		// 	action: `proposal_${status.toLowerCase()}`,
		// });

		// Send notification to freelancer
		// (In a real app, you'd send email/push notifications here)

		res.json({
			success: true,
			message: `Proposal ${status.toLowerCase()} successfully`,
			proposal: updatedProposal,
			project: {
				id: updatedProject._id,
				status: updatedProject.status,
				selectedFreelancer: updatedProject.selectedFreelancer,
			},
		});
	} catch (error) {
		console.error("Error updating proposal status:", error);
		res.status(500).json({
			success: false,
			message: "Error updating proposal status",
			error: error.message,
		});
	}
};

// ==================== MILESTONE MANAGEMENT ====================

/**
 * CREATE MILESTONE - Create project milestones
 * Features: Title, description, amount, due date
 */

exports.createMilestone = async (req, res) => {
	try {
		const { projectId } = req.params;
		const { title, description, amount, dueDate } = req.body;
		const userId = req.user.id;

		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// Check if user can create milestones (client or selected freelancer)
		const canCreate =
			project.client.toString() === userId ||
			project.selectedFreelancer?.toString() === userId;

		if (!canCreate) {
			return res.status(403).json({
				success: false,
				message:
					"Only project client or selected freelancer can create milestones",
			});
		}

		const milestone = {
			title,
			description,
			amount,
			dueDate: new Date(dueDate),
			status: "Pending",
		};

		project.milestones.push(milestone);
		await project.save();

		res.status(201).json({
			success: true,
			message: "Milestone created successfully",
			milestone: project.milestones[project.milestones.length - 1],
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error creating milestone",
			error: error.message,
		});
	}
};
/**
 * UPDATE MILESTONE STATUS - Update milestone progress
 * Features: Mark as completed, in progress, approved
 */

exports.updateMilestoneStatus = async (req, res) => {
	try {
		const { projectId, milestoneId } = req.params;
		const { status } = req.body;
		const userId = req.user.id;

		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		const milestone = project.milestones.id(milestoneId);
		if (!milestone) {
			return res.status(404).json({
				success: false,
				message: "Milestone not found",
			});
		}

		// Check permissions based on status being set
		let canUpdate = false;
		if (
			status === "Completed" &&
			project.selectedFreelancer?.toString() === userId
		) {
			canUpdate = true; // Freelancer can mark as completed
		} else if (
			status === "Approved" &&
			project.client.toString() === userId
		) {
			canUpdate = true; // Client can approve
		} else if (project.client.toString() === userId) {
			canUpdate = true; // Client can change any status
		}

		if (!canUpdate) {
			return res.status(403).json({
				success: false,
				message: "Insufficient permissions to update milestone status",
			});
		}

		milestone.status = status;

		// Update project progress
		await project.updateProgress();

		res.json({
			success: true,
			message: "Milestone status updated successfully",
			milestone,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating milestone status",
			error: error.message,
		});
	}
};

/**
 * UPDATE PROJECT STATUS - Change project status
 * Features: Mark as completed, cancelled, in review
 */
exports.updateProjectStatus = async (req, res) => {
	try {
		const { projectId } = req.params;
		const { status, reason } = req.body;
		const userId = req.user.id;

		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({
				success: false,
				message: "Project not found",
			});
		}

		// Check permissions
		const isClient = project.client.toString() === userId;
		const isFreelancer = project.selectedFreelancer?.toString() === userId;

		if (!isClient && !isFreelancer) {
			return res.status(403).json({
				success: false,
				message: "Only project participants can update project status",
			});
		}

		// Store current status for validation and tracking
		const currentStatus = project.status;

		// Validate status transitions - Updated to match actual schema enum values
		const allowedTransitions = {
			Draft: ["Open", "Cancelled"],
			Open: ["In Progress", "Cancelled"],
			"In Progress": ["In Review", "Completed", "Cancelled", "Disputed"],
			"In Review": ["Completed", "In Progress", "Disputed"],
			Completed: [], // Final state - no further transitions
			Cancelled: [], // Final state - no further transitions
			Disputed: ["In Progress", "Cancelled"],
		};

		if (!allowedTransitions[currentStatus]?.includes(status)) {
			return res.status(400).json({
				success: false,
				message: `Cannot change status from ${currentStatus} to ${status}`,
			});
		}

		// Update project status
		project.status = status;

		// Set completion date if project is completed
		if (status === "Completed") {
			project.timeline.actualEndDate = new Date();
		}

		// Set cancelled date if project is cancelled
		if (status === "Cancelled") {
			project.timeline.cancelledDate = new Date();
		}

		// Add status change reason to project history if provided
		if (reason) {
			if (!project.statusHistory) {
				project.statusHistory = [];
			}
			project.statusHistory.push({
				status: status,
				reason: reason,
				changedBy: userId,
				changedAt: new Date(),
			});
		}

		await project.save();

		// Track analytics
		// await this.trackAnalytics(userId, 'Project Status Change', {
		//   projectId: projectId,
		//   action: 'status_change',
		//   oldStatus: currentStatus,
		//   newStatus: status,
		//   reason: reason
		// });

		res.json({
			success: true,
			message: `Project status updated to ${status}`,
			project,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating project status",
			error: error.message,
		});
	}
};

// ==================== PROJECT SEARCH & RECOMMENDATIONS ====================

/**
 * SEARCH PROJECTS - Advanced search with AI-powered recommendations
 * Features: Skill matching, budget filtering, location-based search
 */
exports.searchProjects = async (req, res) => {
	try {
		const {
			q: searchQuery,
			skills,
			minBudget,
			maxBudget,
			location,
			duration,
			experienceLevel,
			status, // allow custom status
			page = 1,
			limit = 10,
		} = req.query;

		const userId = req.user?.id;
		let query = {};

		// Status filter (default to 'Open' if not specified)
		if (status) {
			query.status = status;
		} else {
			query.status = "Open";
		}

		// Text search
		if (searchQuery) {
			query.$text = { $search: searchQuery };
		}

		// Skills filter
		if (skills) {
			const skillIds = skills.split(",");
			query["skills.skill"] = { $in: skillIds };
		}

		// Budget filter
		if (minBudget || maxBudget) {
			query.$and = query.$and || [];
			if (minBudget) {
				query.$and.push({
					"budget.minAmount": { $gte: parseInt(minBudget) },
				});
			}
			if (maxBudget) {
				query.$and.push({
					"budget.maxAmount": { $lte: parseInt(maxBudget) },
				});
			}
		}

		// Duration filter
		if (duration) {
			query.duration = duration;
		}

		// Experience level filter
		if (experienceLevel) {
			query["skills.experienceLevel"] = experienceLevel;
		}

		const skip = (page - 1) * limit;

		let projects = await Project.find(query)
			.populate("client", "firstName lastName avatar location")
			.populate("Industry")
			.populate("skills.skill", "name Industry")
			// .populate("skills.skill", "name category")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit));

		if (userId) {
			const user = await User.findById(userId);
			if (user && user.role === "freelancer") {
				projects = await this.personalizeProjectResults(projects, userId);
			}
		}

		const totalProjects = await Project.countDocuments(query);

		res.json({
			success: true,
			projects,
			pagination: {
				currentPage: parseInt(page),
				totalPages: Math.ceil(totalProjects / limit),
				totalProjects,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error searching projects",
			error: error.message,
		});
	}
};

/**
 * GET RECOMMENDED PROJECTS - AI-powered project recommendations for freelancers
 * Features: Skill matching, past project analysis, success rate prediction
 */

exports.getRecommendedProjects = async (req, res) => {
	try {
		const freelancerId = req.user.id;

		const { limit = 10 } = req.query;

		// Get freelancer profile and skills
		const freelancerProfile = await FreelancerProfile.findOne({
			user: freelancerId,
		}).populate("skills.skill");

		console.log("Freelancer profile:", freelancerProfile);

		if (!freelancerProfile) {
			return res.status(404).json({
				success: false,
				message: "Freelancer profile not found",
			});
		}

		// Extract freelancer skills
		const freelancerSkills = freelancerProfile.skills.map((s) => s.skill._id);

		// Find projects matching freelancer skills
		const matchingProjects = await Project.find({
			status: "Open",
			"skills.skill": { $in: freelancerSkills },
		})
			.populate("client", "firstName lastName avatar")
			.populate("category")
			.populate("skills.skill", "name category")
			.limit(parseInt(limit));

		// Calculate match scores
		const projectsWithScores = matchingProjects.map((project) => {
			const matchScore = this.calculateProjectMatchScore(
				project,
				freelancerProfile
			);
			return {
				...project.toObject(),
				matchScore,
				matchReasons: this.getMatchReasons(project, freelancerProfile),
			};
		});

		// Sort by match score
		projectsWithScores.sort((a, b) => b.matchScore - a.matchScore);

		res.json({
			success: true,
			recommendedProjects: projectsWithScores,
			total: projectsWithScores.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error getting recommended projects",
			error: error.message,
		});
	}
};

// ==================== HELPER METHODS ====================

/**
 * Check if user can view project
 */

exports.canViewProject = async (userId, project) => {
	// Project owner (client) can always view
	if (project.client._id.toString() === userId) return true;

	// Selected freelancer can view
	if (project.selectedFreelancer?.toString() === userId) return true;

	// Freelancers who submitted proposals can view
	const hasProposal = project.proposals.some(
		(p) => p.freelancer.toString() === userId
	);
	if (hasProposal) return true;

	// Public projects can be viewed by anyone (when status is Open)
	if (project.status === "Open") return true;

	return false;
};

// /**
//  * Get match reasons for project recommendation
//  */
// exports.getMatchReasons = (project, freelancerProfile) => {
// 	const reasons = [];

// 	// Skill matches
// 	const projectSkills = project.skills.map((s) => s.skill.name);
// 	const freelancerSkills = freelancerProfile.skills.map((s) => s.skill.name);
// 	const matchingSkills = projectSkills.filter((skill) =>
// 		freelancerSkills.includes(skill)
// 	);

// 	if (matchingSkills.length > 0) {
// 		reasons.push(`Matches your skills: ${matchingSkills.join(", ")}`);
// 	}

// 	// Budget compatibility
// 	if (project.budget.type === "Hourly") {
// 		const rate = freelancerProfile.hourlyRate;
// 		if (
// 			rate >= project.budget.minAmount &&
// 			rate <= project.budget.maxAmount
// 		) {
// 			reasons.push("Budget matches your hourly rate");
// 		} else if (rate <= project.budget.maxAmount * 1.2) {
// 			reasons.push("Budget is close to your hourly rate");
// 		}
// 	} else {
// 		reasons.push("Fixed price project opportunity");
// 	}

// 	// High rating advantage
// 	if (freelancerProfile.rating.average >= 4.5) {
// 		reasons.push("Your excellent rating gives you an advantage");
// 	} else if (freelancerProfile.rating.average >= 4.0) {
// 		reasons.push("Your good rating is competitive");
// 	}

// 	// Experience level matching
// 	const hasMatchingExperience = project.skills.some((projectSkill) => {
// 		const freelancerSkill = freelancerProfile.skills.find(
// 			(fs) => fs.skill._id.toString() === projectSkill.skill._id.toString()
// 		);
// 		return (
// 			freelancerSkill &&
// 			this.compareExperienceLevels(
// 				freelancerSkill.experienceLevel,
// 				projectSkill.experienceLevel
// 			)
// 		);
// 	});

// 	if (hasMatchingExperience) {
// 		reasons.push("Your experience level matches project requirements");
// 	}

// 	// Project urgency
// 	const daysUntilStart = project.startDate
// 		? Math.ceil(
// 				(new Date(project.startDate) - new Date()) / (1000 * 60 * 60 * 24)
// 		  )
// 		: null;

// 	if (daysUntilStart && daysUntilStart <= 7) {
// 		reasons.push("Urgent project - quick start needed");
// 	} else if (daysUntilStart && daysUntilStart <= 30) {
// 		reasons.push("Starting soon - good timing");
// 	}

// 	// Project duration match
// 	if (project.duration === "Less than 1 month") {
// 		reasons.push("Short-term project - quick completion");
// 	} else if (project.duration === "More than 6 months") {
// 		reasons.push("Long-term project - stable work opportunity");
// 	}

// 	// Low competition indicator
// 	if (project.metrics.proposals < 5) {
// 		reasons.push("Low competition - fewer proposals submitted");
// 	}

// 	return reasons;
// };

// /**
//  * Compare experience levels for matching
//  * Returns true if freelancer's experience meets or exceeds project requirement
//  */
// exports.compareExperienceLevels = (freelancerLevel, projectLevel) => {
// 	const levels = {
// 		Beginner: 1,
// 		Intermediate: 2,
// 		Expert: 3,
// 	};

// 	const freelancerScore = levels[freelancerLevel] || 0;
// 	const projectScore = levels[projectLevel] || 0;

// 	// Freelancer's experience should meet or exceed project requirement
// 	return freelancerScore >= projectScore;
// };

// /**
//  * Personalize project results based on freelancer preferences and history
//  */
// exports.personalizeProjectResults = async (projects, freelancerId) => {
// 	try {
// 		// Get freelancer's application history
// 		const freelancerApplications = await Project.find({
// 			"proposals.freelancer": freelancerId,
// 		}).select("category skills budget.type");

// 		// Get freelancer profile
// 		const freelancerProfile = await FreelancerProfile.findOne({
// 			user: freelancerId,
// 		});

// 		if (!freelancerProfile) return projects;

// 		// Calculate personalization scores
// 		const personalizedProjects = projects.map((project) => {
// 			let personalizationScore = 0;

// 			// Historical category preference
// 			const appliedCategories = freelancerApplications.map((p) =>
// 				p.category?.toString()
// 			);
// 			if (appliedCategories.includes(project.category?._id.toString())) {
// 				personalizationScore += 20;
// 			}

// 			// Budget type preference
// 			const appliedBudgetTypes = freelancerApplications.map(
// 				(p) => p.budget.type
// 			);
// 			const budgetTypeFrequency = appliedBudgetTypes.reduce((acc, type) => {
// 				acc[type] = (acc[type] || 0) + 1;
// 				return acc;
// 			}, {});

// 			const mostPreferredBudgetType = Object.keys(
// 				budgetTypeFrequency
// 			).reduce(
// 				(a, b) => (budgetTypeFrequency[a] > budgetTypeFrequency[b] ? a : b),
// 				""
// 			);

// 			if (project.budget.type === mostPreferredBudgetType) {
// 				personalizationScore += 15;
// 			}

// 			// Skill specialization bonus
// 			const freelancerSkillIds = freelancerProfile.skills.map((s) =>
// 				s.skill.toString()
// 			);
// 			const projectSkillIds = project.skills.map((s) =>
// 				s.skill._id.toString()
// 			);
// 			const skillOverlap = projectSkillIds.filter((id) =>
// 				freelancerSkillIds.includes(id)
// 			).length;
// 			const skillSpecializationScore =
// 				(skillOverlap / projectSkillIds.length) * 25;
// 			personalizationScore += skillSpecializationScore;

// 			// Recent activity bonus
// 			const daysSinceCreated = Math.ceil(
// 				(new Date() - new Date(project.createdAt)) / (1000 * 60 * 60 * 24)
// 			);
// 			if (daysSinceCreated <= 3) {
// 				personalizationScore += 10; // Boost new projects
// 			}

// 			return {
// 				...project.toObject(),
// 				personalizationScore: Math.round(personalizationScore),
// 			};
// 		});

// 		// Sort by personalization score (descending)
// 		return personalizedProjects.sort(
// 			(a, b) => b.personalizationScore - a.personalizationScore
// 		);
// 	} catch (error) {
// 		console.error("Error personalizing project results:", error);
// 		return projects; // Return original projects if personalization fails
// 	}
// };

// /**
//  * Track analytics for project-related actions
//  */
// exports.trackAnalytics = async (userId, eventType, data) => {
// 	try {
// 		const analyticsData = {
// 			user: userId,
// 			eventType,
// 			data,
// 			timestamp: new Date(),
// 			userAgent: data.userAgent || "Unknown",
// 			ipAddress: data.ipAddress || "Unknown",
// 		};

// 		await Analytics.create(analyticsData);
// 	} catch (error) {
// 		console.error("Error tracking analytics:", error);
// 		// Don't throw error as analytics failure shouldn't break main functionality
// 	}
// };

// /**
//  * Get project statistics for dashboard
//  */
// exports.getProjectStats = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		const userRole = req.user.role;

// 		let stats = {};

// 		if (userRole === "client") {
// 			// Client statistics
// 			const clientProjects = await Project.find({ client: userId });

// 			stats = {
// 				totalProjects: clientProjects.length,
// 				activeProjects: clientProjects.filter(
// 					(p) => p.status === "In Progress"
// 				).length,
// 				completedProjects: clientProjects.filter(
// 					(p) => p.status === "Completed"
// 				).length,
// 				draftProjects: clientProjects.filter((p) => p.status === "Draft")
// 					.length,
// 				totalSpent: clientProjects.reduce(
// 					(sum, p) => sum + (p.budget.paid || 0),
// 					0
// 				),
// 				averageProjectValue:
// 					clientProjects.length > 0
// 						? clientProjects.reduce(
// 								(sum, p) => sum + p.budget.maxAmount,
// 								0
// 						  ) / clientProjects.length
// 						: 0,
// 				totalProposalsReceived: clientProjects.reduce(
// 					(sum, p) => sum + p.proposals.length,
// 					0
// 				),
// 			};
// 		} else if (userRole === "freelancer") {
// 			// Freelancer statistics
// 			const proposalsSubmitted = await Project.find({
// 				"proposals.freelancer": userId,
// 			});

// 			const activeProjects = await Project.find({
// 				selectedFreelancer: userId,
// 				status: "In Progress",
// 			});

// 			const completedProjects = await Project.find({
// 				selectedFreelancer: userId,
// 				status: "Completed",
// 			});

// 			const acceptedProposals = proposalsSubmitted.filter((p) =>
// 				p.proposals.some(
// 					(prop) =>
// 						prop.freelancer.toString() === userId &&
// 						prop.status === "Accepted"
// 				)
// 			);

// 			stats = {
// 				totalProposals: proposalsSubmitted.length,
// 				acceptedProposals: acceptedProposals.length,
// 				activeProjects: activeProjects.length,
// 				completedProjects: completedProjects.length,
// 				successRate:
// 					proposalsSubmitted.length > 0
// 						? (
// 								(acceptedProposals.length / proposalsSubmitted.length) *
// 								100
// 						  ).toFixed(1)
// 						: 0,
// 				totalEarned: completedProjects.reduce(
// 					(sum, p) => sum + (p.budget.paid || 0),
// 					0
// 				),
// 				averageProjectValue:
// 					completedProjects.length > 0
// 						? completedProjects.reduce(
// 								(sum, p) => sum + p.budget.maxAmount,
// 								0
// 						  ) / completedProjects.length
// 						: 0,
// 			};
// 		}

// 		res.json({
// 			success: true,
// 			stats,
// 		});
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: "Error fetching project statistics",
// 			error: error.message,
// 		});
// 	}
// };
