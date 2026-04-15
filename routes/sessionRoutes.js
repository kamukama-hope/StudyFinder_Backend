const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const StudySession = require('../models/StudySession');
const Group = require('../models/Group');

// Get all sessions for a group
router.get('/group/:groupId', protect, async (req, res) => {
  try {
    const sessions = await StudySession.findAll({
      where: { groupId: req.params.groupId },
      order: [['sessionDate', 'ASC'], ['sessionTime', 'ASC']]
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all upcoming sessions for groups the user is in
router.get('/my-sessions', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const GroupMember = require('../models/GroupMember');
    
    // Find all group IDs the user is a member of
    const memberships = await GroupMember.findAll({
      where: { userId },
      attributes: ['groupId']
    });
    
    const groupIds = memberships.map(m => m.groupId);
    
    if (groupIds.length === 0) {
      return res.json([]);
    }

    // Define associations directly here to avoid initialization order issues
    StudySession.belongsTo(Group, { foreignKey: 'groupId' });
    Group.hasMany(StudySession, { foreignKey: 'groupId' });

    const sessions = await StudySession.findAll({
      where: { groupId: groupIds },
      include: [{
        model: Group,
        attributes: ['groupName', 'courseCode']
      }],
      order: [['sessionDate', 'ASC'], ['sessionTime', 'ASC']]
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new study session (Leader only)
router.post('/', protect, async (req, res) => {
  try {
    const { groupId, sessionDate, sessionTime, topic, description, location } = req.body;

    // Check if group exists and user is leader
    const group = await Group.findByPk(groupId);
    if (!group) {
       return res.status(404).json({ message: 'Group not found' });
    }

    if (group.leaderId !== req.user.id) {
       return res.status(403).json({ message: 'Only the group leader can create study sessions' });
    }

    const session = await StudySession.create({
      groupId,
      sessionDate,
      sessionTime,
      topic,
      description,
      location
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;