const User = require('../models/User');
const Group = require('../models/Group');
const StudySession = require('../models/StudySession');


exports.getStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });

        const totalUsers = await User.countDocuments();
        const totalGroups = await Group.countDocuments();
        const totalSessions = await StudySession.countDocuments();
        const mostActiveCourses = await Group.aggregate([
            { $group: { _id: '$courseName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        res.json({ totalUsers, totalGroups, totalSessions, mostActiveCourses });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }


};


exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
