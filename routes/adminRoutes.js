const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/middleware');
const adminController = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.get('/stats', protect, adminOnly, adminController.getStats);
router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.get('/groups', protect, adminOnly, adminController.getAllGroups);

module.exports = router;