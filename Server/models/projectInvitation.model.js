const mongoose = require('mongoose');

const projectInvitationSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    freelancerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FreelancerProfile',
    },
    
    // Project Details
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    
    // Budget
    budget: {
      type: {
        type: String,
        enum: ['Fixed', 'Hourly', 'Milestone-based'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    
    // Timeline
    duration: {
      type: String,
      enum: [
        'Less than 1 month',
        '1-3 months',
        '3-6 months',
        'More than 6 months',
      ],
      required: true,
    },
    startDate: {
      type: Date,
    },
    
    // Skills Required
    skills: [
      {
        type: String,
      },
    ],
    
    // Status
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Expired'],
      default: 'Pending',
    },
    
    // Messages
    clientMessage: {
      type: String,
    },
    freelancerResponse: {
      type: String,
    },
    
    // Project created if accepted
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    
    // Expiry
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
    
    // Response tracking
    viewedAt: {
      type: Date,
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
projectInvitationSchema.index({ client: 1, status: 1 });
projectInvitationSchema.index({ freelancer: 1, status: 1 });
projectInvitationSchema.index({ status: 1, expiresAt: 1 });
projectInvitationSchema.index({ createdAt: -1 });

// Auto-expire invitations
projectInvitationSchema.methods.checkExpiry = function () {
  if (this.status === 'Pending' && new Date() > this.expiresAt) {
    this.status = 'Expired';
    return this.save();
  }
  return Promise.resolve(this);
};

// Prevent duplicate pending invitations
projectInvitationSchema.index(
  { client: 1, freelancer: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'Pending' },
  }
);

const ProjectInvitation = mongoose.model('ProjectInvitation', projectInvitationSchema);
module.exports = ProjectInvitation;
