const FreelancerProfile = require('../models/freelancer.model');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

// Search Freelancers
exports.searchFreelancers = async (req, res) => {
    try {
        const {
            skills,
            hourlyRate,
            availability,
            rating,
            page = 1,
            limit = 10
        } = req.query;

        console.log('Search Parameters:', { skills, hourlyRate, availability, rating, page, limit });
        
        const query = {};

        if (skills) {
            const skillIds = skills.split(',');
            const invalidSkills = skillIds.filter(id => !isValidObjectId(id));
            if (invalidSkills.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid skill IDs: ${invalidSkills.join(', ')}`
                });
            }
            query['skills.skill'] = { 
                $in: skillIds.map(id => new mongoose.Types.ObjectId(id))
            };
        }

        if (hourlyRate) {
            const [min, max] = hourlyRate.split('-').map(Number);
            query.hourlyRate = { $gte: min };
            if (max) query.hourlyRate.$lte = max;
        }

        if (availability) {
            // Match availability.status instead of availability directly
            query['availability.status'] = availability;
        }

        if (rating) {
            query['rating.average'] = { $gte: Number(rating) };
        }

        console.log('MongoDB Query:', JSON.stringify(query, null, 2));

        const skip = (Number(page) - 1) * Number(limit);

        const freelancers = await FreelancerProfile.find(query)
            .populate('user', 'firstName lastName email avatar')
            .populate('skills.skill')
            .populate('certifications')
            .skip(skip)
            .limit(Number(limit))
            .sort({ 'rating.average': -1 });

        console.log('Found Freelancers Count:', freelancers.length);

        const total = await FreelancerProfile.countDocuments(query);

        console.log('Total Documents:', total);

        res.status(200).json({
            success: true,
            data: freelancers,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Create or Update Freelancer Profile
exports.createOrUpdateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = { ...req.body };

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        // Validate and convert skill ObjectIds
        if (updateData.skills) {
            try {
                updateData.skills = updateData.skills.map(skill => ({
                    ...skill,
                    skill: new mongoose.Types.ObjectId(skill.skill)
                }));
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid skill ID format'
                });
            }
        }

        // Validate and convert certification ObjectIds
        if (updateData.certifications) {
            const invalidCerts = updateData.certifications.filter(id => !isValidObjectId(id));
            if (invalidCerts.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid certification IDs: ${invalidCerts.join(', ')}`
                });
            }
            updateData.certifications = updateData.certifications.map(id => 
                new mongoose.Types.ObjectId(id)
            );
        }

        let profile = await FreelancerProfile.findOne({ user: userId });

        if (profile) {
            profile = await FreelancerProfile.findOneAndUpdate(
                { user: userId },
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate(['user', 'skills.skill', 'certifications']);
        } else {
            updateData.user = new mongoose.Types.ObjectId(userId);
            profile = await FreelancerProfile.create(updateData);
            await profile.populate(['user', 'skills.skill', 'certifications']);
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get Freelancer Profile
exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await FreelancerProfile.findOne({ user: new mongoose.Types.ObjectId(userId) })
            .populate('user', 'firstName lastName email avatar')
            .populate('skills.skill')
            .populate('certifications')
            .populate('portfolio.project');

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Freelancer profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Skills
exports.updateSkills = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skills } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        // Validate and convert skill ObjectIds
        const validatedSkills = skills.map(skill => {
            if (!isValidObjectId(skill.skill)) {
                throw new Error(`Invalid skill ID: ${skill.skill}`);
            }
            return {
                ...skill,
                skill: new mongoose.Types.ObjectId(skill.skill)
            };
        });

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: { skills: validatedSkills } },
            { new: true, runValidators: true }
        ).populate('skills.skill');

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Freelancer profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile.skills
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Add Portfolio Item
exports.addPortfolioItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const portfolioItem = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        if (portfolioItem.project && !isValidObjectId(portfolioItem.project)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid project ID format'
            });
        }

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $push: { portfolio: portfolioItem } },
            { new: true, runValidators: true }
        ).populate('portfolio.project');

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Freelancer profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile.portfolio
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Remove Portfolio Item
exports.removePortfolioItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        if (!isValidObjectId(userId) || !isValidObjectId(itemId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID format'
            });
        }

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $pull: { portfolio: { _id: new mongoose.Types.ObjectId(itemId) } } },
            { new: true }
        ).populate('portfolio.project');

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Freelancer profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile.portfolio
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Experience
exports.updateExperience = async (req, res) => {
    try {
        const userId = req.user.id;
        const { experience } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: { experience } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Freelancer profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile.experience
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Education
exports.updateEducation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { education } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: { education } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Freelancer profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile.education
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get Top Freelancers
exports.getTopFreelancers = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const freelancers = await FreelancerProfile.find({
            'stats.completedProjects': { $gt: 0 }
        })
            .populate('user', 'firstName lastName email avatar')
            .populate('skills.skill')
            .sort({ 'rating.average': -1, 'stats.completedProjects': -1 })
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            data: freelancers
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
