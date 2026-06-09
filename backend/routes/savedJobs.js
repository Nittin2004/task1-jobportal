const express = require('express');
const SavedJob = require('../models/SavedJob');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Save a job
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') return res.status(403).json({ message: 'Only candidates can save jobs' });
    const { jobId } = req.body;
    const existing = await SavedJob.findOne({ candidate: req.user.id, job: jobId });
    if (existing) return res.status(400).json({ message: 'Job already saved' });
    const saved = await SavedJob.create({ candidate: req.user.id, job: jobId });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get saved jobs for candidate
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') return res.status(403).json({ message: 'Not authorized' });
    const saved = await SavedJob.find({ candidate: req.user.id })
      .populate({ path: 'job', populate: { path: 'company', select: 'name location' } })
      .sort({ createdAt: -1 });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unsave a job
router.delete('/:jobId', authMiddleware, async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({ candidate: req.user.id, job: req.params.jobId });
    res.json({ message: 'Job removed from saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
