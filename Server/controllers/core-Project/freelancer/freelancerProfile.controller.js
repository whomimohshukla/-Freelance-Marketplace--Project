const FreelancerProfile = require('../../../models/freelancer.model');
const User = require('../../../models/user.model');
const mongoose = require('mongoose');

// Create or Update Freelancer Profile
exports.createOrUpdateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming auth middleware sets user

        let profile = await FreelancerProfile.findOne({ user: userId });
        const updateData = { ...req.body };

        if (profile) {
            // Update existing profile
            profile = await FreelancerProfile.findOneAndUpdate(
                { user: userId },
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate('skills.skill');
        } else {
            // Create new profile
            updateData.user = userId;
            profile = await FreelancerProfile.create(updateData);
            profile = await profile.populate('skills.skill');
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
        const profile = await FreelancerProfile.findOne({ user: req.params.userId })
            .populate('skills.skill')
            .populate('user', 'firstName lastName email avatar');

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

// Update Portfolio
exports.updatePortfolio = async (req, res) => {
    try {
        const userId = req.user.id;
        const { portfolioItem } = req.body;

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            { $push: { portfolio: portfolioItem } },
            { new: true, runValidators: true }
        );

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

// Update Skills
exports.updateSkills = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skills } = req.body;

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            { $set: { skills } },
            { new: true, runValidators: true }
        ).populate('skills.skill');

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

// Update Work Experience
exports.updateWorkExperience = async (req, res) => {
    try {
        const userId = req.user.id;
        const { workExperience } = req.body;

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            { $push: { workExperience } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.workExperience
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

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            { $push: { education } },
            { new: true, runValidators: true }
        );

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

// Update Certifications
exports.updateCertifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { certification } = req.body;

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            { $push: { certifications: certification } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.certifications
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Availability
exports.updateAvailability = async (req, res) => {
    try {
        const userId = req.user.id;
        const { availability } = req.body;

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            { $set: { availability } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.availability
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Search Freelancers
exports.searchFreelancers = async (req, res) => {
    try {
        const {
            skills,
            hourlyRateMin,
            hourlyRateMax,
            availability,
            rating,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        // Properly convert skill IDs to ObjectId
        if (skills) {
            try {
                const skillIds = skills.split(',');
                const skillIdArray = skillIds
                    .map(id => id.trim())
                    .filter(id => id.length > 0)
                    .map(id => {
                        if (!mongoose.isValidObjectId(id)) {
                            throw new Error(`Invalid skill ID format: ${id}`);
                        }
                        return new mongoose.Types.ObjectId(id);
                    });

                if (skillIdArray.length > 0) {
                    query['skills.skill'] = { $in: skillIdArray };
                }
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }
        }

        if (hourlyRateMin || hourlyRateMax) {
            query.hourlyRate = {};
            if (hourlyRateMin) query.hourlyRate.$gte = Number(hourlyRateMin);
            if (hourlyRateMax) query.hourlyRate.$lte = Number(hourlyRateMax);
        }

        if (availability) {
            query['availability.status'] = availability;
        }

        if (rating) {
            query['rating.average'] = { $gte: Number(rating) };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const freelancers = await FreelancerProfile.find(query)
            .populate('user', 'firstName lastName email avatar')
            .populate('skills.skill')
            .skip(skip)
            .limit(Number(limit))
            .sort({ 'rating.average': -1 });

        const total = await FreelancerProfile.countDocuments(query);

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

// Get Top Rated Freelancers
exports.getTopRatedFreelancers = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const freelancers = await FreelancerProfile.find({
            'rating.count': { $gt: 0 }
        })
            .populate('user', 'firstName lastName email avatar')
            .populate('skills.skill')
            .sort({ 'rating.average': -1 })
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
// Update Profile Stats
exports.updateStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { stats } = req.body;

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            { $set: { stats } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.stats
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Social Profiles
exports.updateSocialProfiles = async (req, res) => {
    try {
        const userId = req.user.id;
        const { socialProfiles } = req.body;

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            { $set: { socialProfiles } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.socialProfiles
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete Portfolio Item
exports.deletePortfolioItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { portfolioId } = req.params;

        const profile = await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            { $pull: { portfolio: { _id: portfolioId } } },
            { new: true }
        );

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

// Get Top Rated Freelancers
exports.getTopRatedFreelancers = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const freelancers = await FreelancerProfile.find({
            'rating.count': { $gt: 0 }
        })
            .populate('user', 'firstName lastName email avatar')
            .populate('skills.skill')
            .sort({ 'rating.average': -1 })
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
