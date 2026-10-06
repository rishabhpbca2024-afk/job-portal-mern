const express = require('express');
const router = express.Router();
const {
  applyJob,
  getJobSeekerApplications,
  getJobApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

// Middleware to handle multer upload and capture errors cleanly
const handleResumeUpload = (req, res, next) => {
  uploadResume.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed. Only PDF, DOC, and DOCX under 10MB are allowed.'
      });
    }
    next();
  });
};

// Job Seeker routes
router.post('/apply/:jobId', protect, authorize('jobseeker'), handleResumeUpload, applyJob);
router.get('/my-applications', protect, authorize('jobseeker'), getJobSeekerApplications);

// Recruiter routes
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
