const express = require('express');
const { submitLogbook, getMyLogs, getInternsLogs, updateLogStatus } = require('../controllers/logbook.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('STUDENT'), submitLogbook);
router.get('/my-logs', authenticateToken, authorizeRoles('STUDENT'), getMyLogs);
router.get('/interns-logs', authenticateToken, authorizeRoles('SUPERVISOR'), getInternsLogs);
router.patch('/:id/status', authenticateToken, authorizeRoles('SUPERVISOR'), updateLogStatus);

module.exports = router;
