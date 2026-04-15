const User = require('../models/User');
const Group = require('../models/Group');
const StudySession = require('../models/StudySession');
const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

/**
 * GET /api/admin/stats
 * Returns platform-wide statistics for the admin dashboard.
 * Requires: protect + adminOnly middleware
 */
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalGroups = await Group.count();
        const totalSessions = await StudySession.count();

        // Most active courses by number of groups
        const mostActiveCourses = await Group.findAll({
            attributes: [
                'courseName',
                [sequelize.fn('COUNT', sequelize.col('id')), 'groupCount']
            ],
            group: ['courseName'],
            order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
            limit: 5,
            raw: true
        });

        res.json({ totalUsers, totalGroups, totalSessions, mostActiveCourses });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

/**
 * GET /api/admin/users
 * Returns a list of all registered users (passwords excluded).
 * Requires: protect + adminOnly middleware
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (err) {
        console.error('Admin get users error:', err);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

/**
 * GET /api/admin/groups
 * Returns all study groups.
 * Requires: protect + adminOnly middleware
 */
exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(groups);
    } catch (err) {
        console.error('Admin get groups error:', err);
        res.status(500).json({ message: 'Server error fetching groups' });
    }
};
