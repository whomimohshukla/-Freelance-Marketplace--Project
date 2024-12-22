const MatchingScore = require('../../models/ai/matching/MatchingScore');
const Project = require('../../models/Project');
const FreelancerProfile = require('../../models/FreelancerProfile');

// Helper function to calculate skill match score
const calculateSkillMatch = (freelancerSkills, projectSkills) => {
  const matchedSkills = projectSkills.filter(skill => 
    freelancerSkills.some(fs => fs.name.toLowerCase() === skill.toLowerCase())
  );
  return {
    score: matchedSkills.length / projectSkills.length,
    matchedSkills,
    totalRequired: projectSkills.length
  };
};

const matchingController = {
  // Find matches for a project
  async findMatches(req, res) {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Find all potential freelancers and calculate scores
      const freelancers = await FreelancerProfile.find({
        'skills.name': { $in: project.skills }
      });

      const matches = await Promise.all(freelancers.map(async (freelancer) => {
        const skillMatch = calculateSkillMatch(freelancer.skills, project.skills);
        
        const matchScore = new MatchingScore({
          freelancerId: freelancer.userId,
          projectId,
          scores: {
            skillMatch,
            experienceMatch: {
              score: freelancer.experience >= project.requiredExperience ? 1 : 0.5,
              relevantYears: freelancer.experience
            },
            budgetMatch: {
              score: freelancer.hourlyRate <= project.budget.maxRate ? 1 : 0.5,
              withinRange: freelancer.hourlyRate <= project.budget.maxRate
            }
          }
        });

        matchScore.totalScore = (
          skillMatch.score * 0.4 +
          matchScore.scores.experienceMatch.score * 0.3 +
          matchScore.scores.budgetMatch.score * 0.3
        ) * 100;

        await matchScore.save();
        return matchScore;
      }));

      // Sort matches by total score
      const sortedMatches = matches.sort((a, b) => b.totalScore - a.totalScore);

      res.json({
        matches: sortedMatches,
        total: sortedMatches.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get match details
  async getMatchDetails(req, res) {
    try {
      const { matchId } = req.params;
      const match = await MatchingScore.findById(matchId)
        .populate('freelancerId', 'name profile')
        .populate('projectId', 'title description');

      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }

      res.json(match);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update match score
  async updateMatchScore(req, res) {
    try {
      const { matchId } = req.params;
      const match = await MatchingScore.findById(matchId);

      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }

      // Recalculate scores based on updated data
      const project = await Project.findById(match.projectId);
      const freelancer = await FreelancerProfile.findOne({ userId: match.freelancerId });

      const skillMatch = calculateSkillMatch(freelancer.skills, project.skills);
      match.scores.skillMatch = skillMatch;
      match.totalScore = (
        skillMatch.score * 0.4 +
        match.scores.experienceMatch.score * 0.3 +
        match.scores.budgetMatch.score * 0.3
      ) * 100;

      await match.save();
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = matchingController;
