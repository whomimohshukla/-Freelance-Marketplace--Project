const Review = require('../../../models/review.model');
const FreelancerProfile = require('../../../models/freelancer.model');
const User = require('../../../models/user.model');
const mongoose = require('mongoose');

// Get Detailed Freelancer Profile with Reviews (for public viewing)
exports.getDetailedProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // Resolve user ID if username/email provided
        let resolvedUserId = userId;
        if (!mongoose.isValidObjectId(userId)) {
            const userDoc = await User.findOne({
                $or: [
                    { username: userId },
                    { email: userId }
                ]
            }).select('_id');
            if (!userDoc) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }
            resolvedUserId = userDoc._id;
        }

        // Get freelancer profile
        const profile = await FreelancerProfile.findOne({ user: resolvedUserId })
            .populate('user', 'firstName lastName email avatar location createdAt')
            .populate('skills.skill', 'name category')
            .lean();

        if (!profile) {
            return res.status(404).json({ success: false, error: 'Freelancer profile not found' });
        }

        // Get reviews for this freelancer
        const reviews = await Review.find({ reviewee: resolvedUserId })
            .populate('reviewer', 'firstName lastName avatar')
            .populate('project', 'title')
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        // Calculate detailed rating breakdown
        const ratingBreakdown = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        const attributeRatings = {
            communication: [],
            quality: [],
            expertise: [],
            professionalism: []
        };

        reviews.forEach(review => {
            ratingBreakdown[Math.floor(review.rating)]++;
            if (review.attributes) {
                if (review.attributes.communication) attributeRatings.communication.push(review.attributes.communication);
                if (review.attributes.quality) attributeRatings.quality.push(review.attributes.quality);
                if (review.attributes.expertise) attributeRatings.expertise.push(review.attributes.expertise);
                if (review.attributes.professionalism) attributeRatings.professionalism.push(review.attributes.professionalism);
            }
        });

        const averageAttributes = {
            communication: attributeRatings.communication.length ? 
                (attributeRatings.communication.reduce((a, b) => a + b, 0) / attributeRatings.communication.length).toFixed(1) : null,
            quality: attributeRatings.quality.length ? 
                (attributeRatings.quality.reduce((a, b) => a + b, 0) / attributeRatings.quality.length).toFixed(1) : null,
            expertise: attributeRatings.expertise.length ? 
                (attributeRatings.expertise.reduce((a, b) => a + b, 0) / attributeRatings.expertise.length).toFixed(1) : null,
            professionalism: attributeRatings.professionalism.length ? 
                (attributeRatings.professionalism.reduce((a, b) => a + b, 0) / attributeRatings.professionalism.length).toFixed(1) : null
        };

        res.status(200).json({
            success: true,
            data: {
                ...profile,
                reviews,
                ratingBreakdown,
                averageAttributes,
                reviewCount: reviews.length
            }
        });
    } catch (error) {
        console.error('Get detailed profile error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get Reviews for a Freelancer (paginated)
exports.getFreelancerReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10, rating } = req.query;

        let resolvedUserId = userId;
        if (!mongoose.isValidObjectId(userId)) {
            const userDoc = await User.findOne({
                $or: [{ username: userId }, { email: userId }]
            }).select('_id');
            if (!userDoc) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }
            resolvedUserId = userDoc._id;
        }

        const filter = { reviewee: resolvedUserId };
        if (rating) {
            filter.rating = Number(rating);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [reviews, total] = await Promise.all([
            Review.find(filter)
                .populate('reviewer', 'firstName lastName avatar')
                .populate('project', 'title')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Review.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create Review (after project completion)
exports.createReview = async (req, res) => {
    try {
        const reviewerId = req.user.id;
        const { projectId, revieweeId, rating, comment, attributes } = req.body;

        // Validate inputs
        if (!projectId || !revieweeId || !rating || !comment) {
            return res.status(400).json({ 
                success: false, 
                error: 'Project ID, reviewee ID, rating, and comment are required' 
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            project: projectId,
            reviewer: reviewerId,
            reviewee: revieweeId
        });

        if (existingReview) {
            return res.status(400).json({ 
                success: false, 
                error: 'You have already reviewed this user for this project' 
            });
        }

        // Create review
        const review = await Review.create({
            project: projectId,
            reviewer: reviewerId,
            reviewee: revieweeId,
            rating: Number(rating),
            comment,
            attributes: attributes || {}
        });

        // Update freelancer rating
        await updateFreelancerRating(revieweeId);

        const populatedReview = await Review.findById(review._id)
            .populate('reviewer', 'firstName lastName avatar')
            .populate('reviewee', 'firstName lastName avatar')
            .populate('project', 'title');

        res.status(201).json({
            success: true,
            data: populatedReview
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update Review
exports.updateReview = async (req, res) => {
    try {
        const reviewerId = req.user.id;
        const { reviewId } = req.params;
        const { rating, comment, attributes } = req.body;

        const review = await Review.findOne({ _id: reviewId, reviewer: reviewerId });

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                error: 'Review not found or you are not authorized to update it' 
            });
        }

        // Update fields
        if (rating) review.rating = Number(rating);
        if (comment) review.comment = comment;
        if (attributes) review.attributes = { ...review.attributes, ...attributes };

        await review.save();

        // Recalculate freelancer rating
        await updateFreelancerRating(review.reviewee);

        const populatedReview = await Review.findById(review._id)
            .populate('reviewer', 'firstName lastName avatar')
            .populate('reviewee', 'firstName lastName avatar')
            .populate('project', 'title');

        res.status(200).json({
            success: true,
            data: populatedReview
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete Review
exports.deleteReview = async (req, res) => {
    try {
        const reviewerId = req.user.id;
        const { reviewId } = req.params;

        const review = await Review.findOneAndDelete({ _id: reviewId, reviewer: reviewerId });

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                error: 'Review not found or you are not authorized to delete it' 
            });
        }

        // Recalculate freelancer rating
        await updateFreelancerRating(review.reviewee);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Helper: Update Freelancer Rating (called after review changes)
async function updateFreelancerRating(userId) {
    try {
        const reviews = await Review.find({ reviewee: userId });
        
        if (reviews.length === 0) {
            await FreelancerProfile.findOneAndUpdate(
                { user: userId },
                { $set: { 'rating.average': 0, 'rating.count': 0 } }
            );
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await FreelancerProfile.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    'rating.average': parseFloat(averageRating.toFixed(2)),
                    'rating.count': reviews.length
                }
            }
        );
    } catch (error) {
        console.error('Update rating error:', error);
        throw error;
    }
}

module.exports = exports;
