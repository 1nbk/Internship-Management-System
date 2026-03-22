const express = require('express');
const { getAllUsers, assignSupervisor, updateUserStatus } = require('../controllers/user.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');
const router = express.Router();

// Admin only routes
router.get('/', authenticateToken, authorizeRoles('ADMIN'), getAllUsers);
router.patch('/assign-supervisor', authenticateToken, authorizeRoles('ADMIN'), assignSupervisor);
router.patch('/:id/status', authenticateToken, authorizeRoles('ADMIN'), updateUserStatus);

module.exports = router;
