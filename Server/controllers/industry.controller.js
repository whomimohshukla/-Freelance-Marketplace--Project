const Industry = require('../models/industry.model');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.isValidObjectId(id);

// Get all parent industries
exports.getParentIndustries = async (req, res) => {
    try {
        const { status, sort = 'displayOrder', page = 1, limit = 10 } = req.query;

        const query = { parentIndustry: null }; // Only parent industries

        if (status) {
            query.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const parentIndustries = await Industry.find(query)
            .populate('skills', 'name description')
            .sort(sort === 'name' ? { name: 1 } : { displayOrder: 1, name: 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Industry.countDocuments(query);

        res.status(200).json({
            success: true,
            data: parentIndustries,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get parent industry by ID or slug
exports.getParentIndustry = async (req, res) => {
    try {
        const { idOrSlug } = req.params;

        let query;
        if (isValidObjectId(idOrSlug)) {
            query = { _id: idOrSlug, parentIndustry: null };
        } else {
            query = { slug: idOrSlug, parentIndustry: null };
        }

        const parentIndustry = await Industry.findOne(query)
            .populate('subIndustries', 'name slug')
            .populate('skills', 'name description');

        if (!parentIndustry) {
            return res.status(404).json({
                success: false,
                error: 'Parent industry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: parentIndustry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Create new parent industry
exports.createParentIndustry = async (req, res) => {
    try {
        const industryData = { ...req.body };
        industryData.parentIndustry = null; // Explicitly setting as parent

        if (industryData.skills) {
            const invalidSkills = industryData.skills.filter(id => !isValidObjectId(id));
            if (invalidSkills.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid skill IDs: ${invalidSkills.join(', ')}`
                });
            }
            industryData.skills = industryData.skills.map(id => new mongoose.Types.ObjectId(id));
        }

        const parentIndustry = await Industry.create(industryData);

        await parentIndustry.populate([
            { path: 'skills', select: 'name description' }
        ]);

        res.status(201).json({
            success: true,
            data: parentIndustry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update parent industry
exports.updateParentIndustry = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid industry ID format'
            });
        }

        // Prevent assigning a parent to a parent industry
        updateData.parentIndustry = null;

        if (updateData.skills) {
            const invalidSkills = updateData.skills.filter(id => !isValidObjectId(id));
            if (invalidSkills.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid skill IDs: ${invalidSkills.join(', ')}`
                });
            }
            updateData.skills = updateData.skills.map(id => new mongoose.Types.ObjectId(id));
        }

        const parentIndustry = await Industry.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate([
            { path: 'subIndustries', select: 'name slug' },
            { path: 'skills', select: 'name description' }
        ]);

        if (!parentIndustry) {
            return res.status(404).json({
                success: false,
                error: 'Parent industry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: parentIndustry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete parent industry
exports.deleteParentIndustry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid industry ID format'
            });
        }

        const parentIndustry = await Industry.findById(id);

        if (!parentIndustry || parentIndustry.parentIndustry !== null) {
            return res.status(404).json({
                success: false,
                error: 'Parent industry not found'
            });
        }

        // Remove the parent industry and update all its child industries
        await parentIndustry.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get industry by ID or slug
exports.getIndustry = async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        
        let query;
        if (isValidObjectId(idOrSlug)) {
            query = { _id: idOrSlug };
        } else {
            query = { slug: idOrSlug };
        }

        const industry = await Industry.findOne(query)
            .populate('parentIndustry', 'name slug')
            .populate('subIndustries', 'name slug')
            .populate('skills', 'name description');

        if (!industry) {
            return res.status(404).json({
                success: false,
                error: 'Industry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: industry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Create new industry
exports.createIndustry = async (req, res) => {
    try {
        const industryData = { ...req.body };

        // Convert ObjectIds
        if (industryData.parentIndustry && !isValidObjectId(industryData.parentIndustry)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid parent industry ID format'
            });
        }

        if (industryData.skills) {
            const invalidSkills = industryData.skills.filter(id => !isValidObjectId(id));
            if (invalidSkills.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid skill IDs: ${invalidSkills.join(', ')}`
                });
            }
            industryData.skills = industryData.skills.map(id => new mongoose.Types.ObjectId(id));
        }

        const industry = await Industry.create(industryData);
        
        // Update parent industry's subIndustries array
        if (industry.parentIndustry) {
            await Industry.findByIdAndUpdate(
                industry.parentIndustry,
                { $push: { subIndustries: industry._id } }
            );
        }

        await industry.populate([
            { path: 'parentIndustry', select: 'name slug' },
            { path: 'skills', select: 'name description' }
        ]);

        res.status(201).json({
            success: true,
            data: industry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update industry
exports.updateIndustry = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid industry ID format'
            });
        }

        // Convert ObjectIds
        if (updateData.parentIndustry) {
            if (!isValidObjectId(updateData.parentIndustry)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid parent industry ID format'
                });
            }
            updateData.parentIndustry = new mongoose.Types.ObjectId(updateData.parentIndustry);
        }

        if (updateData.skills) {
            const invalidSkills = updateData.skills.filter(id => !isValidObjectId(id));
            if (invalidSkills.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid skill IDs: ${invalidSkills.join(', ')}`
                });
            }
            updateData.skills = updateData.skills.map(id => new mongoose.Types.ObjectId(id));
        }

        const industry = await Industry.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate([
            { path: 'parentIndustry', select: 'name slug' },
            { path: 'subIndustries', select: 'name slug' },
            { path: 'skills', select: 'name description' }
        ]);

        if (!industry) {
            return res.status(404).json({
                success: false,
                error: 'Industry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: industry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete industry
exports.deleteIndustry = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid industry ID format'
            });
        }

        const industry = await Industry.findById(id);

        if (!industry) {
            return res.status(404).json({
                success: false,
                error: 'Industry not found'
            });
        }

        await industry.remove(); // This will trigger the pre-remove middleware

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get trending industries
exports.getTrendingIndustries = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const industries = await Industry.getTrendingIndustries(Number(limit));

        res.status(200).json({
            success: true,
            data: industries
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update industry market stats
exports.updateMarketStats = async (req, res) => {
    try {
        const { id } = req.params;
        const { marketStats } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid industry ID format'
            });
        }

        const industry = await Industry.findByIdAndUpdate(
            id,
            { $set: { marketStats } },
            { new: true, runValidators: true }
        );

        if (!industry) {
            return res.status(404).json({
                success: false,
                error: 'Industry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: industry.marketStats
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Add industry trend
exports.addIndustryTrend = async (req, res) => {
    try {
        const { id } = req.params;
        const { trend } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid industry ID format'
            });
        }

        // Convert skill ObjectIds in topSkills array
        if (trend.topSkills) {
            const invalidSkills = trend.topSkills.filter(item => !isValidObjectId(item.skill));
            if (invalidSkills.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid skill IDs: ${invalidSkills.map(item => item.skill).join(', ')}`
                });
            }
            trend.topSkills = trend.topSkills.map(item => ({
                ...item,
                skill: new mongoose.Types.ObjectId(item.skill)
            }));
        }

        const industry = await Industry.findByIdAndUpdate(
            id,
            { $push: { trends: trend } },
            { new: true, runValidators: true }
        ).populate('trends.topSkills.skill', 'name description');

        if (!industry) {
            return res.status(404).json({
                success: false,
                error: 'Industry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: industry.trends
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all child industries for a parent industry
exports.getChildIndustries = async (req, res) => {
    try {
        const { parentId } = req.params;
        const { page = 1, limit = 10, sort = 'displayOrder' } = req.query;

        if (!isValidObjectId(parentId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid parent industry ID format'
            });
        }

        const skip = (Number(page) - 1) * Number(limit);
        const query = { parentIndustry: new mongoose.Types.ObjectId(parentId) };

        const industries = await Industry.find(query)
            .populate('skills', 'name description')
            .sort(sort === 'name' ? { name: 1 } : { displayOrder: 1, name: 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Industry.countDocuments(query);

        res.status(200).json({
            success: true,
            data: industries,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Set parent industry
exports.setParentIndustry = async (req, res) => {
    try {
        const { id } = req.params;
        const { parentId } = req.body;

        if (!isValidObjectId(id) || (parentId && !isValidObjectId(parentId))) {
            return res.status(400).json({
                success: false,
                error: 'Invalid industry ID format'
            });
        }

        // Check for circular reference
        if (parentId) {
            const parentIndustry = await Industry.findById(parentId);
            if (!parentIndustry) {
                return res.status(404).json({
                    success: false,
                    error: 'Parent industry not found'
                });
            }

            // Check if the target industry is not being set as its own parent
            if (id === parentId) {
                return res.status(400).json({
                    success: false,
                    error: 'Industry cannot be its own parent'
                });
            }

            // Check if the target industry is not in the parent chain of the new parent
            let currentParent = parentIndustry.parentIndustry;
            while (currentParent) {
                if (currentParent.toString() === id) {
                    return res.status(400).json({
                        success: false,
                        error: 'Circular reference detected in industry hierarchy'
                    });
                }
                const parent = await Industry.findById(currentParent);
                currentParent = parent ? parent.parentIndustry : null;
            }
        }

        // Get the current industry to update its old parent
        const currentIndustry = await Industry.findById(id);
        if (!currentIndustry) {
            return res.status(404).json({
                success: false,
                error: 'Industry not found'
            });
        }

        // Remove from old parent's subIndustries if it exists
        if (currentIndustry.parentIndustry) {
            await Industry.findByIdAndUpdate(
                currentIndustry.parentIndustry,
                { $pull: { subIndustries: id } }
            );
        }

        // Update the industry with new parent
        const updateData = parentId 
            ? { parentIndustry: parentId }
            : { $unset: { parentIndustry: 1 } };

        const industry = await Industry.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate([
            { path: 'parentIndustry', select: 'name slug' },
            { path: 'subIndustries', select: 'name slug' },
            { path: 'skills', select: 'name description' }
        ]);

        // Add to new parent's subIndustries if parent exists
        if (parentId) {
            await Industry.findByIdAndUpdate(
                parentId,
                { $addToSet: { subIndustries: id } }
            );
        }

        res.status(200).json({
            success: true,
            data: industry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get industry hierarchy
exports.getIndustryHierarchy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid industry ID format'
            });
        }

        const industry = await Industry.findById(id);
        if (!industry) {
            return res.status(404).json({
                success: false,
                error: 'Industry not found'
            });
        }

        // Get ancestors
        const ancestors = [];
        let currentParent = industry.parentIndustry;
        while (currentParent) {
            const parent = await Industry.findById(currentParent).select('name slug parentIndustry');
            if (parent) {
                ancestors.unshift(parent);
                currentParent = parent.parentIndustry;
            } else {
                break;
            }
        }

        // Get immediate children
        const children = await Industry.find({ parentIndustry: id })
            .select('name slug')
            .sort({ displayOrder: 1, name: 1 });

        res.status(200).json({
            success: true,
            data: {
                current: {
                    _id: industry._id,
                    name: industry.name,
                    slug: industry.slug
                },
                ancestors,
                children
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get all industries (with filtering for both parent and child)
exports.getIndustries = async (req, res) => {
    try {
        const {
            status,
            parentId,
            hasSkills,
            page = 1,
            limit = 10,
            sort = 'displayOrder'
        } = req.query;

        const query = {};
        
        if (status) {
            query.status = status;
        }

        if (parentId) {
            if (!isValidObjectId(parentId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid parent industry ID format'
                });
            }
            query.parentIndustry = new mongoose.Types.ObjectId(parentId);
        }

        if (hasSkills === 'true') {
            query['skills.0'] = { $exists: true };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const industries = await Industry.find(query)
            .populate('parentIndustry', 'name slug')
            .populate('skills', 'name description')
            .sort(sort === 'name' ? { name: 1 } : { displayOrder: 1, name: 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Industry.countDocuments(query);

        res.status(200).json({
            success: true,
            data: industries,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Get industry by ID or slug (for both parent and child)
exports.getIndustry = async (req, res) => {
    try {
        const { idOrSlug } = req.params;
        
        let query;
        if (isValidObjectId(idOrSlug)) {
            query = { _id: idOrSlug };
        } else {
            query = { slug: idOrSlug };
        }

        const industry = await Industry.findOne(query)
            .populate('parentIndustry', 'name slug')
            .populate('subIndustries', 'name slug')
            .populate('skills', 'name description');

        if (!industry) {
            return res.status(404).json({
                success: false,
                error: 'Industry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: industry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
