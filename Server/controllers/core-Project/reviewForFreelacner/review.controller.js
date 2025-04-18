const Review = require('../../../models/review.model');
const Project = require('../../../models/project.model');



exports.createReview = async (req, res) => {
    try {
        const { project, reviewee, rating, comment, attributes } = req.body;
        const existingReview = await Review.findOne({ project, reviewer: req.user._id, reviewee });
        if (existingReview) { return res.status(400).json({ message: "Review already exists" }) }
        const newReview = await Review.create({
            project,
            reviewer: req.user._id,
            reviewee,
            rating,
            comment,
            attributes,
        });
        res.status(201).json({ success: true, data: newReview });

    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}