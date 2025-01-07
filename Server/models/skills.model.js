const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: String,
    // Relationship with FreelancerProfile - Users who have this skill
    freelancers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FreelancerProfile",
        // Additional metadata about the freelancer's proficiency
        proficiency: {
          level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Expert"],
          },
          yearsOfExperience: Number,
          isVerified: Boolean,
        },
      },
    ],
    // Relationship with Projects - Projects requiring this skill
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    assessmentCriteria: [
      {
        criterion: String,
        weight: Number,
      },
    ],
    verificationTests: [
      {
        title: String,
        description: String,
        difficulty: String,
        timeLimit: Number,
        questions: [
          {
            question: String,
            type: String,
            options: [String],
            correctAnswer: String,
          },
        ],
        // Track who has taken this test
        submissions: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            score: Number,
            completedAt: Date,
            passed: Boolean,
          },
        ],
      },
    ],
    relatedSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    // Track skill endorsements
    endorsements: [
      {
        endorser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        endorsee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Expert"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Training courses related to this skill
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Training",
      },
    ],
    // Statistics about skill usage
    statistics: {
      totalFreelancers: {
        type: Number,
        default: 0,
      },
      averageHourlyRate: {
        type: Number,
        default: 0,
      },
      totalProjects: {
        type: Number,
        default: 0,
      },
      successRate: {
        type: Number,
        default: 0,
      },
      demandTrend: {
        type: Number, // Positive or negative trend
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
skillSchema.index({ name: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ "statistics.totalFreelancers": -1 });
skillSchema.index({ "statistics.demandTrend": -1 });

// Middleware to update statistics when new freelancer is added
skillSchema.pre("save", async function (next) {
  if (this.isModified("freelancers")) {
    this.statistics.totalFreelancers = this.freelancers.length;
    // Calculate average hourly rate
    const rates = this.freelancers.map((f) =>
      f.proficiency?.level === "Expert" ? 1.5 : 1
    );
    this.statistics.averageHourlyRate =
      rates.reduce((a, b) => a + b, 0) / rates.length;
  }
  next();
});

const Skill = mongoose.model("Skill", skillSchema);
module.exports = Skill;
