// Authorize specific user roles (e.g. 'recruiter', 'jobseeker')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'unauthorized'}' is not allowed to access this resource`
      });
    }
    next();
  };
};

module.exports = { authorize };
