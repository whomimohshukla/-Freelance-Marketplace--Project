const FreelancerProfile = require('../../../models/freelancer.model');
const User = require('../../../models/user.model');
const Review = require('../../../models/review.model');
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

// Get current user's freelancer profile
exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await FreelancerProfile.findOne({ user: userId })
            .populate('skills.skill')
            .populate('user', 'firstName lastName email avatar');

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Freelancer profile not found' });
        }

        return res.status(200).json({ success: true, data: profile });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get Freelancer Profile
exports.getProfile = async (req, res) => {
    try {
        let { userId } = req.params;

        // Resolve non-ObjectId identifiers (username/email) to user _id
        if (!mongoose.isValidObjectId(userId)) {
            const userDoc = await User.findOne({
                $or: [
                    { username: userId },
                    { email: userId }
                ]
            }).select('_id');
            if (!userDoc) {
                return res.status(400).json({ success: false, error: 'Invalid user identifier' });
            }
            userId = userDoc._id;
        }

        const profile = await FreelancerProfile.findOne({ user: new mongoose.Types.ObjectId(userId) })
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

// Search Freelancers with comprehensive filters (aggregation for accurate filtering/pagination)
exports.searchFreelancers = async (req, res) => {
    try {
        const {
            q,                    // search query (name, title, bio)
            skills,               // comma-separated skill IDs or names
            minRate,
            maxRate,
            availability,         // Available, Partially Available, Not Available
            location,
            languages,            // comma-separated languages
            minRating,
            minExperience,        // minimum years of experience in any skill
            sort = 'relevance',   // relevance, rate_asc, rate_desc, rating, experience
            page = 1,
            limit = 10
        } = req.query;

        const numericPage = Math.max(1, parseInt(page));
        const numericLimit = Math.max(1, parseInt(limit));

        // Base match on FreelancerProfile fields
        const match = {};

        if (q) {
            match.$or = [
                { title: { $regex: q, $options: 'i' } },
                { bio: { $regex: q, $options: 'i' } }
            ];
        }

        // Rate range
        if (minRate || maxRate) {
            match.hourlyRate = {};
            if (minRate) match.hourlyRate.$gte = Number(minRate);
            if (maxRate) match.hourlyRate.$lte = Number(maxRate);
        }

        // Availability
        if (availability) {
            match['availability.status'] = availability;
        }

        // Languages
        if (languages) {
            const langArray = languages.split(',').map(l => l.trim());
            match['languages.language'] = { $in: langArray };
        }

        // Rating
        if (minRating) {
            match['rating.average'] = { $gte: Number(minRating) };
        }

        // Experience
        if (minExperience) {
            match['skills.yearsOfExperience'] = { $gte: Number(minExperience) };
        }

        // Skills (resolve names -> ids)
        if (skills) {
            const skillArray = skills.split(',').map(s => s.trim());
            const Skill = require('../../../models/skills.model');
            const skillDocs = await Skill.find({
                $or: [
                    { _id: { $in: skillArray.filter(s => mongoose.isValidObjectId(s)) } },
                    { name: { $in: skillArray } }
                ]
            }).select('_id');
            const skillIds = skillDocs.map(s => s._id);
            if (skillIds.length) {
                match['skills.skill'] = { $in: skillIds };
            }
        }

        // Sorting options mapping
        const sortStage = (() => {
            switch (sort) {
                case 'rate_asc':
                    return { hourlyRate: 1 };
                case 'rate_desc':
                    return { hourlyRate: -1 };
                case 'rating':
                    return { 'rating.average': -1 };
                case 'experience':
                    return { 'skills.yearsOfExperience': -1 };
                case 'relevance':
                default:
                    return { 'rating.average': -1, 'stats.completedProjects': -1 };
            }
        })();

        const pipeline = [
            { $match: match },
            // Bring in user document for location and basic fields
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
        ];

        if (location) {
            pipeline.push({
                $match: { 'user.location': { $regex: location, $options: 'i' } }
            });
        }

        // Lookup skill docs to attach names/categories similar to populate
        pipeline.push(
            {
                $lookup: {
                    from: 'skills',
                    localField: 'skills.skill',
                    foreignField: '_id',
                    as: 'skillsDocs'
                }
            },
            {
                $addFields: {
                    skills: {
                        $map: {
                            input: '$skills',
                            as: 's',
                            in: {
                                $mergeObjects: [
                                    '$$s',
                                    {
                                        skill: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: '$skillsDocs',
                                                        as: 'sd',
                                                        cond: { $eq: ['$$sd._id', '$$s.skill'] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            { $project: { skillsDocs: 0 } }
        );

        // Faceted pagination to get data and total after all filters (including location)
        pipeline.push(
            { $sort: sortStage },
            {
                $facet: {
                    data: [
                        { $skip: (numericPage - 1) * numericLimit },
                        { $limit: numericLimit },
                        // Project only necessary user fields
                        {
                            $project: {
                                'user.password': 0,
                                'user.__v': 0
                            }
                        }
                    ],
                    total: [ { $count: 'count' } ]
                }
            }
        );

        const aggResult = await FreelancerProfile.aggregate(pipeline);
        const data = (aggResult[0]?.data || []).map(doc => ({ ...doc }));
        const total = aggResult[0]?.total?.[0]?.count || 0;

        return res.status(200).json({
            success: true,
            data,
            pagination: {
                page: numericPage,
                limit: numericLimit,
                total,
                pages: Math.ceil(total / numericLimit)
            }
        });
    } catch (error) {
        console.error('Search freelancers error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get Freelancer Profile by ID
exports.getFreelancerProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid freelancer ID' });
        }

        const freelancer = await FreelancerProfile.findById(id)
            .populate('user', 'firstName lastName email avatar')
            .populate('skills.skill');

        if (!freelancer) {
            return res.status(404).json({ success: false, message: 'Freelancer not found' });
        }

        res.status(200).json({ success: true, data: freelancer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
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
