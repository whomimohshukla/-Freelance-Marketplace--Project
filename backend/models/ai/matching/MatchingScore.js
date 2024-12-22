const mongoose = require('mongoose');

const matchingScoreSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  scores: {
    skillMatch: {
      score: Number,
      matchedSkills: [String],
      totalRequired: Number
    },
    experienceMatch: {
      score: Number,
      relevantYears: Number
    },
    budgetMatch: {
      score: Number,
      withinRange: Boolean
    },
    availabilityMatch: {
      score: Number,
      availableHours: Number
    }
  },
  totalScore: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for quick lookups
matchingScoreSchema.index({ freelancerId: 1, projectId: 1 }, { unique: true });
matchingScoreSchema.index({ totalScore: -1 });

module.exports = mongoose.model('MatchingScore', matchingScoreSchema);
