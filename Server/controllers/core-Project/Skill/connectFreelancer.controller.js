const Skill = require("../../../models/skills.model");

// Add freelancer to skill with proficiency
exports.addFreelancer = async (req, res) => {
	try {
		const skill = await Skill.findById(req.params.skillId);
		if (!skill) return res.status(404).json({ error: "Skill not found" });

		const freelancer = await FreelancerProfile.findById(req.body.freelancerId);
		if (!freelancer)
			return res.status(404).json({ error: "Freelancer not found" });

		skill.freelancers.push({
			freelancer: req.body.freelancerId,
			proficiency: req.body.proficiency,
		});

		await skill.save();
		res.json(skill);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Update freelancer proficiency
exports.updateFreelancerProficiency = async (req, res) => {
	try {
		const skill = await Skill.findById(req.params.skillId);
		if (!skill) return res.status(404).json({ error: "Skill not found" });

		const freelancer = skill.freelancers.id(req.params.freelancerId);
		if (!freelancer)
			return res
				.status(404)
				.json({ error: "Freelancer not found in this skill" });

		freelancer.proficiency = req.body.proficiency;
		await skill.save();
		res.json(skill);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Remove freelancer from skill
exports.removeFreelancer = async (req, res) => {
	try {
		const skill = await Skill.findById(req.params.skillId);
		if (!skill) return res.status(404).json({ error: "Skill not found" });

		skill.freelancers.pull({ _id: req.params.freelancerId });
		await skill.save();
		res.json(skill);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
