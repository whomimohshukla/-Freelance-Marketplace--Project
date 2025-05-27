const Project = require('../../../models/project.model');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

// Create new project for client with client company
exports.createProject = catchAsync(async (req, res) => {
  const project = await Project.create({
    ...req.body,
    client: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: project
  });
});

// Get all projects with filtering
exports.getAllProjects = catchAsync(async (req, res) => {
  const {
    status,
    category,
    budget,
    skills,
    duration,
    sort = '-createdAt',
    page = 1,
    limit = 10
  } = req.query;

  const query = {};
  
  if (status) query.status = status;
  if (category) query.category = category;
  if (budget) {
    query['budget.minAmount'] = { $lte: parseInt(budget) };
    query['budget.maxAmount'] = { $gte: parseInt(budget) };
  }
  if (skills) {
    query['skills.skill'] = { $in: skills.split(',') };
  }
  if (duration) query.duration = duration;

  const projects = await Project.find(query)
    .populate('client', 'name email')
    .populate('category', 'name')
    .populate('skills.skill', 'name')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Project.countDocuments(query);

  res.json({
    status: 'success',
    results: projects.length,
    total,
    data: projects
  });
});

// Get project by ID
exports.getProjectById = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('client', 'name email')
    .populate('clientCompany')
    .populate('category', 'name')
    .populate('skills.skill', 'name')
    .populate('team')
    .populate('teamMembers.user', 'name email')
    .populate('teamMembers.assignedTasks');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  res.json({
    status: 'success',
    data: project
  });
});

// Update project
exports.updateProject = catchAsync(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { 
      _id: req.params.id,
      client: req.user._id // Ensure only project owner can update
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!project) {
    throw new ApiError(404, 'Project not found or unauthorized');
  }

  res.json({
    status: 'success',
    data: project
  });
});

// Delete project
exports.deleteProject = catchAsync(async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    client: req.user._id // Ensure only project owner can delete
  });

  if (!project) {
    throw new ApiError(404, 'Project not found or unauthorized');
  }

  res.json({
    status: 'success',
    data: null
  });
});

// // Submit proposal
// exports.submitProposal = catchAsync(async (req, res) => {
//   const project = await Project.findById(req.params.id);

//   if (!project) {
//     throw new ApiError(404, 'Project not found');
//   }

//   if (project.status !== 'Open') {
//     throw new ApiError(400, 'Project is not open for proposals');
//   }

//   const proposal = {
//     freelancer: req.user._id,
//     freelancerProfile: req.body.freelancerProfile,
//     coverLetter: req.body.coverLetter,
//     proposedAmount: req.body.proposedAmount,
//     estimatedDuration: req.body.estimatedDuration,
//     attachments: req.body.attachments || []
//   };

//   project.proposals.push(proposal);
//   await project.save();

//   res.status(201).json({
//     status: 'success',
//     data: project
//   });
// });

// Update project status
exports.updateProjectStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const project = await Project.findOneAndUpdate(
    { 
      _id: req.params.id,
      client: req.user._id
    },
    { status },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, 'Project not found or unauthorized');
  }

  res.json({
    status: 'success',
    data: project
  });
});

// Add team member
exports.addTeamMember = catchAsync(async (req, res) => {
  const { userId, role } = req.body;
  const project = await Project.findOneAndUpdate(
    { 
      _id: req.params.id,
      client: req.user._id
    },
    {
      $push: {
        teamMembers: {
          user: userId,
          role
        }
      }
    },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, 'Project not found or unauthorized');
  }

  res.json({
    status: 'success',
    data: project
  });
});

// // Update project progress
// exports.updateProgress = catchAsync(async (req, res) => {
//   const { percentage } = req.body;
//   const project = await Project.findOneAndUpdate(
//     { 
//       _id: req.params.id,
//       client: req.user._id
//     },
//     {
//       'progress.percentage': percentage,
//       'progress.lastUpdated': Date.now()
//     },
//     { new: true }
//   );

//   if (!project) {
//     throw new ApiError(404, 'Project not found or unauthorized');
//   }

//   res.json({
//     status: 'success',
//     data: project
//   });
// });

// Get similar projects
exports.getSimilarProjects = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const similarProjects = await Project.findSimilar(req.params.id);

  res.json({
    status: 'success',
    results: similarProjects.length,
    data: similarProjects
  });
});
