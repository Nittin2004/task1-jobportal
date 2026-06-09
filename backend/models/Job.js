const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String, default: '' },
  location: { type: String, required: true },
  salary: { type: String, default: '' },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'], default: 'Full-time' },
  category: { type: String, default: 'General' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  isActive: { type: Boolean, default: true },
  deadline: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
