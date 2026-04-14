const express = require('express');
const router = express.Router();

const Group = require('../models/Group');

router.get('/', async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', (req, res) => {
  res.json({ message: 'Create group' });
});

module.exports = router;