const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    skillsCovered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    content: [
      {
        title: String,
        type: String,
        duration: Number,
        resources: [
          {
            type: String,
            url: String,
            description: String,
          },
        ],
      },
    ],
    pricing: {
      amount: Number,
      currency: String,
    },
    enrollments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        progress: Number,
        completedModules: [Number],
        startDate: Date,
        completionDate: Date,
        certificate: {
          issued: Boolean,
          url: String,
        },
      },
    ],
    ratings: {
      average: Number,
      count: Number,
      reviews: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          rating: Number,
          review: String,
          date: Date,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Training = mongoose.model("Training", trainingSchema);
module.exports = Training;
