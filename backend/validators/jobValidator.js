const validateJobInput = (req, res, next) => {
  const { title, description, company, location, salary, jobType, experienceLevel } = req.body;

  if (!title || !description || !company || !location || !salary) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all mandatory fields: title, description, company, location, salary'
    });
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Job title must be between 3 and 100 characters'
    });
  }

  const trimmedCompany = company.trim();
  if (trimmedCompany.length < 2 || trimmedCompany.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Company name must be between 2 and 100 characters'
    });
  }

  const trimmedLocation = location.trim();
  if (trimmedLocation.length < 2 || trimmedLocation.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Job location must be between 2 and 100 characters'
    });
  }

  const trimmedSalary = salary.trim();
  if (trimmedSalary.length < 2 || trimmedSalary.length > 80) {
    return res.status(400).json({
      success: false,
      message: 'Salary range must be between 2 and 80 characters'
    });
  }

  const trimmedDesc = description.trim();
  if (trimmedDesc.length < 20) {
    return res.status(400).json({
      success: false,
      message: 'Job description must be at least 20 characters long'
    });
  }

  const validJobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  if (jobType && !validJobTypes.includes(jobType.trim())) {
    return res.status(400).json({
      success: false,
      message: `Job type must be one of: ${validJobTypes.join(', ')}`
    });
  }

  const validExpLevels = ['Entry Level', 'Mid Level', 'Senior Level'];
  if (experienceLevel && !validExpLevels.includes(experienceLevel.trim())) {
    return res.status(400).json({
      success: false,
      message: `Experience level must be one of: ${validExpLevels.join(', ')}`
    });
  }

  next();
};

module.exports = { validateJobInput };
