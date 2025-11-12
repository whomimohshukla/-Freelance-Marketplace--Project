const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        website: String,
        size: {
            type: String,
            enum: ['1-10', '11-50', '51-200', '201-500', '500+']
        },
        founded: Date,
        description: String,
        logo: String
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Industry',
        required: true
    },
    businessDetails: {
        type: {
            type: String,
            enum: ['Startup', 'SME', 'Enterprise', 'Agency', 'Individual']
        },
        registrationNumber: String,
        taxId: String,
        verificationStatus: {
            type: String,
            enum: ['Pending', 'Verified', 'Rejected'],
            default: 'Pending'
        }
    },
    projects: {
        active: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }],
        completed: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }],
        cancelled: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }]
    },
    hiring: {
        preferredSkills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
        }],
        teamSize: {
            current: Number,
            target: Number
        },
        locations: [{
            type: String
        }]
    },
    financials: {
        currency: {
            type: String,
            default: 'USD'
        },
        billingEmail: String,
        invoiceNotes: String,
        totalSpent: {
            type: Number,
            default: 0
        },
        activeProjectsBudget: {
            type: Number,
            default: 0
        },
        paymentMethods: [{
            type: {
                type: String,
                enum: ['Credit Card', 'PayPal', 'Bank Transfer']
            },
            isDefault: Boolean,
            lastFour: String,
            expiryDate: Date
        }],
        billingAddress: {
            street: String,
            city: String,
            state: String,
            country: String,
            zipCode: String
        }
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    stats: {
        totalProjects: {
            type: Number,
            default: 0
        },
        activeProjects: {
            type: Number,
            default: 0
        },
        completedProjects: {
            type: Number,
            default: 0
        },
        totalFreelancersHired: {
            type: Number,
            default: 0
        }
    },
    team: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['Admin', 'Project Manager', 'Member']
        },
        permissions: [{
            type: String,
            enum: ['View', 'Edit', 'Delete', 'Hire', 'Pay']
        }]
    }],
    socialProfiles: {
        linkedin: String,
        github: String,
        twitter: String,
        facebook: String,
        website: String
    },
    preferences: {
        communicationChannel: {
            type: String,
            enum: ['Email', 'Chat', 'Phone', 'Video Call'],
            default: 'Email'
        },
        timezone: String,
        currency: {
            type: String,
            default: 'USD'
        },
        language: {
            type: String,
            default: 'English'
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
clientProfileSchema.index({ user: 1 });
clientProfileSchema.index({ 'company.name': 1 });
clientProfileSchema.index({ industry: 1 });
clientProfileSchema.index({ 'rating.average': -1 });
clientProfileSchema.index({ 'stats.totalProjects': -1 });

// Virtual for total available budget
clientProfileSchema.virtual('availableBudget').get(function() {
    return this.financials.totalBudget - this.financials.activeProjectsBudget;
});

const ClientProfile = mongoose.model('ClientProfile', clientProfileSchema);

module.exports = ClientProfile;
