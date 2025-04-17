const Team = require('../../../models/teams.model');
const mongoose = require('mongoose');

// Create a new team
exports.createTeam = async (req, res) => {
    try {
        const team = new Team({
            ...req.body,
            leader: req.user._id // Assuming authenticated user is the leader
        });
        await team.save();

        res.status(201).json({
            success: true,
            data: team
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.searchTeams = async (req, res) => {
    try {
        const {
            skills,
            availability,
            memberCount,
            rating,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (skills) {
            const skillIds = skills
                .split(',')
                .filter(id => mongoose.Types.ObjectId.isValid(id));

            if (skillIds.length) {
                query['skills.skill'] = {
                    $in: skillIds.map(id => new mongoose.Types.ObjectId(id))
                };
            }
        }

        if (availability) {
            const [start, end] = availability.split(',').map(date => new Date(date));
            query['availability.startDate'] = { $lte: start };
            query['availability.endDate'] = { $gte: end };
        }

        if (memberCount) {
            const [min, max] = memberCount.split('-').map(Number);
            query.$expr = {
                $and: [
                    { $gte: [{ $size: "$members" }, min] },
                    { $lte: [{ $size: "$members" }, max] }
                ]
            };
        }

        if (rating) {
            query['ratings.average'] = { $gte: Number(rating) };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const teams = await Team.find(query)
            .populate('leader', 'firstName lastName email avatar')
            .populate('members.user', 'firstName lastName email avatar')
            .populate('skills.skill')
            .skip(skip)
            .limit(Number(limit))
            .sort({ 'ratings.average': -1 });

        const total = await Team.countDocuments(query);

        res.status(200).json({
            success: true,
            data: teams,
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

exports.getTeamById = async (req, res) => {
    try {
        const teamId = req.params.id.trim(); 
        
        const team = await Team.findById(teamId)
            .populate('leader', 'firstName lastName email avatar')
            .populate('members.user', 'firstName lastName email avatar')
            .populate('skills.skill')
            .populate('projects.project');

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        res.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


// Update team
exports.updateTeam = async (req, res) => {
    try {
        const teamId = req.params.id.trim();  // Trim any extra whitespace or newline characters
        
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        // Check if user is team leader
        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Only team leader can update team details'
            });
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,  // Use the trimmed ID here
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('leader members.user skills.skill projects.project');

        res.status(200).json({
            success: true,
            data: updatedTeam
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


// Add team member
exports.addTeamMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        // Check permissions
        const requester = team.members.find(
            member => member.user.toString() === req.user._id.toString()
        );

        if (team.leader.toString() !== req.user._id.toString() &&
            (!requester || !requester.permissions.includes('invite'))) {
            return res.status(403).json({
                success: false,
                error: 'No permission to add members'
            });
        }

        // Check if user is already a member
        if (team.members.some(member => member.user.toString() === req.body.userId)) {
            return res.status(400).json({
                success: false,
                error: 'User is already a team member'
            });
        }

        team.members.push({
            user: req.body.userId,
            role: req.body.role,
            permissions: req.body.permissions || ['view']
        });

        await team.save();

        const updatedTeam = await Team.findById(req.params.id)
            .populate('leader members.user skills.skill');

        res.status(200).json({
            success: true,
            data: updatedTeam
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Remove team member
exports.removeTeamMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        // Check permissions
        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Only team leader can remove members'
            });
        }

        // Cannot remove team leader
        if (req.body.userId === team.leader.toString()) {
            return res.status(400).json({
                success: false,
                error: 'Cannot remove team leader'
            });
        }

        team.members = team.members.filter(
            member => member.user.toString() !== req.body.userId
        );

        await team.save();

        const updatedTeam = await Team.findById(req.params.id)
            .populate('leader members.user skills.skill');

        res.status(200).json({
            success: true,
            data: updatedTeam
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Add project to team
exports.addTeamProject = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        // Check permissions
        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Only team leader can add projects'
            });
        }

        team.projects.push({
            project: req.body.projectId,
            role: req.body.role,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            deliverables: req.body.deliverables || []
        });

        await team.save();

        const updatedTeam = await Team.findById(req.params.id)
            .populate('leader members.user skills.skill projects.project');

        res.status(200).json({
            success: true,
            data: updatedTeam
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update team member status
exports.updateMemberStatus = async (req, res) => {
    try {
        const { memberId, status } = req.body;
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        // Check permissions
        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Only team leader can update member status'
            });
        }

        const memberIndex = team.members.findIndex(
            member => member.user.toString() === memberId
        );

        if (memberIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Team member not found'
            });
        }

        team.members[memberIndex].status = status;
        await team.save();

        const updatedTeam = await Team.findById(req.params.id)
            .populate('leader members.user skills.skill');

        res.status(200).json({
            success: true,
            data: updatedTeam
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Add team review
exports.addTeamReview = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Team not found'
            });
        }

        // Check if reviewer has worked with the team
        const hasWorkedWithTeam = team.projects.some(
            project => project.project.client.toString() === req.user._id.toString()
        );

        if (!hasWorkedWithTeam) {
            return res.status(403).json({
                success: false,
                error: 'Only clients who have worked with the team can add reviews'
            });
        }

        team.ratings.reviews.push({
            client: req.user._id,
            project: req.body.projectId,
            rating: req.body.rating,
            comment: req.body.comment
        });

        await team.save(); // This will trigger the pre-save middleware to update average rating

        const updatedTeam = await Team.findById(req.params.id)
            .populate('ratings.reviews.client', 'firstName lastName avatar')
            .populate('ratings.reviews.project');

        res.status(200).json({
            success: true,
            data: updatedTeam
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Only team leader can delete the team' });
        }

        await Team.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Team deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.updateTeamSkills = async (req, res) => {
    try {
        const { skills } = req.body;
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Only team leader can update skills' });
        }

        team.skills = skills; // Array of objects with { skill, level, members }
        await team.save();

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.updateTeamAvailability = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Only team leader can update availability' });
        }

        team.availability = req.body;
        await team.save();
        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.updateTeamCommunication = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Only team leader can update communication settings' });
        }

        team.communication = req.body;
        await team.save();
        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.addTeamDocument = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

        team.documents.push(req.body);
        await team.save();
        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.removeTeamDocument = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

        team.documents = team.documents.filter(doc => doc._id.toString() !== req.body.documentId);
        await team.save();
        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.updateTeamBilling = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Only team leader can update billing' });
        }

        team.billing = req.body;
        await team.save();
        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
exports.updateTeamProject = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ success: false, error: 'Team not found' });

        const project = team.projects.find(
            proj => proj.project.toString() === req.params.projectId
        );

        if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

        // Only team leader can update
        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Only team leader can update projects' });
        }

        Object.assign(project, req.body); // Update fields like role, dates, deliverables
        await team.save();

        const updatedTeam = await Team.findById(req.params.id).populate('projects.project');
        res.status(200).json({ success: true, data: updatedTeam });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
