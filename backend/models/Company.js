const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  industry: { type: String, default: '' },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  logo: { type: String, default: '' },
  role: { type: String, default: 'company' },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
