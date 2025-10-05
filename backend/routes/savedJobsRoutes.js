const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { saveJob, unsaveJob, getSavedJobs, checkIfSaved } = require('../controllers/savedJobsController');

// Save a job
router.post('/save-job/:jobId', authMiddleware, saveJob);

// Unsave a job
router.delete('/unsave-job/:jobId', authMiddleware, unsaveJob);

// Get all saved jobs
router.get('/saved-jobs', authMiddleware, getSavedJobs);

// Check if job is saved
router.get('/check-saved/:jobId', authMiddleware, checkIfSaved);

module.exports = router;