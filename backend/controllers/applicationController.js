const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Job Seeker only)
const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const {
      fullName,
      email,
      phone,
      experience,
      portfolioUrl,
      coverLetter,
      resumeUrl
    } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is closed and no longer accepting applications'
      });
    }

    // Check if applicant already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    let finalResumeUrl = '';
    let finalResumeOriginalName = '';

    // Security: Validate URLs to prevent javascript: and data: XSS attacks
    if (portfolioUrl && portfolioUrl.trim()) {
      const trimmedPortfolio = portfolioUrl.trim();
      if (/^(javascript:|data:|vbscript:)/i.test(trimmedPortfolio)) {
        return res.status(400).json({
          success: false,
          message: 'Security violation: Disallowed URL scheme in portfolio link'
        });
      }
    }

    if (req.file) {
      // File uploaded via Multer
      const protocol = req.protocol;
      const host = req.get('host');
      finalResumeUrl = `${protocol}://${host}/uploads/resumes/${req.file.filename}`;
      // Sanitize original filename for display (remove angle brackets & control characters)
      finalResumeOriginalName = req.file.originalname.replace(/[<>:"/\\|?*]/g, '_');
    } else if (resumeUrl && resumeUrl.trim()) {
      const trimmedResume = resumeUrl.trim();
      if (/^(javascript:|data:|vbscript:)/i.test(trimmedResume)) {
        return res.status(400).json({
          success: false,
          message: 'Security violation: Disallowed URL scheme in resume link'
        });
      }
      finalResumeUrl = trimmedResume;
      finalResumeOriginalName = (req.body.resumeOriginalName || 'Resume Link').replace(/[<>]/g, '');
    } else if (req.user.resumeUrl) {
      finalResumeUrl = req.user.resumeUrl;
      finalResumeOriginalName = 'Profile Resume';
    }

    if (!finalResumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file or provide a valid resume link'
      });
    }

    const cleanedPhone = (phone || '').trim().replace(/[\s\-()]/g, '').replace(/^\+91|^91|^0/, '');

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      fullName: (fullName || req.user.name || '').trim(),
      email: (email || req.user.email || '').trim().toLowerCase(),
      phone: cleanedPhone,
      experience: experience || 'Fresher (0-1 yr)',
      portfolioUrl: (portfolioUrl || '').trim(),
      coverLetter: (coverLetter || '').trim(),
      resumeUrl: finalResumeUrl,
      resumeOriginalName: finalResumeOriginalName,
      status: 'Applied'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications made by logged in Job Seeker
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker only)
const getJobSeekerApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select: 'title company location salary jobType status'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only - must own the job)
const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to logged in recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only view applicants for your own jobs'
      });
    }

    const applicants = await Application.find({ job: jobId })
      .populate('applicant', 'name email skills bio resumeUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobTitle: job.title,
      company: job.company,
      count: applicants.length,
      data: applicants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update applicant status (Applied, Shortlisted, Interview, Rejected)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Shortlisted', 'Interview', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify recruiter owns the job
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update applicant status for jobs you posted'
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Applicant status updated to '${status}' successfully`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyJob,
  getJobSeekerApplications,
  getJobApplicants,
  updateApplicationStatus
};
