const Skill = require("../../models/skills.model");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");

// Create a new skill
exports.createSkill = catchAsync(async (req, res) => {
  
	// const skill = await Skill.create(req.body);
	res.status(201).json({
		status: "success",
		data: skill,
	});
});

// Get all skills with filtering and pagination
exports.getAllSkills = catchAsync(async (req, res) => {
	const {
		category,
		name,
		sort = "-statistics.totalFreelancers",
		page = 1,
		limit = 10,
	} = req.query;
	const query = {};

	if (category) query.category = category;
	if (name) query.name = new RegExp(name, "i");

	const skills = await Skill.find(query)
		.sort(sort)
		.skip((page - 1) * limit)
		.limit(parseInt(limit));

	const total = await Skill.countDocuments(query);

	res.json({
		status: "success",
		results: skills.length,
		total,
		data: skills,
	});
});

// Get skill by ID
exports.getSkillById = catchAsync(async (req, res) => {
	const skill = await Skill.findById(req.params.id)
		.populate("freelancers.user", "name email")
		.populate("projects", "title status");

	if (!skill) {
		throw new ApiError(404, "Skill not found");
	}

	res.json({
		status: "success",
		data: skill,
	});
});

// Update skill
exports.updateSkill = catchAsync(async (req, res) => {
	const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!skill) {
		throw new ApiError(404, "Skill not found");
	}

	res.json({
		status: "success",
		data: skill,
	});
});

// Delete skill
exports.deleteSkill = catchAsync(async (req, res) => {
	const skill = await Skill.findByIdAndDelete(req.params.id);

	if (!skill) {
		throw new ApiError(404, "Skill not found");
	}

	res.json({
		status: "success",
		data: null,
	});
});

// Add endorsement
exports.addEndorsement = catchAsync(async (req, res) => {
	const { endorsee, level } = req.body;
	const skill = await Skill.findByIdAndUpdate(
		req.params.id,
		{
			$push: {
				endorsements: {
					endorser: req.user._id,
					endorsee,
					level,
				},
			},
		},
		{ new: true }
	);

	if (!skill) {
		throw new ApiError(404, "Skill not found");
	}

	res.json({
		status: "success",
		data: skill,
	});
});

// Get skill statistics
exports.getSkillStatistics = catchAsync(async (req, res) => {
	const skill = await Skill.findById(req.params.id);

	if (!skill) {
		throw new ApiError(404, "Skill not found");
	}

	res.json({
		status: "success",
		data: skill.statistics,
	});
});
