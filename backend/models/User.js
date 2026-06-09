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
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
