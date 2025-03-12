const ClientProfile = require('../models/client.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// Search Clients
exports.searchClients = async (req, res) => {
    try {
        const {
            industry,
            businessType,
            minRating,
            projectBudget,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (industry) {
            if (!mongoose.isValidObjectId(industry)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid industry ID format'
                });
            }
            query.industry = new mongoose.Types.ObjectId(industry);
        }

        if (businessType) {
            query['businessDetails.type'] = businessType;
        }

        if (minRating) {
            query['rating.average'] = { $gte: Number(minRating) };
        }

        if (projectBudget) {
            query['financials.activeProjectsBudget'] = { $gte: Number(projectBudget) };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const clients = await ClientProfile.find(query)
            .populate('user', 'firstName lastName email avatar')
            .populate('industry')
            .populate('hiring.preferredSkills')
            .skip(skip)
            .limit(Number(limit))
            .sort({ 'rating.average': -1 });

        const total = await ClientProfile.countDocuments(query);

        res.status(200).json({
            success: true,
            data: clients,
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

// Create or Update Client Profile
exports.createOrUpdateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = { ...req.body };

        // Convert ObjectIds
        if (updateData.industry) {
            updateData.industry = new mongoose.Types.ObjectId(updateData.industry);
        }
        if (updateData.hiring?.preferredSkills) {
            updateData.hiring.preferredSkills = updateData.hiring.preferredSkills
                .map(skillId => new mongoose.Types.ObjectId(skillId));
        }

        let profile = await ClientProfile.findOne({ user: userId });

        if (profile) {
            profile = await ClientProfile.findOneAndUpdate(
                { user: userId },
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate(['industry', 'hiring.preferredSkills']);
        } else {
            updateData.user = userId;
            profile = await ClientProfile.create(updateData);
            profile = await profile.populate(['industry', 'hiring.preferredSkills']);
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

// Get Client Profile
exports.getProfile = async (req, res) => {
    try {
        const profile = await ClientProfile.findOne({ user: req.params.userId })
            .populate('user', 'firstName lastName email avatar')
            .populate('industry')
            .populate('hiring.preferredSkills')
            .populate('projects.active')
            .populate('projects.completed')
            .populate('team.user', 'firstName lastName email avatar');

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Client profile not found'
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

// Update Company Details
exports.updateCompany = async (req, res) => {
    try {
        const userId = req.user.id;
        const { company } = req.body;

        const profile = await ClientProfile.findOneAndUpdate(
            { user: userId },
            { $set: { company } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.company
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Business Details
exports.updateBusinessDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { businessDetails } = req.body;

        const profile = await ClientProfile.findOneAndUpdate(
            { user: userId },
            { $set: { businessDetails } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.businessDetails
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Hiring Preferences
exports.updateHiring = async (req, res) => {
    try {
        const userId = req.user.id;
        const hiring = { ...req.body.hiring };

        if (hiring.preferredSkills) {
            hiring.preferredSkills = hiring.preferredSkills
                .map(skillId => new mongoose.Types.ObjectId(skillId));
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: userId },
            { $set: { hiring } },
            { new: true, runValidators: true }
        ).populate('hiring.preferredSkills');

        res.status(200).json({
            success: true,
            data: profile.hiring
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Financial Information
exports.updateFinancials = async (req, res) => {
    try {
        const userId = req.user.id;
        const { financials } = req.body;

        const profile = await ClientProfile.findOneAndUpdate(
            { user: userId },
            { $set: { financials } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.financials
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Add Team Member
exports.addTeamMember = async (req, res) => {
    try {
        const userId = req.user.id;
        const { teamMember } = req.body;

        if (!mongoose.isValidObjectId(teamMember.user)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        teamMember.user = new mongoose.Types.ObjectId(teamMember.user);

        const profile = await ClientProfile.findOneAndUpdate(
            { user: userId },
            { $push: { team: teamMember } },
            { new: true, runValidators: true }
        ).populate('team.user', 'firstName lastName email avatar');

        res.status(200).json({
            success: true,
            data: profile.team
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Remove Team Member
exports.removeTeamMember = async (req, res) => {
    try {
        const userId = req.user.id;
        const { teamMemberId } = req.params;

        const profile = await ClientProfile.findOneAndUpdate(
            { user: userId },
            { $pull: { team: { _id: teamMemberId } } },
            { new: true }
        ).populate('team.user', 'firstName lastName email avatar');

        res.status(200).json({
            success: true,
            data: profile.team
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Stats
exports.updateStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { stats } = req.body;

        const profile = await ClientProfile.findOneAndUpdate(
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

        const profile = await ClientProfile.findOneAndUpdate(
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

// Update Preferences
exports.updatePreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const { preferences } = req.body;

        const profile = await ClientProfile.findOneAndUpdate(
            { user: userId },
            { $set: { preferences } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.preferences
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Add Payment Method
exports.addPaymentMethod = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentMethod } = req.body;

        const profile = await ClientProfile.findOneAndUpdate(
            { user: userId },
            { $push: { 'financials.paymentMethods': paymentMethod } },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: profile.financials.paymentMethods
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Remove Payment Method
exports.removePaymentMethod = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentMethodId } = req.params;

        const profile = await ClientProfile.findOneAndUpdate(
            { user: userId },
            { $pull: { 'financials.paymentMethods': { _id: paymentMethodId } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: profile.financials.paymentMethods
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get Top Clients
exports.getTopClients = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const clients = await ClientProfile.find({
            'stats.completedProjects': { $gt: 0 }
        })
            .populate('user', 'firstName lastName email avatar')
            .populate('industry')
            .sort({ 'stats.totalProjects': -1, 'rating.average': -1 })
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            data: clients
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
