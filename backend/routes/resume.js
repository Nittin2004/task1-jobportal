const express = require('express');
const upload = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Upload resume
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const resumeUrl = `/uploads/${req.file.filename}`;

    // If candidate, save resume URL to their profile
    if (req.user.role === 'candidate') {
      await User.findByIdAndUpdate(req.user.id, { resumeUrl });
    }

    res.json({ resumeUrl, filename: req.file.filename, message: 'Resume uploaded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
