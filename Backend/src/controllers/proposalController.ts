import { Request, Response, NextFunction } from "express";
import { Proposal, IProposal, IProposalInput } from "../models/Proposal";
import { Project } from "../models/Project";
import { ErrorResponse } from "../utils/errorResponse";
import { IUser } from "../models/User";

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: IUser & { _id: string };
}

// @desc    Create a new proposal
// @route   POST /api/proposals/:projectId
// @access  Private (Freelancers only)
export const createProposal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId;

    // Verify user is a freelancer
    if (req.user?.role !== "freelancer") {
      return next(
        new ErrorResponse("Only freelancers can submit proposals", 403)
      );
    }

    // Check if project exists and is open
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }
    if (project.status !== "open") {
      return next(new ErrorResponse("Project is not accepting proposals", 400));
    }

    // Check if freelancer has already submitted a proposal
    const existingProposal = await Proposal.findOne({
      project: projectId,
      freelancer: req.user._id,
    });

    if (existingProposal) {
      return next(
        new ErrorResponse("You have already submitted a proposal for this project", 400)
      );
    }

    // Validate bid amount against project budget
    if (
      req.body.bidAmount < project.budget.minimum ||
      req.body.bidAmount > project.budget.maximum
    ) {
      return next(
        new ErrorResponse(
          `Bid amount must be between ${project.budget.minimum} and ${project.budget.maximum}`,
          400
        )
      );
    }

    // Create proposal
    const proposalData: IProposalInput = req.body;
    const proposal = await Proposal.create({
      ...proposalData,
      project: projectId,
      freelancer: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all proposals for a project
// @route   GET /api/proposals/project/:projectId
// @access  Private (Project owner only)
export const getProjectProposals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId;
    const { status, page = 1, limit = 10 } = req.query;

    // Check if project exists and user is owner
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }
    if (project.client.toString() !== req.user?._id.toString()) {
      return next(
        new ErrorResponse("Not authorized to view these proposals", 403)
      );
    }

    // Build query
    const query: any = { project: projectId };
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const proposals = await Proposal.find(query)
      .populate("freelancer", "firstName lastName email profileImage")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum);

    const total = await Proposal.countDocuments(query);

    res.status(200).json({
      success: true,
      data: proposals,
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

// @desc    Get freelancer's proposals
// @route   GET /api/proposals/freelancer
// @access  Private (Freelancer only)
export const getFreelancerProposals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== "freelancer") {
      return next(
        new ErrorResponse("Only freelancers can access their proposals", 403)
      );
    }

    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query: any = { freelancer: req.user._id };
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const proposals = await Proposal.find(query)
      .populate("project", "title description budget status")
      .populate("freelancer", "firstName lastName email")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum);

    const total = await Proposal.countDocuments(query);

    res.status(200).json({
      success: true,
      data: proposals,
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

// @desc    Update proposal status
// @route   PATCH /api/proposals/:id/status
// @access  Private (Project owner or Proposal owner)
export const updateProposalStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    const proposal = await Proposal.findById(req.params.id)
      .populate("project", "client status");

    if (!proposal) {
      return next(new ErrorResponse("Proposal not found", 404));
    }

    const project = proposal.project as any;

    // Check authorization
    const isProjectOwner = project.client.toString() === req.user?._id.toString();
    const isProposalOwner = proposal.freelancer.toString() === req.user?._id.toString();

    if (!isProjectOwner && !isProposalOwner) {
      return next(
        new ErrorResponse("Not authorized to update this proposal", 403)
      );
    }

    // Validate status transitions
    const validTransitions: { [key: string]: string[] } = {
      pending: ["accepted", "rejected", "withdrawn"],
      accepted: [],
      rejected: [],
      withdrawn: [],
    };

    if (!validTransitions[proposal.status].includes(status)) {
      return next(
        new ErrorResponse(
          `Invalid status transition from ${proposal.status} to ${status}`,
          400
        )
      );
    }

    // Only freelancer can withdraw their proposal
    if (status === "withdrawn" && !isProposalOwner) {
      return next(
        new ErrorResponse("Only the freelancer can withdraw their proposal", 403)
      );
    }

    // Only project owner can accept/reject proposals
    if ((status === "accepted" || status === "rejected") && !isProjectOwner) {
      return next(
        new ErrorResponse(
          "Only the project owner can accept or reject proposals",
          403
        )
      );
    }

    // If accepting proposal, check if project is still open
    if (status === "accepted" && project.status !== "open") {
      return next(
        new ErrorResponse("Cannot accept proposal for a closed project", 400)
      );
    }

    // If accepting proposal, update project status and assigned freelancer
    if (status === "accepted") {
      await Project.findByIdAndUpdate(project._id, {
        status: "in-progress",
        assignedFreelancer: proposal.freelancer,
      });

      // Reject all other pending proposals
      await Proposal.updateMany(
        {
          project: project._id,
          _id: { $ne: proposal._id },
          status: "pending",
        },
        { status: "rejected" }
      );
    }

    proposal.status = status;
    await proposal.save();

    res.status(200).json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update proposal
// @route   PUT /api/proposals/:id
// @access  Private (Proposal owner only)
export const updateProposal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let proposal = await Proposal.findById(req.params.id)
      .populate("project", "budget status");

    if (!proposal) {
      return next(new ErrorResponse("Proposal not found", 404));
    }

    // Check if user is proposal owner
    if (proposal.freelancer.toString() !== req.user?._id.toString()) {
      return next(
        new ErrorResponse("Not authorized to update this proposal", 403)
      );
    }

    // Check if proposal can be updated (must be pending)
    if (proposal.status !== "pending") {
      return next(
        new ErrorResponse(
          `Cannot update proposal with status: ${proposal.status}`,
          400
        )
      );
    }

    const project = proposal.project as any;

    // Validate bid amount if it's being updated
    if (
      req.body.bidAmount &&
      (req.body.bidAmount < project.budget.minimum ||
        req.body.bidAmount > project.budget.maximum)
    ) {
      return next(
        new ErrorResponse(
          `Bid amount must be between ${project.budget.minimum} and ${project.budget.maximum}`,
          400
        )
      );
    }

    // Update proposal
    proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: proposal,
    });
  } catch (error) {
    next(error);
  }
};

// Export the controller functions
export const proposalController = {
  createProposal,
  getProjectProposals,
  getFreelancerProposals,
  updateProposalStatus,
  updateProposal,
};
