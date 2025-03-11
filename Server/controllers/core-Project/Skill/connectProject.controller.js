const Skill = require("../../../models/skills.model");

// Add project to skill
exports.addProject = async (req, res) => {
	try {
		const skill = await Skill.findByIdAndUpdate(
			req.params.skillId,
			{ $addToSet: { projects: req.body.projectId } },
			{ new: true }
		);
		if (!skill) return res.status(404).json({ error: "Skill not found" });
		res.json(skill);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Remove project from skill
exports.removeProject = async (req, res) => {
	try {
		const skill = await Skill.findByIdAndUpdate(
			req.params.skillId,
			{ $pull: { projects: req.params.projectId } },
			{ new: true }
		);
		if (!skill) return res.status(404).json({ error: "Skill not found" });
		res.json(skill);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
