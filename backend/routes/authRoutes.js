const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegisterInput,
  validateLoginInput
} = require('../validators/authValidator');

// Public auth endpoints
router.post('/register', validateRegisterInput, registerUser);
router.post('/login', validateLoginInput, loginUser);

// Protected endpoints
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
