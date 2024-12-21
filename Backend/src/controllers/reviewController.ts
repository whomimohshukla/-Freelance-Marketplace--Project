import { Request, Response, NextFunction } from "express";
import { Review, IReview, IReviewInput } from "../models/Review";
import { Project } from "../models/Project";
import { ErrorResponse } from "../utils/errorResponse";
import { IUser } from "../models/User";
import mongoose from "mongoose";

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: IUser & { _id: string };
}

// Interface for Review statistics
interface IReviewStats {
  _id: null;
  averageRating: number;
  totalReviews: number;
  averageMetrics: {
    communication: number;
    quality: number;
    expertise: number;
    professionalism: number;
  };
}

// @desc    Create a new review
// @route   POST /api/reviews/:projectId
// @access  Private (Project participants only)
export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId;

    // Check if project exists and is completed
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }
    if (project.status !== "completed") {
      return next(
        new ErrorResponse("Can only review completed projects", 400)
      );
    }

    // Determine review type and reviewee based on user role
    const isClient = project.client.toString() === req.user?._id.toString();
    const isFreelancer = project.assignedFreelancer?.toString() === req.user?._id.toString();

    if (!isClient && !isFreelancer) {
      return next(
        new ErrorResponse("Only project participants can create reviews", 403)
      );
    }

    const reviewType = isClient ? "client-to-freelancer" : "freelancer-to-client";
    const reviewee = isClient ? project.assignedFreelancer : project.client;

    // Check for existing review
    const existingReview = await Review.findOne({
      project: projectId,
      reviewer: req.user?._id,
      type: reviewType,
    });

    if (existingReview) {
      return next(
        new ErrorResponse("You have already reviewed this project", 400)
      );
    }

    // Validate metrics based on review type
    const metrics = req.body.metrics;
    if (reviewType === "client-to-freelancer" && !metrics.deadlineAdherence) {
      return next(
        new ErrorResponse("Deadline adherence rating is required for freelancer reviews", 400)
      );
    }
    if (reviewType === "freelancer-to-client" && !metrics.paymentPromptness) {
      return next(
        new ErrorResponse("Payment promptness rating is required for client reviews", 400)
      );
    }

    // Create review
    const reviewData: IReviewInput = req.body;
    const review = await Review.create({
      ...reviewData,
      project: projectId,
      reviewer: req.user?._id,
      reviewee,
      type: reviewType,
    });

    // Populate reviewer and reviewee details
    await review.populate([
      { path: "reviewer", select: "firstName lastName email profileImage" },
      { path: "reviewee", select: "firstName lastName email profileImage" },
    ]);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      type,
      rating,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build query
    const query: any = {
      reviewee: req.params.userId,
      isPublic: true,
    };

    if (type) {
      query.type = type;
    }
    if (rating) {
      query.rating = Number(rating);
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find(query)
      .populate("reviewer", "firstName lastName email profileImage")
      .populate("project", "title")
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum);

    const total = await Review.countDocuments(query);

    // Get rating statistics
    const stats = await Review.calculateAverageRating(req.params.userId);

    res.status(200).json({
      success: true,
      data: reviews,
      stats,
      pagination: {
        current: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_records: total,
        per_page: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public (if review is public) / Private (if review is private)
export const getReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("reviewer", "firstName lastName email profileImage")
      .populate("reviewee", "firstName lastName email profileImage")
      .populate("project", "title");

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    // Check if review is private and user is authorized
    if (!review.isPublic) {
      const isParticipant =
        review.reviewer.toString() === req.user?._id.toString() ||
        review.reviewee.toString() === req.user?._id.toString();

      if (!isParticipant) {
        return next(
          new ErrorResponse("Not authorized to view this review", 403)
        );
      }
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Review owner only)
export const updateReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    // Check if user is review owner
    if (review.reviewer.toString() !== req.user?._id.toString()) {
      return next(
        new ErrorResponse("Not authorized to update this review", 403)
      );
    }

    // Don't allow updating certain fields
    const updateData = { ...req.body };
    delete updateData.reviewer;
    delete updateData.reviewee;
    delete updateData.project;
    delete updateData.type;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate([
      { path: "reviewer", select: "firstName lastName email profileImage" },
      { path: "reviewee", select: "firstName lastName email profileImage" },
      { path: "project", select: "title" },
    ]);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add response to review
// @route   POST /api/reviews/:id/response
// @access  Private (Reviewee only)
export const addReviewResponse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { response } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    // Check if user is reviewee
    if (review.reviewee.toString() !== req.user?._id.toString()) {
      return next(
        new ErrorResponse("Only the reviewee can respond to this review", 403)
      );
    }

    // Update response
    review.response = response;
    await review.save();

    await review.populate([
      { path: "reviewer", select: "firstName lastName email profileImage" },
      { path: "reviewee", select: "firstName lastName email profileImage" },
      { path: "project", select: "title" },
    ]);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Review owner or Admin)
export const deleteReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    // Check if user is review owner or admin
    const isReviewOwner = review.reviewer.toString() === req.user?._id.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isReviewOwner && !isAdmin) {
      return next(
        new ErrorResponse("Not authorized to delete this review", 403)
      );
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Export the controller functions
export const reviewController = {
  createReview,
  getUserReviews,
  getReview,
  updateReview,
  addReviewResponse,
  deleteReview,
};
