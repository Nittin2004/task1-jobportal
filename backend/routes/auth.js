const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_your_nexthire';
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};
 
// Candidate Register
router.post('/register/candidate', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone });
    const token = generateToken(user._id, 'candidate');
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'candidate' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Company Register
router.post('/register/company', async (req, res) => {
  try {
    const { name, email, password, phone, industry, location } = req.body;
    const exists = await Company.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const company = await Company.create({ name, email, password: hashed, phone, industry, location });
    const token = generateToken(company._id, 'company');
    res.status(201).json({ token, user: { id: company._id, name: company.name, email: company.email, role: 'company' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login (Candidate, Company, Admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Admin login
    if (role === 'admin' || (role && role.toString().trim().toLowerCase() === 'admin')) {
      const cleanInputEmail = (email || '').trim().replace(/^["']|["']$/g, '');
      const cleanInputPass  = (password || '').trim().replace(/^["']|["']$/g, '');
      const adminEmail = (process.env.ADMIN_EMAIL || 'nittin@nexthire.com').trim().replace(/^["']|["']$/g, '');
      const adminPass  = (process.env.ADMIN_PASSWORD || 'Nittin@9792').trim().replace(/^["']|["']$/g, '');

      if (cleanInputEmail.toLowerCase() === adminEmail.toLowerCase() && cleanInputPass === adminPass) {
        const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_your_nexthire';
        const token = jwt.sign({ id: 'admin', role: 'admin' }, secret, { expiresIn: '7d' });
        return res.json({ token, user: { id: 'admin', name: 'Admin', email: cleanInputEmail, role: 'admin' } });
      }
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Candidate login
    if (role === 'candidate') {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid email or password' });
      const token = generateToken(user._id, 'candidate');
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'candidate' } });
    }

    // Company login
    if (role === 'company') {
      const company = await Company.findOne({ email });
      if (!company) return res.status(401).json({ message: 'Invalid email or password' });
      const match = await bcrypt.compare(password, company.password);
      if (!match) return res.status(401).json({ message: 'Invalid email or password' });
      const token = generateToken(company._id, 'company');
      return res.json({ token, user: { id: company._id, name: company.name, email: company.email, role: 'company' } });
    }

    res.status(400).json({ message: 'Invalid role specified' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_your_nexthire';
    const decoded = jwt.verify(token, secret);

    if (decoded.role === 'candidate') {
      const user = await User.findById(decoded.id).select('-password');
      return res.json(user);
    }
    if (decoded.role === 'company') {
      const company = await Company.findById(decoded.id).select('-password');
      return res.json(company);
    }
    res.json({ id: 'admin', name: 'Admin', role: 'admin' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, skills, experience, education, industry, location, website, description, companySize } = req.body;

    if (req.user.role === 'candidate') {
      const updatedFields = {};
      if (name !== undefined) updatedFields.name = name;
      if (phone !== undefined) updatedFields.phone = phone;
      if (skills !== undefined) {
        updatedFields.skills = Array.isArray(skills)
          ? skills
          : skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (experience !== undefined) updatedFields.experience = experience;
      if (education !== undefined) updatedFields.education = education;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updatedFields },
        { new: true }
      ).select('-password');
      return res.json(user);
    }    
 
    if (req.user.role === 'company') {
      const updatedFields = {};
      if (name !== undefined) updatedFields.name = name;
      if (phone !== undefined) updatedFields.phone = phone;
      if (industry !== undefined) updatedFields.industry = industry;
      if (location !== undefined) updatedFields.location = location;
      if (website !== undefined) updatedFields.website = website;
      if (description !== undefined) updatedFields.description = description;
      if (companySize !== undefined) updatedFields.companySize = companySize;

      const company = await Company.findByIdAndUpdate(
        req.user.id,
        { $set: updatedFields },
        { new: true }
      ).select('-password');
      return res.json(company);
    }

    res.status(400).json({ message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
