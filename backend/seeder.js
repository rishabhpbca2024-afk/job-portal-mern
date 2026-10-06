const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Load models
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dummy_data/users.json'), 'utf-8')
).map((u) => ({
  ...u,
  _id: u._id.$oid,
  createdAt: u.createdAt.$date,
  updatedAt: u.updatedAt.$date
}));

const jobs = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dummy_data/jobs.json'), 'utf-8')
).map((j) => ({
  ...j,
  _id: j._id.$oid,
  recruiter: j.recruiter.$oid,
  createdAt: j.createdAt.$date,
  updatedAt: j.updatedAt.$date
}));

const applications = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dummy_data/applications.json'), 'utf-8')
).map((a) => ({
  ...a,
  _id: a._id.$oid,
  job: a.job.$oid,
  applicant: a.applicant.$oid,
  createdAt: a.createdAt.$date,
  updatedAt: a.updatedAt.$date
}));

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();

    // Insert dummy data directly
    await User.insertMany(users);
    await Job.insertMany(jobs);
    await Application.insertMany(applications);

    console.log('✅ Success: Dummy Data Imported into MongoDB Database (jobportal)!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();

    console.log('🗑️ Success: All Data Cleared from MongoDB!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
