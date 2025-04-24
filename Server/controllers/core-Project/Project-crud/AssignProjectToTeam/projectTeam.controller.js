const mongoose = require('mongoose');
const Project = require('../../../../models/project.model');
const Team = require('../../../../models/teams.model');


exports.assignTeamToProject = async (req, res) => {
    try {
        const { projectId, teamId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ success: false, error: 'Invalid IDs' });
        }
        const project = await Project.findById(projectId);
        const team = await Team.findById(teamId);
        if (!project || !team) {
            return res.status(404).json({ success: false, error: 'Project or Team not found' });
        }


        project.team = teamId;
        project.teamMembers = team.members.map(member => ({
            user: member.user,
            role: member.role,
            assignedTasks: []
        }));
        await project.save();


        if (!team.projects.some(p => p.project.equals(projectId))) {
            team.projects.push({ project: projectId });
            await team.save();
        }

        res.json({ success: true, data: { project, team } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};



exports.getTeamProjects = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findById(teamId).populate('projects.project');
        if (!team) {
            return res.status(404).json({ success: false, error: 'Team not found' });
        }
        res.json({ success: true, data: team.projects });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getProjectTeam = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId).populate('team');
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.json({ success: true, data: project.team });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getProjectWithTeamMembers = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId)
            .populate('teamMembers.user', 'name email avatar') // Select only needed fields
            .populate('team', 'name description'); // Optionally populate team info

        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};