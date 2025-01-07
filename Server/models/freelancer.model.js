const mongoose = require('mongoose');

const freelancerProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true
    },
    skills: [{
        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            required: true
        },
        experienceLevel: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Expert'],
            required: true
        },
        yearsOfExperience: Number
    }],
    hourlyRate: {
        type: Number,
        required: true,
        min: 0
    },
    availability: {
        status: {
            type: String,
            enum: ['Available', 'Partially Available', 'Not Available'],
            default: 'Available'
        },
        hoursPerWeek: {
            type: Number,
            default: 40
        },
        timezone: String
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
        totalEarnings: {
            type: Number,
            default: 0
        },
        completedProjects: {
            type: Number,
            default: 0
        },
        ongoingProjects: {
            type: Number,
            default: 0
        },
        successRate: {
            type: Number,
            default: 0
        }
    },
    portfolio: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        projectUrl: String,
        images: [{
            url: String,
            caption: String
        }],
        technologies: [String],
        completionDate: Date
    }],
    education: [{
        institution: {
            type: String,
            required: true
        },
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String
    }],
    workExperience: [{
        company: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        description: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        achievements: [String]
    }],
    certifications: [{
        name: {
            type: String,
            required: true
        },
        issuer: String,
        issueDate: Date,
        expiryDate: Date,
        credentialUrl: String
    }],
    languages: [{
        language: {
            type: String,
            required: true
        },
        proficiency: {
            type: String,
            enum: ['Basic', 'Conversational', 'Fluent', 'Native'],
            required: true
        }
    }],
    socialProfiles: {
        github: String,
        linkedin: String,
        website: String,
        stackoverflow: String
    },
    preferences: {
        projectTypes: [{
            type: String,
            enum: ['Fixed Price', 'Hourly', 'Long Term', 'Short Term']
        }],
        industries: [String],
        teamSize: {
            type: String,
            enum: ['Solo', 'Small Team', 'Large Team']
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
freelancerProfileSchema.index({ user: 1 });
freelancerProfileSchema.index({ 'skills.skill': 1 });
freelancerProfileSchema.index({ hourlyRate: 1 });
freelancerProfileSchema.index({ 'rating.average': -1 });

const FreelancerProfile = mongoose.model('FreelancerProfile', freelancerProfileSchema);

module.exports = FreelancerProfile;
