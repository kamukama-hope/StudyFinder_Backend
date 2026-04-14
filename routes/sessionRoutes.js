const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get all sessions' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create session' });
});

module.exports = router;