const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required']
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant reference is required']
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^(?:\+91|91|0)?[6-9]\d{9}$/,
        'Please provide a valid 10-digit mobile number'
      ]
    },
    experience: {
      type: String,
      required: [true, 'Experience level is required'],
      default: 'Fresher (0-1 yr)'
    },
    portfolioUrl: {
      type: String,
      default: ''
    },
    coverLetter: {
      type: String,
      default: ''
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    resumeOriginalName: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Rejected'],
      default: 'Applied'
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate application: A user can only apply once to a specific job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
