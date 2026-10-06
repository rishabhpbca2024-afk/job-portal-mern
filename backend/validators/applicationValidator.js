const fs = require('fs');

/**
 * Middleware to validate Job Application input fields
 */
const validateApplicationInput = (req, res, next) => {
  const {
    fullName,
    email,
    phone,
    experience,
    portfolioUrl,
    coverLetter,
    resumeUrl
  } = req.body;

  // Helper to safely remove uploaded resume file if validation fails
  const cleanupUploadedFile = () => {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
  };

  // 1. Full Name Validation
  if (!fullName || !fullName.trim()) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: 'Full name is required'
    });
  }

  const trimmedName = fullName.trim();
  if (trimmedName.length < 2 || trimmedName.length > 60) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: 'Full name must be between 2 and 60 characters long'
    });
  }

  if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: 'Full name can only contain letters, spaces, and hyphens'
    });
  }

  // 2. Email Validation
  if (!email || !email.trim()) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: 'Email address is required'
    });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address (e.g. name@example.com)'
    });
  }

  // 3. Phone Number Validation (Standard 10-digit mobile number)
  if (!phone || !phone.trim()) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
    });
  }

  const rawPhone = phone.trim().replace(/[\s\-()]/g, '');
  // Matches 10 digits starting with 6, 7, 8, or 9 (with optional +91, 91, or 0 country prefix)
  const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;

  if (!phoneRegex.test(rawPhone)) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid 10-digit mobile number (e.g. 9876543210 starting with 6-9)'
    });
  }

  // Extra guard: If digits without country code is not exactly 10 digits
  const pureDigits = rawPhone.replace(/^\+91|^91|^0/, '');
  if (pureDigits.length !== 10) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: `Invalid phone length: Expected 10 digits, but got ${pureDigits.length} digits`
    });
  }

  // 4. Experience Validation
  const validExperiences = [
    'Fresher (0-1 yr)',
    '1 - 2 Years',
    '3 - 5 Years',
    '5+ Years Senior'
  ];
  if (experience && !validExperiences.includes(experience.trim())) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: `Experience must be one of: ${validExperiences.join(', ')}`
    });
  }

  // 5. Portfolio URL Validation
  if (portfolioUrl && portfolioUrl.trim()) {
    const trimmedPortfolio = portfolioUrl.trim();
    if (/^(javascript:|data:|vbscript:)/i.test(trimmedPortfolio)) {
      cleanupUploadedFile();
      return res.status(400).json({
        success: false,
        message: 'Security error: Disallowed protocol in portfolio link'
      });
    }

    try {
      const parsedUrl = new URL(trimmedPortfolio);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        cleanupUploadedFile();
        return res.status(400).json({
          success: false,
          message: 'Portfolio URL must begin with http:// or https://'
        });
      }
    } catch {
      cleanupUploadedFile();
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid website URL for portfolio'
      });
    }
  }

  // 6. Cover Letter Length Validation
  if (coverLetter && coverLetter.trim().length > 2000) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: 'Cover letter cannot exceed 2000 characters'
    });
  }

  // 7. Resume Presence Validation
  const hasUploadedFile = Boolean(req.file);
  const hasResumeUrl = Boolean(resumeUrl && resumeUrl.trim());
  const hasProfileResume = Boolean(req.user && req.user.resumeUrl);

  if (!hasUploadedFile && !hasResumeUrl && !hasProfileResume) {
    cleanupUploadedFile();
    return res.status(400).json({
      success: false,
      message: 'Please upload a resume document or provide an online resume link'
    });
  }

  if (hasResumeUrl) {
    const trimmedResumeUrl = resumeUrl.trim();
    if (/^(javascript:|data:|vbscript:)/i.test(trimmedResumeUrl)) {
      cleanupUploadedFile();
      return res.status(400).json({
        success: false,
        message: 'Security error: Disallowed protocol in resume link'
      });
    }

    try {
      const parsed = new URL(trimmedResumeUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        cleanupUploadedFile();
        return res.status(400).json({
          success: false,
          message: 'Resume link must begin with http:// or https://'
        });
      }
    } catch {
      cleanupUploadedFile();
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid online resume URL'
      });
    }
  }

  next();
};

module.exports = { validateApplicationInput };
