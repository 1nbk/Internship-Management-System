const express = require('express');
const { createLetterRequest, getAllLetterRequests, updateLetterRequestStatus, getMyAppRequest } = require('../controllers/letter.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('STUDENT'), createLetterRequest);
router.get('/my-requests', authenticateToken, authorizeRoles('STUDENT'), getMyAppRequest);
router.get('/all', authenticateToken, authorizeRoles('ADMIN'), getAllLetterRequests);
router.patch('/:id/status', authenticateToken, authorizeRoles('ADMIN'), updateLetterRequestStatus);

module.exports = router;
