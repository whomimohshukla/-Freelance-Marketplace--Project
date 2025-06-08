const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientProfile",
    },

    // Basic Project Info
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    Industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Industry",
      required: true,
    },

    // Skills and Requirements
    skills: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        experienceLevel: {
          type: String,
          enum: ["Beginner", "Intermediate", "Expert"],
          required: true,
        },
        priority: {
          type: String,
          enum: ["Must Have", "Nice to Have"],
          default: "Must Have",
        },
      },
    ],

    // Team Management
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    teamMembers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["Project Manager", "Developer", "Designer", "QA", "DevOps"],
        },
        assignedTasks: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
          },
        ],
      },
    ],

    // Budget and Payment
    budget: {
      type: {
        type: String,
        enum: ["Fixed", "Hourly", "Milestone-based"],
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
      minAmount: {
        type: Number,
        required: true,
      },
      maxAmount: {
        type: Number,
        required: true,
      },
      paid: {
        type: Number,
        default: 0,
      },
      pending: {
        type: Number,
        default: 0,
      },
    },

    // Time Management
    duration: {
      type: String,
      enum: [
        "Less than 1 month",
        "1-3 months",
        "3-6 months",
        "More than 6 months",
      ],
      required: true,
    },
    startDate: Date,
    endDate: Date,
    timeline: {
      plannedStartDate: Date,
      plannedEndDate: Date,
      actualStartDate: Date,
      actualEndDate: Date,
      delays: [
        {
          reason: String,
          days: Number,
          reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
    },

    // Project Status and Progress
    status: {
      type: String,
      enum: [
        "Draft",
        "Open",
        "In Progress",
        "In Review",
        "Completed",
        "Cancelled",
        "Disputed",
      ],
      default: "Draft",
    },
    progress: {
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      lastUpdated: Date,
    },

    // Files and Documents
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Proposals
    proposals: [
      {
        freelancer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        freelancerProfile: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FreelancerProfile",
        },
        coverLetter: {
          type: String,
          required: true,
        },
        proposedAmount: {
          type: Number,
          required: true,
        },
        estimatedDuration: {
          type: String,
          required: true,
        },
        attachments: [
          {
            name: String,
            url: String,
          },
        ],
        status: {
          type: String,
          enum: ["Pending", "Shortlisted", "Accepted", "Rejected", "Withdrawn"],
          default: "Pending",
        },
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        notes: String,
      },
    ],

    // Selected Team/Freelancer
    selectedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Milestones and Tasks
    milestones: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        amount: {
          type: Number,
          required: true,
        },
        dueDate: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Completed", "Approved", "Disputed"],
          default: "Pending",
        },
        tasks: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
          },
        ],
        payment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Payment",
        },
        review: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review",
        },
      },
    ],

    // Communication
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    // Reviews and Ratings
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // Analytics and Metrics
    metrics: {
      views: {
        type: Number,
        default: 0,
      },
      proposals: {
        type: Number,
        default: 0,
      },
      totalTimeSpent: Number,
      costPerHour: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ "skills.skill": 1 });
projectSchema.index({ Industry: 1 });
projectSchema.index({ "proposals.freelancer": 1 });
projectSchema.index({ title: 'text', description: 'text' });


// Middleware to update metrics
projectSchema.pre("save", async function (next) {
  if (this.isModified("proposals")) {
    this.metrics.proposals = this.proposals.length;
  }
  next();
});

// Update project progress based on milestones
projectSchema.methods.updateProgress = async function () {
  const completedMilestones = this.milestones.filter(
    (m) => m.status === "Completed"
  ).length;
  const totalMilestones = this.milestones.length;
  this.progress.percentage = (completedMilestones / totalMilestones) * 100;
  this.progress.lastUpdated = new Date();
  return this.save();
};

// Static method to find similar projects
projectSchema.statics.findSimilar = async function (projectId) {
  const project = await this.findById(projectId);
  return this.find({
    "skills.skill": { $in: project.skills.map((s) => s.skill) },
    _id: { $ne: projectId },
    status: "Open",
  }).limit(5);
};

// Virtual for time remaining
projectSchema.virtual("timeRemaining").get(function () {
  if (!this.endDate) return null;
  return this.endDate - new Date();
});

// Virtual for budget range
projectSchema.virtual("budgetRange").get(function () {
  return `${this.budget.currency} ${this.budget.minAmount} - ${this.budget.maxAmount}`;
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
