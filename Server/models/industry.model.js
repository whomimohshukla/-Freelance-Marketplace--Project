const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        default: 'default-industry-icon.svg'
    },
    parentIndustry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Industry',
        default: null
    },
    subIndustries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Industry'
    }],
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    marketStats: {
        totalProjects: {
            type: Number,
            default: 0
        },
        activeProjects: {
            type: Number,
            default: 0
        },
        averageProjectBudget: {
            type: Number,
            default: 0
        },
        totalFreelancers: {
            type: Number,
            default: 0
        },
        totalClients: {
            type: Number,
            default: 0
        },
        growthRate: {
            type: Number,
            default: 0
        }
    },
    trends: [{
        year: Number,
        quarter: {
            type: Number,
            min: 1,
            max: 4
        },
        projectCount: Number,
        averageBudget: Number,
        topSkills: [{
            skill: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Skill'
            },
            demandScore: {
                type: Number,
                min: 0,
                max: 100
            }
        }]
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'trending'],
        default: 'active'
    },
    metadata: {
        seoTitle: String,
        seoDescription: String,
        seoKeywords: [String],
        featuredImage: String
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better query performance
industrySchema.index({ name: 1 });
industrySchema.index({ slug: 1 });
industrySchema.index({ status: 1 });
industrySchema.index({ displayOrder: 1 });
industrySchema.index({ 'marketStats.totalProjects': -1 });
industrySchema.index({ parentIndustry: 1 });

// Virtual for getting full industry hierarchy path
industrySchema.virtual('hierarchyPath').get(async function() {
    let path = [this.name];
    let currentIndustry = this;
    
    while (currentIndustry.parentIndustry) {
        currentIndustry = await this.model('Industry').findById(currentIndustry.parentIndustry);
        if (currentIndustry) {
            path.unshift(currentIndustry.name);
        } else {
            break;
        }
    }
    
    return path.join(' > ');
});

// Method to get all child industries (recursive)
industrySchema.methods.getAllChildren = async function() {
    let children = [...this.subIndustries];
    
    for (let childId of this.subIndustries) {
        const child = await this.model('Industry').findById(childId);
        if (child) {
            const grandChildren = await child.getAllChildren();
            children = [...children, ...grandChildren];
        }
    }
    
    return children;
};

// Static method to get trending industries
industrySchema.statics.getTrendingIndustries = function(limit = 5) {
    return this.find({ status: 'trending' })
        .sort({ 'marketStats.growthRate': -1 })
        .limit(limit)
        .populate('skills');
};

// Pre-save middleware to generate slug
industrySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Pre-remove middleware to handle industry deletion
industrySchema.pre('remove', async function(next) {
    // Update parent industry's subIndustries array
    if (this.parentIndustry) {
        await this.model('Industry').updateOne(
            { _id: this.parentIndustry },
            { $pull: { subIndustries: this._id } }
        );
    }
    
    // Handle child industries
    const children = await this.getAllChildren();
    if (children.length > 0) {
        await this.model('Industry').updateMany(
            { _id: { $in: children } },
            { $set: { parentIndustry: this.parentIndustry } }
        );
    }
    
    next();
});

const Industry = mongoose.model('Industry', industrySchema);

module.exports = Industry;
