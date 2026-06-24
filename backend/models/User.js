const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  skills: { type: [String], default: [] },
  experience: { type: String, default: '' },
  education: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  role: { type: String, default: 'candidate' },
  // Academy Fields
  currentTrack: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  xpPoints: { type: Number, default: 0 },
  // Mentorship Fields
  isMentor: { type: Boolean, default: false },
  mentorBio: { type: String, default: '' },
  hourlyRate: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
