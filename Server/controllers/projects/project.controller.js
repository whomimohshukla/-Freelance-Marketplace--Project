const Project = require('../../models/project.model');
const mongoose = require('mongoose');

const User = require('../../models/user.model');
const ClientProfile = require('../../models/client.model');
const FreelancerProfile = require('../../models/freelancer.model');
const Analytics = require('../../models/analytics.model');
const { ObjectId } = mongoose.Types;



/**
  * Create a new project
  * @route POST /api/projects
  * @access Private - Client only
  */





exports.createProject = async (req, res) => {
    try {
        // Verify user is a client
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                error: 'Only clients can create projects'
            });
        }

        const {
            title,
            description,
            category,
            skills,
            budget,
            duration,
            // Rest of your destructuring
        } = req.body;

        // Basic validation
        if (!title || !description || !category || !skills || !budget || !duration) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
            });
        }

        // Validate budget structure
        if (!budget.type || !budget.minAmount || !budget.maxAmount) {
            return res.status(400).json({
                success: false,
                error: "Invalid budget structure",
            });
        }

        // Validate skills structure
        if (!Array.isArray(skills) || !skills.every((skill) => skill.skill && skill.experienceLevel)) {
            return res.status(400).json({
                success: false,
                error: "Invalid skills structure",
            });
        }

        // Validate category
        try {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category ID format'
                });
            }

            const Category = mongoose.model('Category'); // or 'Industry'
            const existingCategory = await Category.findById(category);

            if (!existingCategory) {
                return res.status(400).json({
                    success: false,
                    error: 'The specified category does not exist'
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Error validating category: ' + error.message
            });
        }

        // Validate skills
        try {
            const skillIds = skills.map(skill => skill.skill);

            // Check for valid ObjectId format
            const invalidSkillIds = skillIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
            if (invalidSkillIds.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid skill ID format: ${invalidSkillIds.join(', ')}`
                });
            }

            // Check if skills exist
            const Skill = mongoose.model('Skill');
            const existingSkills = await Skill.find({ _id: { $in: skillIds } });

            if (existingSkills.length !== skillIds.length) {
                const existingSkillIds = existingSkills.map(skill => skill._id.toString());
                const nonExistentSkills = skillIds.filter(id => !existingSkillIds.includes(id.toString()));

                return res.status(400).json({
                    success: false,
                    error: `The following skills do not exist: ${nonExistentSkills.join(', ')}`
                });
            }

            // Validate experience levels
            const validExperienceLevels = ['Beginner', 'Intermediate', 'Expert', 'Any Level'];
            const invalidExperienceLevels = skills.filter(skill =>
                !validExperienceLevels.includes(skill.experienceLevel)
            );

            if (invalidExperienceLevels.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid experience levels: ${invalidExperienceLevels.map(s => s.experienceLevel).join(', ')}. Valid options are: ${validExperienceLevels.join(', ')}`
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Error validating skills: ' + error.message
            });
        }

        // Create project data
        const projectData = {
            // Your project data structure
            // ...
        };

        // Create project
        const project = await Project.create(projectData);

        // Populate and return
        await project.populate([
            { path: "client", select: "name email" },
            { path: "clientCompany" },
            { path: "category" },
            { path: "skills.skill" },
            { path: "team" },
            { path: "teamMembers.user", select: "name email" },
        ]);

        if (milestones?.length > 0) {
            await project.updateProgress();
        }

        return res.status(201).json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};



/**
  * Get all projects with filtering and pagination
  * @route GET /api/projects
  * @access Public
  */


exports.getAllProjects = async (req, res) => {

    try {
        const {
            status = 'Open',
            category,
            skills,
            budget,
            duration,
            page = 1,
            limit = 10,
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query = { status };
        // Filter by category
        if (category) {
            if (!ObjectId.isValid(category)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid category ID format'
                });
            }
            query.category = new ObjectId(category);
        }

        // Filter by skills
        if (skills) {
            const skillIds = skills.split(',');
            if (skillIds.some(id => !ObjectId.isValid(id))) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid skill ID format'
                });
            }
            query['skills.skill'] = { $in: skillIds.map(id => new ObjectId(id)) };
        }

        // Filter by budget range
        if (budget) {
            const [min, max] = budget.split('-').map(Number);
            if (min) query['budget.minAmount'] = { $gte: min };
            if (max) query['budget.maxAmount'] = { $lte: max };
        }

        // Filter by duration
        if (duration) {
            query.duration = duration;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query with pagination
        const projects = await Project.find(query)
            .populate('client', 'firstName lastName avatar')
            .populate('category', 'name')
            .populate('skills.skill', 'name')
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sort);

        // Get total count for pagination
        const total = await Project.countDocuments(query);

        // Track analytics for search if user is logged in
        if (req.user) {
            await Analytics.create({
                user: req.user.id,
                type: 'Search',
                data: {
                    page: 'projects',
                    action: 'search',
                    source: req.headers.referer || 'direct'
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                projects,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }

}


exports.getProjectById = async (req, res) => {

    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid project ID format'
            });
        }

        
        const project = await Project.findById(id)
                .populate('client', 'firstName lastName email avatar')
                .populate('clientCompany', 'company')
                .populate('category', 'name')
                .populate('skills.skill', 'name category')
                .populate('selectedFreelancer', 'firstName lastName avatar')
                .populate({
                  path: 'proposals.freelancer',
                  select: 'firstName lastName avatar'
                })
                .populate({
                  path: 'proposals.freelancerProfile',
                  select: 'title hourlyRate rating'
                })
                .populate({
                  path: 'milestones.tasks',
                  select: 'title description status'
                })
                .populate({
                  path: 'milestones.payment',
                  select: 'amount status'
                });
        

    } catch (error) {

    }
}