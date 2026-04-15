const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');

router.get('/', async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { groupName, courseName, courseCode, faculty, description, meetingLocation, meetingType } = req.body;
    const group = await Group.create({
      groupName,
      courseName,
      courseCode,
      faculty,
      description,
      meetingLocation,
      meetingType,
      leaderId: req.user.id
    });
    
    // Automatically join the group as leader
    await GroupMember.create({
      groupId: group.id,
      userId: req.user.id
    });

    // Update user role to leader if they are currently a student
    const User = require('../models/User');
    const user = await User.findByPk(req.user.id);
    if (user && user.role === 'student') {
        user.role = 'leader';
        await user.save();
    }

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/join', protect, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    // Check if group exists
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if already a member
    const existingMember = await GroupMember.findOne({
      where: { groupId, userId }
    });

    if (existingMember) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Join group
    await GroupMember.create({ groupId, userId });

    res.status(200).json({ message: 'Successfully joined the group' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-groups', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all group IDs the user is a member of
    const memberships = await GroupMember.findAll({
      where: { userId },
      attributes: ['groupId']
    });
    
    const groupIds = memberships.map(m => m.groupId);
    
    if (groupIds.length === 0) {
      return res.json([]);
    }

    const groups = await Group.findAll({
      where: { id: groupIds }
    });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.leaderId !== req.user.id) {
      return res.status(403).json({ message: 'Only the group leader can edit group information' });
    }

    const { groupName, courseName, courseCode, faculty, description, meetingLocation, meetingType } = req.body;
    await group.update({ groupName, courseName, courseCode, faculty, description, meetingLocation, meetingType });

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/members', protect, async (req, res) => {
  try {
    const groupId = req.params.id;
    
    // Ensure Group and User associations are set up for membership list
    const User = require('../models/User');
    Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId' });
    User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId' });

    const group = await Group.findByPk(groupId, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'registrationNumber', 'programOfStudy'],
        through: { attributes: ['joinedAt'] }
      }]
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group.Users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id/members/:userId', protect, async (req, res) => {
  try {
    const { id: groupId, userId } = req.params;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.leaderId !== req.user.id) {
      return res.status(403).json({ message: 'Only the group leader can remove members' });
    }

    if (parseInt(userId) === group.leaderId) {
      return res.status(400).json({ message: 'Leaders cannot remove themselves from the group' });
    }

    await GroupMember.destroy({
      where: { groupId, userId }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/posts', protect, async (req, res) => {
  try {
    const groupId = req.params.id;
    
    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const Post = require('../models/Post');
    const User = require('../models/User');
    Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

    const posts = await Post.findAll({
      where: { groupId },
      include: [{ model: User, as: 'author', attributes: ['name', 'role'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/posts', protect, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: 'Post content is required' });

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const member = await GroupMember.findOne({ where: { groupId, userId } });
    const User = require('../models/User');
    const user = await User.findByPk(userId);
    
    if (!member && user.role !== 'admin') {
      return res.status(403).json({ message: 'Only members can post in this group' });
    }

    const Post = require('../models/Post');
    const post = await Post.create({
      groupId,
      authorId: userId,
      content
    });

    Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
    const newPost = await Post.findByPk(post.id, {
      include: [{ model: User, as: 'author', attributes: ['name', 'role'] }]
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE api/groups/:id
// @desc - [x] Backend: Add `POST /groups/:id/leave` route
router.delete('/:id', protect, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    const group = await Group.findByPk(groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    // Authorization: Only leader or admin can delete
    if (group.leaderId !== userId) {
        const User = require('../models/User');
        const user = await User.findByPk(userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Only the group leader or an administrator can decommission this group' });
        }
    }

    // Cascade Delete Associated Records
    const Post = require('../models/Post');
    const StudySession = require('../models/StudySession');

    await Promise.all([
        GroupMember.destroy({ where: { groupId } }),
        Post.destroy({ where: { groupId } }),
        StudySession.destroy({ where: { groupId } }),
        group.destroy()
    ]);

    // Check if user is still a leader of any other group
    const User = require('../models/User');
    const remainingGroupsCount = await Group.count({ where: { leaderId: userId } });
    
    if (remainingGroupsCount === 0) {
        const user = await User.findByPk(userId);
        if (user && user.role === 'leader') {
            user.role = 'student';
            await user.save();
        }
    }

    res.json({ message: 'Group and all associated data decommissioned successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/groups/:id/leave
// @desc    Leave a study group (Members only)
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    const group = await Group.findByPk(groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    if (group.leaderId === userId) {
        return res.status(400).json({ message: 'Leaders cannot leave their own group. Please decommission the group instead.' });
    }

    const membership = await GroupMember.findOne({ where: { groupId, userId } });
    if (!membership) {
        return res.status(400).json({ message: 'You are not a member of this group' });
    }

    await membership.destroy();

    res.json({ message: 'Successfully left the group' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;