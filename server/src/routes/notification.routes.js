const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { getNotifications } = require('../controllers/notification.controller');

// GET /api/notifications
router.get('/', authenticateToken, getNotifications);

module.exports = router;
