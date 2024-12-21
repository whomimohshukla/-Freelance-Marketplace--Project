import express from "express";
import { projectController } from "../controllers/projectController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProject);

// Protected routes
router.use(protect);

// User's projects
router.get("/user/projects", projectController.getUserProjects);

// Project CRUD operations
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);
router.patch("/:id/status", projectController.updateProjectStatus);

export default router;
