const mongoose = require('mongoose');

const priceDataSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    index: true
  },
  skillSet: {
    type: [String],
    index: true
  },
  complexity: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    required: true
  },
  completedProjects: [{
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    finalPrice: Number,
    duration: Number,
    clientSatisfaction: Number
  }],
  marketStats: {
    averageRate: Number,
    minRate: Number,
    maxRate: Number,
    lastUpdated: Date
  },
  region: {
    type: String,
    index: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  }
});

// Compound index for efficient querying
priceDataSchema.index({ category: 1, complexity: 1, region: 1 });

module.exports = mongoose.model('PriceData', priceDataSchema);
