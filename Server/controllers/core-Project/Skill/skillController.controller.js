const Skill = require("../../../models/skills.model");

exports.createSkill = async (req, res) => {
	try {
		const { name, category, description } = req.body;

		if (!name || !category || !description) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const existingSkill = await Skill.findOne({ name });
		if (existingSkill) {
			return res.status(400).json({ error: "Skill already exists" });
		}
		const skill = new Skill({ name, category, description });
		await skill.save();
		res.status(201).json(skill);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get all skills with filtering and sorting
exports.getAllSkills = async (req, res) => {
	try {
		const { category, sortBy } = req.query;
		const filter = {};
		const sortOptions = {};

		if (category) filter.category = category;
		if (sortBy === "demand") sortOptions["statistics.demandTrend"] = -1;
		if (sortBy === "freelancers")
			sortOptions["statistics.totalFreelancers"] = -1;

		const skills = await Skill.find(filter).sort(sortOptions);
		res.json(skills);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get a single skill by ID with populated relationships
exports.getSkillById = async (req, res) => {
	try {
		const skill = await Skill.findById(req.params.id)
			.populate("freelancers.freelancer")
			.populate("projects")
			.populate("relatedSkills")
			.populate("courses")
			.populate("endorsements.endorser endorsements.endorsee");

		if (!skill) return res.status(404).json({ error: "Skill not found" });
		res.json(skill);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Update skill details
exports.updateSkill = async (req, res) => {
	try {
		const updates = Object.keys(req.body);
		const skill = await Skill.findById(req.params.id);

		if (!skill) return res.status(404).json({ error: "Skill not found" });
		updates.forEach((update) => (skill[update] = req.body[update]));
		await skill.save();
		res.json(skill);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
	try {
		const skill = await Skill.findByIdAndDelete(req.params.id);
		if (!skill) return res.status(404).json({ error: "Skill not found" });
		res.json({ message: "Skill deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
