// const Project = require("../controllers/core-Project/Project-crud/projectCRUD.controller");
const Project = require("../controllers/core-Project/projects/project.controller");
const express = require("express");
const auth = require("../middleware/auth.middleware");
const Router = express.Router();

// Router.post("/create", auth, Project.createProject);

Router.post("/create", auth, Project.createProject);

Router.get("/", auth, Project.getAllProjects);
Router.get("/search", auth, Project.searchProjects);
Router.get("/recommendations", auth, Project.getRecommendedProjects);

Router.get("/:projectId", auth, Project.getProjectById);

Router.put("/:projectId", auth, Project.updateProject);

Router.delete("/:projectId", auth, Project.deleteProject);

Router.post("/:projectId/submit-proposal", auth, Project.submitProposal);

Router.get("/:projectId/proposals", auth, Project.getProjectProposals);

Router.put(
	"/:projectId/proposals/:proposalId",
	auth,
	Project.updateProposalStatus
);;

Router.post("/:projectId/milestones", auth, Project.createMilestone);

Router.put(
	"/:projectId/milestones/:milestoneId",
	auth,
	Project.updateMilestoneStatus
);

Router.put("/:projectId/status", auth, Project.updateProjectStatus);

Router.get("/search", auth, Project.searchProjects);

// Router.get("/:projectId/recommendations", auth, Project.getRecommendedProjects);
Router.get("/recommendations", auth, Project.getRecommendedProjects);

// Router.get("/:projectId/analytics", auth, Project.getProjectStats);

// Router.get("/:projectId/match-reasons", auth, Project.getMatchReasons);

// Router.Post("/:projectId/personalize", auth, Project.personalizeProjectResults);

// Router.get("/:projectId/can-view", auth, Project.canViewProject);

// Router.get("/stats ", auth, Project.getProjectStats);

// Router.get("/", auth, Project.compareExperienceLevels);

module.exports = Router;
