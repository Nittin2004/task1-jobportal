const express = require('express');
const Job = require('../models/Job');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all active jobs (public)
router.get('/', async (req, res) => {
  try {
    const { search, location, jobType, category } = req.query;
    const filter = { isActive: true };

    if (search) filter.title = { $regex: search, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (category) filter.category = { $regex: category, $options: 'i' };

    const jobs = await Job.find(filter).populate('company', 'name location industry').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single job (public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'name location industry website description');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a job (company only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ message: 'Only companies can post jobs' });
    const job = await Job.create({ ...req.body, company: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update job (company only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.company.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete job (company only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get jobs by company
router.get('/company/myjobs', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ message: 'Not authorized' });
    const jobs = await Job.find({ company: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
