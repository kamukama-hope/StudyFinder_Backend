const Group = require('../models/Group');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
    try{
        const{ name, courseCode, courseName, faculty, description, meetingLocation } =req.body;
        const group = new Group({
            name,
            courseCode,
            courseName,
            faculty,
            description,
            meetingLocation,
            leader: req.user.id,
            members: [req.user.id]
        });
        await group.save();
        res.json(group);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getGroups = async (req, res) => {
    try{
        const { search, course,faculty } =req.query;
        let filter = {};
        if (search) filter.name = { $regex: search, $options: 'i' };
        if (course) filter.courseName = { $regex: course, $options: 'i' };
        if (faculty) filter.faculty = {$regex: faculty, $options: 'i'};
        const groups = await Group.find(filter).populate('leader', 'name').populate('members', 'name');
        res.json(groups);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.getGroupById = async (req, res) => {
    try{
        const group = await Group.findById(req.params.id)
        .populate('leader', 'name')
        .populate('members', 'name');
        if (!group) return res.status(404).json({msg: 'Group not found'});
        res.json(group);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.updateGroup = async (req, res) => {
    try{
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({msg: 'Group not found'});
        if (group.leader.toString() !== req.user.id)
             return res.status(403).json({msg: 'Not authorized'});
        const updated = await Group.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(updated);
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.joinGroup = async (req, res) => {
    try{
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({msg: 'Group not found'});
        if (group.members.includes(req.user.id))
             return res.status(400).json({msg: 'Already a member'});
        group.members.push(req.user.id);
        await group.save();
        await User.findByIdAndUpdate(req.user.id, {$push: {joinedgroups: group._id}});
        res.json({msg: 'Joined successfully'});
       }catch(err){
        console.error(err);
        res.status(500).send('Server error');
       }
    };


exports.removeMember = async (req, res) => {
    try{
        const group = await Group.findById(req.params.id, groupId);
        if (!group) return res.status(404).json({msg: 'Group not found'});
        if (group.leader.toString() !== req.user.id&& req.user.id !== 'admin')
            return res.status(401).json({msg:'Not authorized'});
        group.members = group.members.filter(m => m.toString() !== req.params.userId);
        await group.save();
        await User.findByIdAndUpdate(req.params.userId, {$pull: {joinedgroups: group._id}});
        res.json({msg: 'Member removed'});
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
    };
