const express = require('express');
const {
    createReview, getReviewsForFreelancer, updateReviewsForFreelancer,
    deleteReviewsForFreelancer, getFreelancerRatingStats,getMyGivenReviews
} = require('../controllers/core-Project/reviewForFreelacner/review.controller');
const auth=require("../middleware/auth.middleware")

const router = express.Router();

router.post('/createReview', auth, createReview);
router.get('/freelancer/:freelancerId', getReviewsForFreelancer);
router.get('/my', auth, getMyGivenReviews);
router.put('/:id', auth, updateReviewsForFreelancer);
router.delete('/:id', auth, deleteReviewsForFreelancer);
router.get('/freelancer/:freelancerId/stats', getFreelancerRatingStats);

module.exports = router;
