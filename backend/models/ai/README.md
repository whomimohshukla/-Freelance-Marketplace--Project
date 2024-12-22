# AI Feature Models

## 1. Project Matching Model
```javascript
// models/ai/MatchingScore.js
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

// Matching Service
class MatchingService {
  async calculateMatchScore(freelancerId, projectId) {
    const freelancer = await FreelancerProfile.findOne({ userId: freelancerId });
    const project = await Project.findById(projectId);
    
    const skillScore = this.calculateSkillMatch(freelancer.skills, project.requiredSkills);
    const experienceScore = this.calculateExperienceMatch(freelancer.experience, project.requiredExperience);
    const budgetScore = this.calculateBudgetMatch(freelancer.hourlyRate, project.budget);
    
    const totalScore = (skillScore * 0.4) + (experienceScore * 0.3) + (budgetScore * 0.3);
    
    return totalScore;
  }
}
```

## 2. Price Suggestion Model
```javascript
// models/ai/PriceSuggestion.js
const priceDataSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  skillSet: [String],
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
  }
});

// Price Suggestion Service
class PriceSuggestionService {
  async suggestPrice(projectDetails) {
    const { category, skills, complexity } = projectDetails;
    
    const similarProjects = await this.findSimilarProjects(category, skills);
    const marketRates = await this.calculateMarketRates(similarProjects);
    
    return {
      suggested: marketRates.average,
      range: {
        min: marketRates.min,
        max: marketRates.max
      },
      confidence: this.calculateConfidence(similarProjects.length)
    };
  }
}
```

## 3. Profile Enhancement Model
```javascript
// models/ai/ProfileEnhancement.js
const profileSuggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    }
  }],
  keywords: [{
    word: String,
    relevance: Number
  }],
  lastAnalyzed: Date
});

// Profile Enhancement Service
class ProfileEnhancementService {
  async analyzeProfile(userId) {
    const profile = await FreelancerProfile.findOne({ userId });
    const suggestions = [];
    
    // Check profile completeness
    const completenessScore = this.calculateCompleteness(profile);
    if (completenessScore < 0.8) {
      suggestions.push(...this.generateCompletionSuggestions(profile));
    }
    
    // Analyze keywords
    const keywordSuggestions = this.analyzeKeywords(profile.description);
    suggestions.push(...keywordSuggestions);
    
    return {
      suggestions,
      completenessScore,
      impactAreas: this.identifyImpactAreas(profile)
    };
  }
}
```

## 4. Skill Assessment Model
```javascript
// models/ai/SkillAssessment.js
const skillAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    name: String,
    category: String
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
    }
  },
  overallScore: Number,
  submissions: [{
    code: String,
    language: String,
    testResults: [{
      testCase: String,
      passed: Boolean,
      output: String
    }],
    submittedAt: Date
  }]
});

// Skill Assessment Service
class SkillAssessmentService {
  async assessSkill(submission) {
    const { code, language, skill } = submission;
    
    const codeAnalysis = this.analyzeCode(code, language);
    const testResults = await this.runTests(code, skill);
    
    return {
      score: this.calculateOverallScore(codeAnalysis, testResults),
      feedback: this.generateFeedback(codeAnalysis, testResults),
      recommendations: this.generateRecommendations(codeAnalysis)
    };
  }
}
```

## 5. Smart Chat Model
```javascript
// models/ai/ChatSuggestion.js
const chatPatternSchema = new mongoose.Schema({
  intent: {
    type: String,
    required: true
  },
  patterns: [String],
  responses: [{
    template: String,
    context: {
      type: String,
      enum: ['greeting', 'pricing', 'timeline', 'technical', 'general']
    }
  }],
  quickReplies: [String]
});

// Chat Suggestion Service
class ChatSuggestionService {
  async suggestResponse(message, context) {
    const intent = this.detectIntent(message);
    const suggestions = await this.findResponseTemplates(intent, context);
    
    return {
      suggestions: this.customizeResponses(suggestions, context),
      quickReplies: this.getRelevantQuickReplies(intent)
    };
  }
}
```

## Implementation Example

Here's how to use these models and services:

```javascript
// Example usage in a controller

// Project Matching
const matchingService = new MatchingService();
const matches = await matchingService.findMatches(projectId);

// Price Suggestion
const pricingService = new PriceSuggestionService();
const priceRange = await pricingService.suggestPrice(projectDetails);

// Profile Enhancement
const profileService = new ProfileEnhancementService();
const suggestions = await profileService.analyzeProfile(userId);

// Skill Assessment
const assessmentService = new SkillAssessmentService();
const assessment = await assessmentService.assessSkill(submission);

// Chat Suggestions
const chatService = new ChatSuggestionService();
const responses = await chatService.suggestResponse(message);
```

## API Routes

```javascript
// routes/ai.js
const router = express.Router();

// Project Matching
router.post('/match', async (req, res) => {
  const { projectId, freelancerId } = req.body;
  const matches = await matchingService.calculateMatchScore(freelancerId, projectId);
  res.json(matches);
});

// Price Suggestion
router.post('/suggest-price', async (req, res) => {
  const { projectDetails } = req.body;
  const suggestion = await pricingService.suggestPrice(projectDetails);
  res.json(suggestion);
});

// Profile Enhancement
router.get('/enhance-profile/:userId', async (req, res) => {
  const suggestions = await profileService.analyzeProfile(req.params.userId);
  res.json(suggestions);
});

// Skill Assessment
router.post('/assess-skill', async (req, res) => {
  const assessment = await assessmentService.assessSkill(req.body);
  res.json(assessment);
});

// Chat Suggestions
router.post('/suggest-response', async (req, res) => {
  const { message, context } = req.body;
  const suggestions = await chatService.suggestResponse(message, context);
  res.json(suggestions);
});
```

Would you like me to:
1. Add more implementation details for any service?
2. Show how to integrate these with the frontend?
3. Add more scoring algorithms?
4. Show how to handle real-time updates?
