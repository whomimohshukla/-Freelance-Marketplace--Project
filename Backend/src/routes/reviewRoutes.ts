import express from "express";
import { reviewController } from "../controllers/reviewController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/user/:userId", reviewController.getUserReviews);
router.get("/:id", reviewController.getReview);

// Protected routes
router.use(protect);

router.post("/:projectId", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.post("/:id/response", reviewController.addReviewResponse);
router.delete("/:id", reviewController.deleteReview);

export default router;
