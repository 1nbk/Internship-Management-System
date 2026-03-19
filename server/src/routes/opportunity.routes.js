const express = require('express');
const { createOpportunity, getOpportunities, applyToOpportunity, getAllApplications, updateApplicationStatus } = require('../controllers/opportunity.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', authenticateToken, getOpportunities);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), createOpportunity);
router.post('/apply', authenticateToken, authorizeRoles('STUDENT'), applyToOpportunity);
router.get('/applications', authenticateToken, authorizeRoles('ADMIN'), getAllApplications);
router.patch('/applications/:id', authenticateToken, authorizeRoles('ADMIN'), updateApplicationStatus);

module.exports = router;
