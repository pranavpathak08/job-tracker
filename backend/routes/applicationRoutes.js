const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { applyToJob, getMyApplications, getApplicantsByJob, updateApplicationStatus } = require('../controllers/applicationController');

// Apply to a job (only logged-in users)
router.post('/apply/:jobId', authMiddleware, applyToJob);
router.get('/my-applications', authMiddleware, getMyApplications);
router.get('/applicants/:jobId', authMiddleware, roleMiddleware('admin'), getApplicantsByJob);
router.put('/applications/:applicationId',authMiddleware, roleMiddleware('admin'), updateApplicationStatus);
module.exports = router;
