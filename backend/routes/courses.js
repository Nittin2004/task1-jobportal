const express = require('express');
const Course = require('../models/Course');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get all courses (Learning Paths)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single course details
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enroll in a track
router.post('/:id/enroll', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.currentTrack = req.params.id;
    await user.save();
    res.json({ message: 'Successfully enrolled', currentTrack: user.currentTrack });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin ONLY: Create a course
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
