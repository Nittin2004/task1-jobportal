const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await User.find({ isMentor: true }).select('name email skills experience mentorBio hourlyRate');
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book a session
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { mentorId, mentorName, mentorRole, mentorAvatar, mentorColor, date, timeSlot, topic, sessionType } = req.body;
    const booking = await Booking.create({
      mentorId,
      mentorName,
      mentorRole,
      mentorAvatar,
      mentorColor,
      studentId: req.user.id,
      date,
      timeSlot,
      topic,
      sessionType
    });
    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get my bookings (student or mentor)
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isMentor = user?.isMentor || false;
    let bookings;
    if (isMentor) {
      bookings = await Booking.find({ mentorId: req.user.id }).populate('studentId', 'name email').sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(bookings);
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update booking status (Mentor only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, meetingLink } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, mentorId: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found or unauthorized' });
    
    booking.status = status;
    if (meetingLink) booking.meetingLink = meetingLink;
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
