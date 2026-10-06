const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a job description']
    },
    company: {
      type: String,
      required: [true, 'Please add the company name'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please add job location (e.g. Remote, Mumbai, Bangalore)'],
      trim: true
    },
    jobType: {
      type: String,
      required: [true, 'Please select job type'],
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time'
    },
    salary: {
      type: String,
      required: [true, 'Please provide salary range (e.g. ₹5,00,000 - ₹8,00,000/yr)'],
      trim: true
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level'],
      default: 'Entry Level'
    },
    requirements: {
      type: [String],
      default: []
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open'
    }
  },
  {
    timestamps: true
  }
);

// Add index for fast search on title, company and location
jobSchema.index({ title: 'text', company: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
