const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { sendEmail } = require('../utils/emailService');

const router = express.Router();

// Apply for a job (candidate)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') return res.status(403).json({ message: 'Only candidates can apply' });

    const { jobId, coverLetter, resumeUrl } = req.body;

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, candidate: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already applied for this job' });

    // Fetch job details first to verify existence and get snapshot details
    const job = await Job.findById(jobId).populate('company');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const candidate = await User.findById(req.user.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      jobTitle: job.title,
      companyName: job.company?.name || 'Unknown Company',
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      candidatePhone: candidate.phone || '',
      coverLetter,
      resumeUrl,
    });

    // Send email notification
    await sendEmail({
      to: req.body.candidateEmail,
      subject: `Application Submitted - ${job.title}`,
      html: `<h2>Hi!</h2><p>Your application for <strong>${job.title}</strong> at <strong>${job.company?.name || 'Unknown Company'}</strong> has been submitted successfully.</p><p>We'll keep you updated on your application status.</p>`,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applications for a candidate
router.get('/my-applications', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') return res.status(403).json({ message: 'Not authorized' });
    const apps = await Application.find({ candidate: req.user.id })
      .populate({ path: 'job', populate: { path: 'company', select: 'name location' } })
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applicants for a job (company)
router.get('/job/:jobId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ message: 'Not authorized' });
    const apps = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone skills experience education resumeUrl')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update application status (company)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ message: 'Not authorized' });
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('candidate', 'name email')
      .populate({ path: 'job', select: 'title' });

    // Send status update email
    await sendEmail({
      to: app.candidate.email,
      subject: `Application Status Update - ${app.job.title}`,
      html: `<h2>Hi ${app.candidate.name},</h2><p>Your application for <strong>${app.job.title}</strong> has been updated to: <strong>${status}</strong></p>`,
    });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
