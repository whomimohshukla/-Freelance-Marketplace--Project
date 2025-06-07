// const Project = require("../controllers/core-Project/Project-crud/projectCRUD.controller");
const Project = require("../controllers/projects/project.controller");
const express = require("express");
const auth = require("../middleware/auth.middleware");
const Router = express.Router();

// Router.post("/create", auth, Project.createProject);

Router.post("/create", auth, Project.createProject);

Router.get("/", auth, Project.getAllProjects);

Router.get("/:projectId", auth, Project.getProjectById);

Router.put("/:projectId", auth, Project.updateProject);

Router.delete("/:projectId", auth, Project.deleteProject);

Router.post("/:projectId/submit-proposal", auth, Project.submitProposal);

Router.get("/:projectId/proposals", auth, Project.getProjectProposals);

Router.put(
	"/:projectId/proposals/:proposalId",
	auth,
	Project.updateProposalStatus
);

Router.post("/:projectId/milestones", auth, Project.createMilestone);

Router.put(
	"/:projectId/milestones/:milestoneId",
	auth,
	Project.updateMilestoneStatus
);

Router.put("/:projectId/status", auth, Project.updateProjectStatus);

module.exports = Router;
