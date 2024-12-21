import express from "express";
import { proposalController } from "../controllers/proposalController";
import { protect } from "../middleware/auth";

const router = express.Router();

// All proposal routes are protected
router.use(protect);

// Proposal routes
router.post("/:projectId", proposalController.createProposal);
router.get("/project/:projectId", proposalController.getProjectProposals);
router.get("/freelancer", proposalController.getFreelancerProposals);
router.patch("/:id/status", proposalController.updateProposalStatus);
router.put("/:id", proposalController.updateProposal);

export default router;
