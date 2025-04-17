const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: [
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "Mobile Developer",
            "UI/UX Designer",
            "Product Manager",
            "Project Manager",
            "QA Engineer",
            "DevOps Engineer",
            "Database Administrator",
            "Cloud Engineer",
            "Data Scientist",
            "Data Analyst",
            "Machine Learning Engineer",
            "AI Specialist",
            "Security Engineer",
            "System Architect",
            "Software Engineer",
            "Game Developer",
            "Embedded Systems Engineer",
            "Web Developer",
            "Content Strategist",
            "Technical Writer",
            "Support Engineer",
            "Product Designer",
            "Business Analyst",
            "Research Scientist",
            "Other"
          ],
          required: true,
        },
        joinDate: {
          type: Date,
          default: Date.now,
        },
        permissions: [
          {
            type: String,
            enum: ["view", "edit", "delete", "admin", "invite"],
          },
        ],
        status: {
          type: String,
          enum: ["Active", "Inactive", "On Leave"],
          default: "Active",
        },
        contribution: {
          completedTasks: Number,
          hoursLogged: Number,
          rating: Number,
        },
      },
    ],
    projects: [
      {
        project: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
          required: true,
        },
        role: {
          type: String,
          enum: ["Primary", "Secondary", "Support"],
          default: "Primary",
        },
        startDate: Date,
        endDate: Date,
        status: {
          type: String,
          enum: ["Planning", "In Progress", "Completed", "On Hold"],
          default: "Planning",
        },
        deliverables: [
          {
            name: String,
            status: String,
            dueDate: Date,
          },
        ],
      },
    ],
    skills: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Expert"],
          required: true,
        },
        members: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    availability: {
      startDate: Date,
      endDate: Date,
      hoursPerWeek: Number,
      timeZone: String,
      workingDays: [
        {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
      ],
      specialHours: [
        {
          date: Date,
          hours: Number,
          reason: String,
        },
      ],
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
          },
          rating: Number,
          comment: String,
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    communication: {
      channels: [
        {
          type: {
            type: String,
            enum: ["Slack", "Discord", "Email", "Other"],
          },
          value: String,
        },
      ],
      preferredLanguages: [String],
      availableTimeSlots: [
        {
          day: String,
          startTime: String,
          endTime: String,
        },
      ],
    },
    documents: [
      {
        title: String,
        type: {
          type: String,
          enum: ["Contract", "Agreement", "Portfolio", "Other"],
        },
        url: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    billing: {
      rate: {
        amount: Number,
        currency: String,
        type: {
          type: String,
          enum: ["Hourly", "Fixed", "Monthly"],
        },
      },
      paymentMethods: [
        {
          type: String,
          details: Object,
        },
      ],
      invoices: [
        {
          project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
          },
          amount: Number,
          status: String,
          dueDate: Date,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
teamSchema.index({ name: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ "members.user": 1 });
teamSchema.index({ "projects.project": 1 });
teamSchema.index({ "skills.skill": 1 });

// Middleware to update ratings
teamSchema.pre("save", async function (next) {
  if (this.isModified("ratings.reviews")) {
    const reviews = this.ratings.reviews;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average =
      reviews.length > 0 ? totalRating / reviews.length : 0;
    this.ratings.count = reviews.length;
  }
  next();
});

// Virtual for active members count
teamSchema.virtual("activeMembersCount").get(function () {
  return this.members.filter((member) => member.status === "Active").length;
});

// Method to check if team is available
teamSchema.methods.isAvailable = function (startDate, endDate) {
  return (
    this.availability.startDate <= startDate &&
    this.availability.endDate >= endDate
  );
};

// Static method to find teams by skill
teamSchema.statics.findBySkill = function (skillId) {
  return this.find({
    "skills.skill": skillId,
  }).populate("members.user");
};

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
