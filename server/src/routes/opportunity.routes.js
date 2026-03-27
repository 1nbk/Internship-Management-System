const express = require('express');
const { createOpportunity, getOpportunities, applyToOpportunity, getAllApplications, updateApplicationStatus, updateOpportunity, deleteOpportunity } = require('../controllers/opportunity.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', authenticateToken, getOpportunities);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), createOpportunity);
router.post('/apply', authenticateToken, authorizeRoles('STUDENT'), applyToOpportunity);
router.get('/applications', authenticateToken, authorizeRoles('ADMIN'), getAllApplications);
router.patch('/applications/:id', authenticateToken, authorizeRoles('ADMIN'), updateApplicationStatus);
router.patch('/:id', authenticateToken, authorizeRoles('ADMIN'), updateOpportunity);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), deleteOpportunity);

module.exports = router;
