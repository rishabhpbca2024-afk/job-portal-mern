const validateJobInput = (req, res, next) => {
  const { title, description, company, location, salary, jobType } = req.body;

  if (!title || !description || !company || !location || !salary) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all mandatory fields: title, description, company, location, salary'
    });
  }

  const validJobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  if (jobType && !validJobTypes.includes(jobType)) {
    return res.status(400).json({
      success: false,
      message: `Job type must be one of: ${validJobTypes.join(', ')}`
    });
  }

  next();
};

module.exports = { validateJobInput };
