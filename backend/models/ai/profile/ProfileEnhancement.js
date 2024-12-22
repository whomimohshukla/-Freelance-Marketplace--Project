const mongoose = require('mongoose');

const profileSuggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  suggestions: [{
    type: {
      type: String,
      enum: ['skill', 'description', 'portfolio', 'rate'],
      required: true
    },
    suggestion: String,
    reason: String,
    impact: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  keywords: [{
    word: String,
    relevance: Number,
    category: String
  }],
  profileScore: {
    overall: Number,
    sections: {
      completeness: Number,
      clarity: Number,
      keywords: Number,
      portfolio: Number
    }
  },
  lastAnalyzed: {
    type: Date,
    default: Date.now
  }
});

// Methods for profile enhancement
profileSuggestionSchema.methods.addSuggestion = function(suggestion) {
  this.suggestions.push(suggestion);
  return this.save();
};

profileSuggestionSchema.methods.updateSuggestionStatus = function(suggestionId, status) {
  const suggestion = this.suggestions.id(suggestionId);
  if (suggestion) {
    suggestion.status = status;
    return this.save();
  }
  return Promise.reject(new Error('Suggestion not found'));
};

module.exports = mongoose.model('ProfileSuggestion', profileSuggestionSchema);
