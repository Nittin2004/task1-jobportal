const express = require('express');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Booking = require('../models/Booking');
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
    const totalBookings = await Booking.countDocuments();

    res.json({ totalCandidates, totalCompanies, totalJobs, totalApplications, activeJobs, totalBookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper for admin pagination
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, parseInt(query.limit) || 50);
  return { page, limit, skip: (page - 1) * limit, isPaginated: query.page !== undefined };
};

// Get all candidates
router.get('/candidates', adminMiddleware, async (req, res) => {
  try {
    const { page, limit, skip, isPaginated } = getPagination(req.query);
    const candidates = await User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (isPaginated) {
      const total = await User.countDocuments();
      return res.json({ data: candidates, total, page, pages: Math.ceil(total / limit) });
    }
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all companies
router.get('/companies', adminMiddleware, async (req, res) => {
  try {
    const { page, limit, skip, isPaginated } = getPagination(req.query);
    const companies = await Company.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (isPaginated) {
      const total = await Company.countDocuments();
      return res.json({ data: companies, total, page, pages: Math.ceil(total / limit) });
    }
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all jobs
router.get('/jobs', adminMiddleware, async (req, res) => {
  try {
    const { page, limit, skip, isPaginated } = getPagination(req.query);
    const jobs = await Job.find().populate('company', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (isPaginated) {
      const total = await Job.countDocuments();
      return res.json({ data: jobs, total, page, pages: Math.ceil(total / limit) });
    }
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all applications
router.get('/applications', adminMiddleware, async (req, res) => {
  try {
    const { page, limit, skip, isPaginated } = getPagination(req.query);
    const apps = await Application.find()
      .populate('candidate', 'name email')
      .populate({ path: 'job', select: 'title', populate: { path: 'company', select: 'name' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    if (isPaginated) {
      const total = await Application.countDocuments();
      return res.json({ data: apps, total, page, pages: Math.ceil(total / limit) });
    }
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

// Get all mentorship bookings
router.get('/bookings', adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a booking
router.delete('/bookings/:id', adminMiddleware, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
