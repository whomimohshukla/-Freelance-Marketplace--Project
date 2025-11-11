const express = require("express");
const router = express.Router();
const skillController = require("../controllers/core-Project/Skill/skillController.controller");

// Public routes
router.get('/', skillController.getAllSkills); // supports q, page, limit, sortBy
router.get('/popular', skillController.getPopularSkills);
router.get('/:id', skillController.getSkillById);

// Protected routes
router.post("/createSkill", skillController.createSkill);
router.patch('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

module.exports = router;
