const Project = require("../../models/project.model");
const User = require("../../models/user.model");

exports.createProject = async (req, res) => {
	try {
		const {
			// Basic Project Info
			title,
			description,
			category,
			clientCompany,

			// Skills and Requirements
			skills,

			// Team Management
			team,
			teamMembers,

			// Budget and Payment
			budget,

			// Time Management
			duration,
			startDate,
			endDate,
			timeline,

			// Files and Documents
			attachments,

			// Milestones
			milestones,
		} = req.body;

		// Validate required fields
		if (
			!title ||
			!description ||
			!category ||
			!skills ||
			!budget ||
			!duration
		) {
			return res.status(400).json({
				success: false,
				error: "Missing required fields",
			});
		}

		// Validate budget structure
		if (!budget.type || !budget.minAmount || !budget.maxAmount) {
			return res.status(400).json({
				success: false,
				error: "Invalid budget structure",
			});
		}

		// Validate skills structure
		if (
			!Array.isArray(skills) ||
			!skills.every((skill) => skill.skill && skill.experienceLevel)
		) {
			return res.status(400).json({
				success: false,
				error: "Invalid skills structure",
			});
		}

		const projectData = {
			// Basic Info
			client: req.user._id,
			clientCompany,
			title,
			description,
			category,

			// Skills
			skills: skills.map((skill) => ({
				skill: skill.skill,
				experienceLevel: skill.experienceLevel,
				priority: skill.priority || "Must Have",
			})),

			// Team
			team,
			teamMembers: teamMembers?.map((member) => ({
				user: member.user,
				role: member.role,
				assignedTasks: [],
			})),

			// Budget
			budget: {
				type: budget.type,
				currency: budget.currency || "USD",
				minAmount: budget.minAmount,
				maxAmount: budget.maxAmount,
				paid: 0,
				pending: budget.maxAmount,
			},

			// Time Management
			duration,
			startDate,
			endDate,
			timeline: timeline
				? {
						plannedStartDate: timeline.plannedStartDate,
						plannedEndDate: timeline.plannedEndDate,
						actualStartDate: null,
						actualEndDate: null,
						delays: [],
				  }
				: null,

			// Status and Progress
			status: "Draft",
			progress: {
				percentage: 0,
				lastUpdated: new Date(),
			},

			// Attachments
			attachments: attachments?.map((attachment) => ({
				...attachment,
				uploadedBy: req.user._id,
				uploadedAt: new Date(),
			})),

			// Milestones
			milestones: milestones?.map((milestone) => ({
				title: milestone.title,
				description: milestone.description,
				amount: milestone.amount,
				dueDate: milestone.dueDate,
				status: "Pending",
				tasks: [],
				payment: null,
				review: null,
			})),

			// Initialize empty arrays
			proposals: [],
			messages: [],
			reviews: [],

			// Initialize metrics
			metrics: {
				views: 0,
				proposals: 0,
				totalTimeSpent: 0,
				costPerHour: 0,
			},
		};

		const project = await Project.create(projectData);

		// Populate necessary references
		await project.populate([
			{ path: "client", select: "name email" },
			{ path: "clientCompany" },
			{ path: "category" },
			{ path: "skills.skill" },
			{ path: "team" },
			{ path: "teamMembers.user", select: "name email" },
		]);

		// If milestones are provided, update project progress
		if (milestones?.length > 0) {
			await project.updateProgress();
		}

		res.status(201).json({
			success: true,
			data: project,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};
