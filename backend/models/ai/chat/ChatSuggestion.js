const mongoose = require('mongoose');

const chatPatternSchema = new mongoose.Schema({
  intent: {
    type: String,
    required: true,
    index: true
  },
  patterns: [{
    type: String,
    required: true
  }],
  responses: [{
    template: {
      type: String,
      required: true
    },
    context: {
      type: String,
      enum: ['greeting', 'pricing', 'timeline', 'technical', 'general'],
      required: true
    },
    tone: {
      type: String,
      enum: ['formal', 'casual', 'professional'],
      default: 'professional'
    }
  }],
  quickReplies: [{
    text: String,
    action: String
  }],
  metadata: {
    category: String,
    useCount: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    lastUsed: Date
  }
});

// Index for pattern matching
chatPatternSchema.index({ patterns: 'text' });

// Methods for chat suggestions
chatPatternSchema.methods.incrementUseCount = function() {
  this.metadata.useCount += 1;
  this.metadata.lastUsed = new Date();
  return this.save();
};

chatPatternSchema.methods.updateSuccessRate = function(wasSuccessful) {
  const currentTotal = this.metadata.useCount;
  const currentSuccess = this.metadata.successRate * currentTotal;
  this.metadata.successRate = (currentSuccess + (wasSuccessful ? 1 : 0)) / (currentTotal + 1);
  return this.save();
};

module.exports = mongoose.model('ChatPattern', chatPatternSchema);
