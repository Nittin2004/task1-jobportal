const express = require('express');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Admin dashboard stats
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const totalCandidates = await User.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });

    res.json({ totalCandidates, totalCompanies, totalJobs, totalApplications, activeJobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all candidates
router.get('/candidates', adminMiddleware, async (req, res) => {
  try {
    const candidates = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all companies
router.get('/companies', adminMiddleware, async (req, res) => {
  try {
    const companies = await Company.find().select('-password').sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all jobs
router.get('/jobs', adminMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', 'name').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all applications
router.get('/applications', adminMiddleware, async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('candidate', 'name email')
      .populate({ path: 'job', select: 'title', populate: { path: 'company', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a candidate
router.delete('/candidates/:id', adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a company
router.delete('/companies/:id', adminMiddleware, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a job
router.delete('/jobs/:id', adminMiddleware, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
