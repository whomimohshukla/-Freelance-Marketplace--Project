const mongoose = require('mongoose');
const Review   = require('../../../../models/review.model');
const Project  = require('../../../../models/project.model');


exports.getProjectRatingStats = async (req, res) => {
    const { pid } = req.params;
    if (!mongoose.isValidObjectId(pid)) {
      return res.status(400).json({ success: false, error: 'Invalid project ID' });
    }
    const stats = await Review.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(pid) } },
      { $group: {
          _id: '$project',
          average: { $avg: '$rating' },
          count:   { $sum: 1 }
      }}
    ]);
    const { average = 0, count = 0 } = stats[0] || {};
    return res.json({ success: true, data: { project: pid, average, count } });
  };
  
  // 2) Recalculate & persist into project.rating
  exports.recalculateProjectRating = async (req, res) => {
    const { pid } = req.params;
    if (!mongoose.isValidObjectId(pid)) {
      return res.status(400).json({ success: false, error: 'Invalid project ID' });
    }
    const stats = await Review.aggregate([
      { $match: { project: new mongoose.Types.ObjectId(pid) } },
      { $group: {
          _id: '$project',
          avg:   { $avg: '$rating' },
          cnt:   { $sum: 1 }
      }}
    ]);
    const { avg = 0, cnt = 0 } = stats[0] || {};
    const proj = await Project.findByIdAndUpdate(pid, {
      'rating.average': avg,
      'rating.count':   cnt
    }, { new: true });
    return res.json({ success: true, data: proj.rating });
  };
