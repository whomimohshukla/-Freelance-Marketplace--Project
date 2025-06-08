const ClientProfile = require('../../../models/client.model');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

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
            if (!isValidObjectId(industry)) {
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

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        // Validate ObjectIds in updateData
        if (updateData.industry && !isValidObjectId(updateData.industry)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid industry ID format'
            });
        }

        if (updateData.hiring?.preferredSkills) {
            const invalidSkills = updateData.hiring.preferredSkills.filter(id => !isValidObjectId(id));
            if (invalidSkills.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid skill IDs: ${invalidSkills.join(', ')}`
                });
            }
            updateData.hiring.preferredSkills = updateData.hiring.preferredSkills.map(id => 
                new mongoose.Types.ObjectId(id)
            );
        }

        let profile = await ClientProfile.findOne({ user: userId });

        if (profile) {
            profile = await ClientProfile.findOneAndUpdate(
                { user: userId },
                { $set: updateData },
                { new: true, runValidators: true }
            ).populate(['user', 'industry', 'hiring.preferredSkills', 'projects.active', 'projects.completed']);
        } else {
            updateData.user = new mongoose.Types.ObjectId(userId);
            profile = await ClientProfile.create(updateData);
            await profile.populate(['user', 'industry', 'hiring.preferredSkills']);
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
        const { userId } = req.params;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await ClientProfile.findOne({ user: new mongoose.Types.ObjectId(userId) })
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

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: { company } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Client profile not found'
            });
        }

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

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: { businessDetails } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Client profile not found'
            });
        }

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

// Add Team Member
exports.addTeamMember = async (req, res) => {
    try {
        const userId = req.user.id;
        const { teamMember } = req.body;

        if (!isValidObjectId(userId) || !isValidObjectId(teamMember.user)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { 
                $push: { 
                    team: {
                        ...teamMember,
                        user: new mongoose.Types.ObjectId(teamMember.user)
                    }
                }
            },
            { new: true, runValidators: true }
        ).populate('team.user', 'firstName lastName email avatar');

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Client profile not found'
            });
        }

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
        const { memberId } = req.params;

        if (!isValidObjectId(userId) || !isValidObjectId(memberId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID format'
            });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $pull: { team: { _id: new mongoose.Types.ObjectId(memberId) } } },
            { new: true }
        ).populate('team.user', 'firstName lastName email avatar');

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Client profile not found'
            });
        }

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

// Update Financials
exports.updateFinancials = async (req, res) => {
    try {
        const userId = req.user.id;
        const { financials } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: { financials } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Client profile not found'
            });
        }

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

// Add Payment Method
exports.addPaymentMethod = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentMethod } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $push: { 'financials.paymentMethods': paymentMethod } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Client profile not found'
            });
        }

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
        const { methodId } = req.params;

        if (!isValidObjectId(userId) || !isValidObjectId(methodId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID format'
            });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $pull: { 'financials.paymentMethods': { _id: new mongoose.Types.ObjectId(methodId) } } },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Client profile not found'
            });
        }

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

// Update Stats
exports.updateStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { stats } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: { stats } },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Client profile not found'
            });
        }

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