const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  mentorId: { type: String, required: true }, // E.g. 'm1', 'm2' from frontend catalogue
  mentorName: { type: String, default: 'Expert Mentor' },
  mentorRole: { type: String, default: 'Industry Expert' },
  mentorAvatar: { type: String, default: 'EM' },
  mentorColor: { type: String, default: '#6366f1' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true }, // e.g. "10:00 AM - 10:30 AM"
  topic: { type: String, required: true },
  sessionType: { type: String, default: '1:1 Mentoring' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Confirmed' },
  meetingLink: { type: String, default: 'https://meet.google.com/nexthire-live' }, // Default meeting link for instant mock sessions
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
