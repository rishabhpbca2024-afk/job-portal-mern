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
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    experience: {
      type: String,
      default: 'Fresher'
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
