const validateRegisterInput = (req, res, next) => {
  const { name, email, password, role, companyWebsite } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, email, password'
    });
  }

  // Name validation
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 50 characters long'
    });
  }

  if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
    return res.status(400).json({
      success: false,
      message: 'Name can only contain alphabets, spaces, and hyphens'
    });
  }

  // Email format regex validation
  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address (e.g. name@example.com)'
    });
  }

  // Password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  if (password.length > 64) {
    return res.status(400).json({
      success: false,
      message: 'Password cannot exceed 64 characters'
    });
  }

  // Role validation
  if (role && !['jobseeker', 'recruiter'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Role must be either jobseeker or recruiter'
    });
  }

  // Recruiter website validation if provided
  if (companyWebsite && companyWebsite.trim()) {
    try {
      const u = new URL(companyWebsite.trim().startsWith('http') ? companyWebsite.trim() : `https://${companyWebsite.trim()}`);
      if (!['http:', 'https:'].includes(u.protocol)) {
        return res.status(400).json({
          success: false,
          message: 'Company website must use http:// or https://'
        });
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid company website URL'
      });
    }
  }

  next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password'
    });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  next();
};

module.exports = { validateRegisterInput, validateLoginInput };
