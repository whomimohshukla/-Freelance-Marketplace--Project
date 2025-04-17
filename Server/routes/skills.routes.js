const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.middleware");
const skillController = require("../controllers/core-Project/Skill/skillController.controller");

// Public routes
// router.get('/', skillController.getAllSkills);
// router.get('/:id', skillController.getSkillById);
// router.get('/:id/statistics', skillController.getSkillStatistics);

// Protected routes
// router.use(auth);
router.post("/createSkill", skillController.createSkill);
router.patch('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);
// router.post('/:id/endorse', skillController.addEndorsement);

module.exports = router;
