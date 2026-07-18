const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  role: { type: String, default: 'candidate' },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // TTL index: 10 minutes
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
