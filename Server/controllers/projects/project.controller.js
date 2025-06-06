const Project = require("../../models/project.model");
const User = require("../../models/user.model");
const IndustryData = require("../../models/industry.model");
const Skill = require("../../models/skills.model");

const FreelancerProfile = require("../../models/freelancer.model");
const ClientProfile = require("../../models/client.model");
const Team = require("../../models/teams.model");
const Review = require("../../models/review.model");
const Analytics = require("../../models/analytics.model");
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
