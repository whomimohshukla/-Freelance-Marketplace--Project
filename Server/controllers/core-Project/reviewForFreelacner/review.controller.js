const Review = require('../../../models/review.model');
const Project = require('../../../models/project.model');
const mongoose = require('mongoose');



const FreelancerProfile = require('../../../models/freelancer.model');

exports.createReview = async (req, res) => {
    try {
        const { project, reviewee, rating, comment, attributes } = req.body;
        // use authenticated user as reviewer
        const reviewer = req.user._id;

        const review = new Review({
            project,
            reviewer,
            reviewee,
            rating,
            comment,
            attributes
        });

        await review.save();

        // 👉 Find the freelancer profile
        const profile = await FreelancerProfile.findOne({ user: reviewee });
        if (profile) {
            const currentTotalRating = profile.rating.average * profile.rating.count;
            const newCount = profile.rating.count + 1;
            const newAverage = (currentTotalRating + rating) / newCount;

            profile.rating.average = newAverage;
            profile.rating.count = newCount;

            await profile.save();
        }

        // Attach new review and update project rating
        const proj = await Project.findById(project);
        if (proj) {
            proj.reviews.push(review._id);
            const projTotal = proj.rating.average * proj.rating.count;
            const newCount = proj.rating.count + 1;
            proj.rating.average = (projTotal + rating) / newCount;
            proj.rating.count = newCount;
            await proj.save();
        }

        res.status(201).json({ success: true, data: review });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


//get all review 

exports.getReviewsForFreelancer = async (req, res) => {
    try {
        const { freelancerId } = req.params;

        const reviews = await Review.find({ reviewee: freelancerId })
            .populate('reviewer', 'name avatar')
            .populate('project', 'title');

        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}


exports.updateReviewsForFreelancer = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        if (review.reviewer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'You can only update your own review' });
        }


        Object.assign(review, req.body);
        await review.save();

        res.status(200).json({ success: true, data: review });

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
exports.deleteReviewsForFreelancer = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        if (review.reviewer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'You can only delete your own review' });
        }



        await review.deleteOne();

        res.status(200).json({ success: true, data: review, message: 'Review deleted successfully' });

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

exports.getFreelancerRatingStats = async (req, res) => {
    try {
        const { freelancerId } = req.params;

        const stats = await Review.aggregate([
            { $match: { reviewee: new mongoose.Types.ObjectId(freelancerId) } },
            {
                $group: {
                    _id: '$reviewee',
                    avgRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    communication: { $avg: '$attributes.communication' },
                    quality: { $avg: '$attributes.quality' },
                    expertise: { $avg: '$attributes.expertise' },
                    professionalism: { $avg: '$attributes.professionalism' },
                    hireAgainRate: {
                        $avg: { $cond: [{ $eq: ['$attributes.hireAgain', true] }, 1, 0] },
                    },
                },
            },
        ]);

        res.status(200).json({ success: true, data: stats[0] || {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getMyGivenReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewer: req.user._id })
            .populate('reviewee', 'name avatar')
            .populate('project', 'title');

        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


//   createReview	>> Client	>> Freelancer	Create a new review
// getReviewsForFreelancer	>> Client	>> Freelancer	Show all reviews for a freelancer
// updateReviewsForFreelancer	>> Client	>> Freelancer	Edit an existing review
// deleteReviewsForFreelancer	>> Client	>> Freelancer	Remove a review they wrote   
// getMyGivenReviews	Client	Show all reviews for a freelancer
// updateReview	Client	Edit an existing review
// deleteReview	Client	Remove a review they wrote
// getFreelancerRatingStats	Everyone	Show average ratings and analytics