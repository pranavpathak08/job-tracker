const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, deleteJob, updateJob } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('admin'), createJob);
router.get('/', authMiddleware, getAllJobs);
router.put('/:jobId', authMiddleware, roleMiddleware('admin'), updateJob);
router.delete('/:jobId', authMiddleware, roleMiddleware('admin'), deleteJob);

module.exports = router;
