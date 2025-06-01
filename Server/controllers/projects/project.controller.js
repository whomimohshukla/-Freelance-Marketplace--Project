const Project = require("../../models/project.model");
const User = require("../../models/user.model");
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
			category,
			skills,
			budget,
			duration,
			startDate,
			endDate,
			attachments,
		} = req.body;

		//validate required fields
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

		const clientId = req.user.id;
		//validate the client id
		// Validate client exists and has client profile
		const client = await User.findById(clientId);
		if (!client || client.role !== "client") {
			return res
				.status(403)
				.json({ message: "Only clients can create projects" });
		}

		// create project
		const newProject = new Project({
			client: clientId,
			title,
			description,
			category,
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
			status: "Draft",
		});

		const savedProject = await newProject.save();

		// Populate project details for response
		const populatedProject = await Project.findById(savedProject._id)
			.populate("client", "firstName lastName email")
			.populate("category")
			.populate("skills.skill");
		// Track analytics
		await this.trackAnalytics(clientId, "Project Creation", {
			projectId: savedProject._id,
			action: "create_project",
		});

		res.status(201).json({
			success: true,
			message: "Project created successfully",
			project: populatedProject,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error creating project",
			error: error.message,
		});
	}
};
