const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateJobInput } = require('../validators/jobValidator');

// Public route: Get all jobs
router.get('/', getJobs);

// Protected Recruiter route: Get jobs created by logged in recruiter
router.get('/recruiter/my-jobs', protect, authorize('recruiter'), getRecruiterJobs);

// Public route: Get single job details
router.get('/:id', getJobById);

// Protected Recruiter routes: Create, Update, Delete job
router.post('/', protect, authorize('recruiter'), validateJobInput, createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

module.exports = router;
