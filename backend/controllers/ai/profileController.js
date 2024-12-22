const ProfileSuggestion = require('../../models/ai/profile/ProfileEnhancement');
const FreelancerProfile = require('../../models/FreelancerProfile');

const profileController = {
  // Analyze and enhance profile
  async analyzeProfile(req, res) {
    try {
      const { userId } = req.params;
      const profile = await FreelancerProfile.findOne({ userId });

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      // Calculate profile completeness
      const completenessScore = calculateProfileCompleteness(profile);

      // Generate suggestions based on profile analysis
      const suggestions = [];

      // Check for missing or weak sections
      if (!profile.description || profile.description.length < 100) {
        suggestions.push({
          type: 'description',
          suggestion: 'Add a detailed professional description',
          reason: 'A complete profile description helps clients understand your expertise',
          impact: 'high'
        });
      }

      if (profile.skills.length < 3) {
        suggestions.push({
          type: 'skill',
          suggestion: 'Add more relevant skills to your profile',
          reason: 'More skills increase your visibility in search results',
          impact: 'high'
        });
      }

      if (!profile.portfolio || profile.portfolio.length === 0) {
        suggestions.push({
          type: 'portfolio',
          suggestion: 'Add portfolio items to showcase your work',
          reason: 'Portfolio items provide proof of your expertise',
          impact: 'high'
        });
      }

      // Analyze keywords in profile
      const keywords = extractKeywords(profile.description);

      // Save suggestions
      const profileSuggestion = await ProfileSuggestion.findOneAndUpdate(
        { userId },
        {
          $set: {
            suggestions,
            keywords,
            profileScore: {
              overall: completenessScore,
              sections: {
                completeness: completenessScore,
                clarity: calculateClarity(profile.description),
                keywords: keywords.length,
                portfolio: profile.portfolio ? profile.portfolio.length : 0
              }
            },
            lastAnalyzed: new Date()
          }
        },
        { upsert: true, new: true }
      );

      res.json({
        score: profileSuggestion.profileScore,
        suggestions: profileSuggestion.suggestions,
        keywords: profileSuggestion.keywords
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get profile suggestions
  async getProfileSuggestions(req, res) {
    try {
      const { userId } = req.params;
      const suggestions = await ProfileSuggestion.findOne({ userId });

      if (!suggestions) {
        return res.status(404).json({ message: 'No suggestions found' });
      }

      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update suggestion status
  async updateSuggestionStatus(req, res) {
    try {
      const { userId, suggestionId } = req.params;
      const { status } = req.body;

      const profileSuggestion = await ProfileSuggestion.findOne({ userId });
      if (!profileSuggestion) {
        return res.status(404).json({ message: 'Profile suggestions not found' });
      }

      await profileSuggestion.updateSuggestionStatus(suggestionId, status);
      res.json({ message: 'Suggestion status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// Helper functions
const calculateProfileCompleteness = (profile) => {
  const sections = {
    description: profile.description ? 20 : 0,
    skills: Math.min((profile.skills.length / 5) * 20, 20),
    portfolio: Math.min((profile.portfolio?.length / 3) * 20, 20),
    education: profile.education?.length > 0 ? 20 : 0,
    workExperience: profile.workExperience?.length > 0 ? 20 : 0
  };

  return Object.values(sections).reduce((sum, score) => sum + score, 0);
};

const calculateClarity = (description) => {
  if (!description) return 0;
  // Simple clarity score based on length and sentence structure
  const words = description.split(' ').length;
  const sentences = description.split(/[.!?]+/).length;
  return Math.min((words / 200) * 100, 100) * (sentences / Math.ceil(words / 20));
};

const extractKeywords = (description) => {
  if (!description) return [];
  // Simple keyword extraction (in real app, use more sophisticated NLP)
  const words = description.toLowerCase().match(/\b\w+\b/g) || [];
  const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to']);
  return [...new Set(words.filter(word => 
    word.length > 3 && !commonWords.has(word)
  ))].map(word => ({
    word,
    relevance: 1
  }));
};

module.exports = profileController;
