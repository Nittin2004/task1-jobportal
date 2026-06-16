const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, default: '' },
  companyName: { type: String, default: '' },
  candidateName: { type: String, default: '' },
  candidateEmail: { type: String, default: '' },
  candidatePhone: { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
