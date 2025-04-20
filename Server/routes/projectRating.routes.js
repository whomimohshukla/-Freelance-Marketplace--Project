// routes/rating.routes.js
const router = require('express').Router({ mergeParams: true });
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/core-Project/Project-crud/sub-project.controllers/projectRating');

router.get('/:pid/stats', ctrl.getProjectRatingStats);
router.post('/:pid/recalculate',   auth, ctrl.recalculateProjectRating);
// router.post('/:pid/recalculate', auth.admin, ctrl.recalculateProjectRating);

module.exports = router;