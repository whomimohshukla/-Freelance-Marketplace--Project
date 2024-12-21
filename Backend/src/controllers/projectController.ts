import { Request, Response, NextFunction } from "express";
import { Project, IProject, IProjectInput } from "../models/Project";
import { ErrorResponse } from "../utils/errorResponse";
import { IUser } from "../models/User";

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: IUser & { _id: string };
}

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Client only)
export const createProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verify user is a client
    if (req.user?.role !== "client") {
      return next(
        new ErrorResponse("Only clients can create projects", 403)
      );
    }

    const projectData: IProjectInput = req.body;
    
    // Create project with client ID
    const project = await Project.create({
      ...projectData,
      client: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects with filters
// @route   GET /api/projects
// @access  Public
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      category,
      skills,
      budget_min,
      budget_max,
      complexity,
      status,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query: any = {};

    // Search by title or description
    if (search) {
      query.$text = { $search: search as string };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by skills
    if (skills) {
      query.skills = { $in: (skills as string).split(",") };
    }

    // Filter by budget range
    if (budget_min || budget_max) {
      query.budget = {};
      if (budget_min) query.budget.minimum = { $gte: Number(budget_min) };
      if (budget_max) query.budget.maximum = { $lte: Number(budget_max) };
    }

    // Filter by complexity
    if (complexity) {
      query.complexity = complexity;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const projects = await Project.find(query)
      .populate("client", "firstName lastName email")
      .populate("assignedFreelancer", "firstName lastName email")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      data: projects,
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

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "firstName lastName email")
      .populate("assignedFreelancer", "firstName lastName email");

    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Project owner only)
export const updateProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }

    // Make sure user is project owner
    if (project.client.toString() !== req.user?._id.toString()) {
      return next(
        new ErrorResponse("Not authorized to update this project", 403)
      );
    }

    // Don't allow status update through this route
    if (req.body.status) {
      delete req.body.status;
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Project owner only)
export const deleteProject = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }

    // Make sure user is project owner
    if (project.client.toString() !== req.user?._id.toString()) {
      return next(
        new ErrorResponse("Not authorized to delete this project", 403)
      );
    }

    // Check if project can be deleted (not in progress)
    if (project.status === "in-progress") {
      return next(
        new ErrorResponse("Cannot delete a project that is in progress", 400)
      );
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project status
// @route   PATCH /api/projects/:id/status
// @access  Private (Project owner or assigned freelancer)
export const updateProjectStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ErrorResponse("Project not found", 404));
    }

    // Verify user is either project owner or assigned freelancer
    const isOwner = project.client.toString() === req.user?._id.toString();
    const isAssignedFreelancer = 
      project.assignedFreelancer?.toString() === req.user?._id.toString();

    if (!isOwner && !isAssignedFreelancer) {
      return next(
        new ErrorResponse("Not authorized to update project status", 403)
      );
    }

    // Validate status transition
    const validTransitions: { [key: string]: string[] } = {
      open: ["in-progress", "cancelled"],
      "in-progress": ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[project.status].includes(status)) {
      return next(
        new ErrorResponse(`Invalid status transition from ${project.status} to ${status}`, 400)
      );
    }

    project.status = status;
    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's projects (as client or freelancer)
// @route   GET /api/projects/user
// @access  Private
export const getUserProjects = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query: any = {};

    // Filter based on user role
    if (req.user?.role === "client") {
      query.client = req.user._id;
    } else {
      query.assignedFreelancer = req.user?._id;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const projects = await Project.find(query)
      .populate("client", "firstName lastName email")
      .populate("assignedFreelancer", "firstName lastName email")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      data: projects,
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

// Export the controller functions
export const projectController = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  getUserProjects,
};
