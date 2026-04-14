const StudySession = require('../models/StudySession');
const Group = require('../models/Group');

exports.createSession = async (req, res) => {
    try{
        const group = await Group.findById(req.params.groupId);
        if (!group) return res.status(404).json({msg: 'Group not found'});
        if (!group.leader.tostring() !== req.user.id)
            return res.status(401).json({msg: 'Only group leader can create sessions'});
        const session = new StudySession({...req.body, group: req.params.groupId, createdBy: req.user.id});
        await session.save();
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getGroupSessions = async (req, res) => {
    try{
        const sessions = await StudySession.find({group: req.params.groupId}).sort ({ date:1});
        res.json(sessions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};