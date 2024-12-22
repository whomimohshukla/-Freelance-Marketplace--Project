const PriceData = require('../../models/ai/pricing/PriceSuggestion');
const Project = require('../../models/Project');

const pricingController = {
  // Get price suggestion for a project
  async suggestPrice(req, res) {
    try {
      const { category, skills, complexity, duration } = req.body;

      // Find similar completed projects
      const similarProjects = await Project.find({
        category,
        skills: { $in: skills },
        complexity,
        status: 'completed'
      }).sort({ completedAt: -1 }).limit(10);

      // Calculate average rates
      const rates = similarProjects.map(p => p.budget.maxRate);
      const averageRate = rates.reduce((a, b) => a + b, 0) / rates.length;

      // Store market data
      const priceData = await PriceData.findOneAndUpdate(
        { category, complexity },
        {
          $set: {
            skillSet: skills,
            marketStats: {
              averageRate,
              minRate: Math.min(...rates),
              maxRate: Math.max(...rates),
              lastUpdated: new Date()
            },
            completedProjects: similarProjects.map(p => ({
              projectId: p._id,
              finalPrice: p.budget.maxRate,
              duration: p.duration,
              clientSatisfaction: p.clientReview?.rating || 0
            }))
          }
        },
        { upsert: true, new: true }
      );

      // Adjust price based on duration
      const durationFactor = {
        'less-than-1-month': 1.1,
        '1-3-months': 1,
        '3-6-months': 0.9,
        'more-than-6-months': 0.85
      };

      const adjustedRate = averageRate * (durationFactor[duration] || 1);

      res.json({
        suggested: adjustedRate,
        range: {
          min: priceData.marketStats.minRate,
          max: priceData.marketStats.maxRate
        },
        confidence: similarProjects.length >= 5 ? 'high' : 'medium',
        marketData: {
          averageRate: priceData.marketStats.averageRate,
          totalProjects: similarProjects.length,
          lastUpdated: priceData.marketStats.lastUpdated
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get market rates for a category
  async getMarketRates(req, res) {
    try {
      const { category } = req.params;
      const marketData = await PriceData.find({ category })
        .sort({ 'marketStats.lastUpdated': -1 });

      if (!marketData.length) {
        return res.status(404).json({ message: 'No market data found for this category' });
      }

      res.json({
        category,
        rates: marketData.map(data => ({
          complexity: data.complexity,
          averageRate: data.marketStats.averageRate,
          range: {
            min: data.marketStats.minRate,
            max: data.marketStats.maxRate
          },
          lastUpdated: data.marketStats.lastUpdated
        }))
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update market rates
  async updateMarketRates(req, res) {
    try {
      const { category } = req.params;
      const { newRates } = req.body;

      const updates = await Promise.all(
        newRates.map(rate =>
          PriceData.findOneAndUpdate(
            { category, complexity: rate.complexity },
            {
              $set: {
                'marketStats.averageRate': rate.averageRate,
                'marketStats.minRate': rate.minRate,
                'marketStats.maxRate': rate.maxRate,
                'marketStats.lastUpdated': new Date()
              }
            },
            { new: true }
          )
        )
      );

      res.json({
        message: 'Market rates updated successfully',
        updates
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = pricingController;
