const ClientProfile = require('../../../models/client.model');
const User = require('../../../models/user.model');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

// Update Preferences
exports.updatePreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const { preferences } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID format' });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: { preferences }, $setOnInsert: { user: new mongoose.Types.ObjectId(userId) } },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({ success: true, data: profile.preferences || {} });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

// Search users by email/name for team invite
exports.searchTeamUsers = async (req, res) => {
    try {
        const { q = '' } = req.query;
        if (!q || String(q).trim().length < 2) {
            return res.json({ success: true, data: [] });
        }
        const regex = new RegExp(String(q).trim(), 'i');
        const users = await User.find({
            $or: [
                { email: regex },
                { firstName: regex },
                { lastName: regex },
            ],
            isDeleted: { $ne: true },
        })
            .select('firstName lastName email avatar role')
            .limit(10)
            .lean();
        return res.json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

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

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: updateData, $setOnInsert: { user: new mongoose.Types.ObjectId(userId) } },
            { new: true, upsert: true, runValidators: true }
        ).populate(['user', 'industry', 'hiring.preferredSkills', 'projects.active', 'projects.completed']);

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
        // If no userId param provided, default to authenticated user's ID
        let { userId } = req.params;
        if (!userId && req.user) {
            userId = req.user.id;
        }

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
            return res.status(200).json({ success: true, data: null });
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
            { $set: { company }, $setOnInsert: { user: new mongoose.Types.ObjectId(userId) } },
            { new: true, upsert: true, runValidators: true }
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

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: { businessDetails }, $setOnInsert: { user: new mongoose.Types.ObjectId(userId) } },
            { new: true, upsert: true, runValidators: true }
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
                },
                $setOnInsert: { user: new mongoose.Types.ObjectId(userId) }
            },
            { new: true, upsert: true, runValidators: true }
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

// Update Financials (partial-safe)
exports.updateFinancials = async (req, res) => {
    try {
        const userId = req.user.id;
        const { financials } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID format' });
        }
        if (!financials || typeof financials !== 'object') {
            return res.status(400).json({ success: false, error: 'Invalid financials payload' });
        }

        // Build partial $set update to avoid wiping sub-docs when omitted
        const set = {};
        if (Object.prototype.hasOwnProperty.call(financials, 'currency')) set['financials.currency'] = financials.currency;
        if (Object.prototype.hasOwnProperty.call(financials, 'billingEmail')) set['financials.billingEmail'] = financials.billingEmail;
        if (Object.prototype.hasOwnProperty.call(financials, 'invoiceNotes')) set['financials.invoiceNotes'] = financials.invoiceNotes;
        if (Object.prototype.hasOwnProperty.call(financials, 'billingAddress')) set['financials.billingAddress'] = financials.billingAddress || {};
        if (Object.prototype.hasOwnProperty.call(financials, 'paymentMethods')) set['financials.paymentMethods'] = financials.paymentMethods || [];

        const profile = await ClientProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId) },
            { $set: set, $setOnInsert: { user: new mongoose.Types.ObjectId(userId) } },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({ success: true, data: profile.financials });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

// Add Payment Method
exports.addPaymentMethod = async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentMethod } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID format' });
        }
        if (!paymentMethod || !paymentMethod.type) {
            return res.status(400).json({ success: false, error: 'Invalid payment method payload' });
        }
        const validTypes = ['Credit Card', 'PayPal', 'Bank Transfer'];
        if (!validTypes.includes(paymentMethod.type)) {
            return res.status(400).json({ success: false, error: 'Unsupported payment method type' });
        }
        // Normalize and validate
        if (paymentMethod.type === 'Credit Card') {
            if (!paymentMethod.lastFour || !/^\d{4}$/.test(String(paymentMethod.lastFour))) {
                return res.status(400).json({ success: false, error: 'lastFour must be 4 digits' });
            }
            // Allow MM/YY string (from older clients) or Date/ISO string
            if (paymentMethod.expiryDate && typeof paymentMethod.expiryDate === 'string' && /^(\d{2})\/(\d{2})$/.test(paymentMethod.expiryDate)) {
                const [, mm, yy] = paymentMethod.expiryDate.match(/^(\d{2})\/(\d{2})$/);
                const year = 2000 + Number(yy);
                const monthIndex = Math.max(0, Math.min(11, Number(mm) - 1));
                paymentMethod.expiryDate = new Date(Date.UTC(year, monthIndex, 1));
            }
        } else {
            delete paymentMethod.lastFour;
            delete paymentMethod.expiryDate;
        }

        // Ensure single default
        const profile = await ClientProfile.findOne({ user: new mongoose.Types.ObjectId(userId) });
        if (!profile) {
            return res.status(404).json({ success: false, error: 'Client profile not found' });
        }
        if (!Array.isArray(profile.financials?.paymentMethods)) profile.financials.paymentMethods = [];
        if (paymentMethod.isDefault) {
            profile.financials.paymentMethods.forEach(m => m.isDefault = false);
        }
        profile.financials.paymentMethods.push(paymentMethod);
        await profile.save();

        return res.status(200).json({ success: true, data: profile.financials.paymentMethods });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
};

// Remove Payment Method
exports.removePaymentMethod = async (req, res) => {
    try {
        const userId = req.user.id;
        const { methodId } = req.params;

        if (!isValidObjectId(userId) || !isValidObjectId(methodId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }

        const profile = await ClientProfile.findOne({ user: new mongoose.Types.ObjectId(userId) });
        if (!profile) return res.status(404).json({ success: false, error: 'Client profile not found' });
        const before = profile.financials?.paymentMethods?.length || 0;
        profile.financials.paymentMethods = (profile.financials.paymentMethods || []).filter(m => String(m._id) !== String(methodId));
        if (profile.financials.paymentMethods.length === before) {
            return res.status(404).json({ success: false, error: 'Payment method not found' });
        }
        await profile.save();
        return res.status(200).json({ success: true, data: profile.financials.paymentMethods });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
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