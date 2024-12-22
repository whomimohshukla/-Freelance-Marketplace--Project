const mongoose = require('mongoose');

const skillAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skill: {
    name: String,
    category: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  },
  assessment: {
    codeQuality: {
      score: Number,
      feedback: [String]
    },
    bestPractices: {
      score: Number,
      feedback: [String]
    },
    problemSolving: {
      score: Number,
      feedback: [String]
    },
    efficiency: {
      score: Number,
      feedback: [String]
    }
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  submissions: [{
    code: String,
    language: String,
    testResults: [{
      testCase: String,
      passed: Boolean,
      output: String,
      executionTime: Number
    }],
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  recommendations: [{
    type: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    category: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient querying
skillAssessmentSchema.index({ userId: 1, 'skill.name': 1 });

// Methods for skill assessment
skillAssessmentSchema.methods.addSubmission = function(submission) {
  this.submissions.push(submission);
  return this.save();
};

skillAssessmentSchema.methods.updateOverallScore = function() {
  const weights = {
    codeQuality: 0.3,
    bestPractices: 0.3,
    problemSolving: 0.2,
    efficiency: 0.2
  };

  this.overallScore = 
    this.assessment.codeQuality.score * weights.codeQuality +
    this.assessment.bestPractices.score * weights.bestPractices +
    this.assessment.problemSolving.score * weights.problemSolving +
    this.assessment.efficiency.score * weights.efficiency;

  return this.save();
};

module.exports = mongoose.model('SkillAssessment', skillAssessmentSchema);
