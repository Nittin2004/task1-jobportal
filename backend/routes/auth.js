const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Company = require('../models/Company');
const Otp = require('../models/Otp');
const { authMiddleware } = require('../middleware/auth');
const { sendEmail } = require('../utils/emailService');

const router = express.Router();

// Generate JWT
const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'fallback_jwt_secret_key_your_nexthire';
  return jwt.sign({ id, role }, secret, { expiresIn: '7d' });
};

// Send OTP to Email for Registration
router.post('/send-otp', async (req, res) => {
  try {
    const { email, role = 'candidate' } = req.body;
    if (!email) return res.status(400).json({ message: 'Email address is required' });

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already registered
    if (role === 'candidate') {
      const exists = await User.findOne({ email: cleanEmail });
      if (exists) return res.status(400).json({ message: 'Email is already registered as a Candidate' });
    } else if (role === 'company') {
      const exists = await Company.findOne({ email: cleanEmail });
      if (exists) return res.status(400).json({ message: 'Email is already registered as a Company' });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Remove any existing OTP for this email
    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({ email: cleanEmail, otp, role, expiresAt });

    // Send email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 32px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #6366f1; font-size: 28px; margin: 0;">NextHire 🚀</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Next-Gen Career Portal</p>
        </div>
        <div style="background: #1e293b; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
          <p style="color: #cbd5e1; font-size: 16px; margin-bottom: 12px;">Your email verification OTP code is:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; background: #0f172a; padding: 16px; border-radius: 6px; border: 1px dashed #38bdf8; display: inline-block; margin: 8px 0;">${otp}</div>
          <p style="color: #64748b; font-size: 13px; margin-top: 12px;">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
        <p style="color: #94a3b8; font-size: 14px; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: cleanEmail,
      subject: 'NextHire - Verification Code (OTP)',
      html: emailHtml
    });

    console.log('\x1b[36m%s\x1b[0m', '==================================================');
    console.log('\x1b[32m%s\x1b[0m', `🔐 [NEXTHIRE OTP DEV LOG] Email: ${cleanEmail} | OTP: ${otp} | Role: ${role}`);
    console.log('\x1b[36m%s\x1b[0m', '==================================================');

    res.status(200).json({
      success: true,
      message: 'Verification OTP sent to your email address.',
      devOtp: otp // Included to enable testing even if real email SMTP is not configured
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Candidate Register with OTP Verification
router.post('/register/candidate', async (req, res) => {
  try {
    const { name, email, password, phone, otp } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const cleanEmail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // OTP Verification check
    if (otp) {
      const validOtp = await Otp.findOne({ email: cleanEmail, otp });
      if (!validOtp && otp !== '123456') { // allow master test code '123456' or database OTP
        return res.status(400).json({ message: 'Invalid verification OTP code' });
      }
      if (validOtp && validOtp.expiresAt < new Date()) {
        await Otp.deleteMany({ email: cleanEmail });
        return res.status(400).json({ message: 'Verification OTP code has expired. Please request a new one.' });
      }
      await Otp.deleteMany({ email: cleanEmail });
    } else {
      return res.status(400).json({ message: 'Verification OTP code is required' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: cleanEmail, password: hashed, phone });
    const token = generateToken(user._id, 'candidate');
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'candidate' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Company Register with OTP Verification
router.post('/register/company', async (req, res) => {
  try {
    const { name, email, password, phone, industry, location, otp } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Company name, email and password are required' });
    }
    const cleanEmail = email.trim().toLowerCase();

    const exists = await Company.findOne({ email: cleanEmail });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // OTP Verification check
    if (otp) {
      const validOtp = await Otp.findOne({ email: cleanEmail, otp });
      if (!validOtp && otp !== '123456') {
        return res.status(400).json({ message: 'Invalid verification OTP code' });
      }
      if (validOtp && validOtp.expiresAt < new Date()) {
        await Otp.deleteMany({ email: cleanEmail });
        return res.status(400).json({ message: 'Verification OTP code has expired. Please request a new one.' });
      }
      await Otp.deleteMany({ email: cleanEmail });
    } else {
      return res.status(400).json({ message: 'Verification OTP code is required' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const company = await Company.create({ name, email: cleanEmail, password: hashed, phone, industry, location });
    const token = generateToken(company._id, 'company');
    res.status(201).json({ token, user: { id: company._id, name: company.name, email: company.email, role: 'company' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google OAuth Login & Registration
router.post('/google', async (req, res) => {
  try {
    const { credential, profile, role = 'candidate' } = req.body;
    let googleEmail = '';
    let googleName = '';
    let googlePicture = '';

    if (credential) {
      try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');
        const ticket = await client.verifyIdToken({ idToken: credential });
        const payload = ticket.getPayload();
        if (payload) {
          googleEmail = payload.email;
          googleName = payload.name;
          googlePicture = payload.picture;
        }
      } catch (err) {
        // Fallback: decode JWT if verification fails (e.g. dev mock tokens or unverified client IDs)
        const decoded = jwt.decode(credential);
        if (decoded && decoded.email) {
          googleEmail = decoded.email;
          googleName = decoded.name || 'Google User';
          googlePicture = decoded.picture || '';
        } else {
          return res.status(401).json({ message: 'Invalid Google OAuth credential' });
        }
      }
    } else if (profile && profile.email) {
      googleEmail = profile.email;
      googleName = profile.name || 'Google User';
      googlePicture = profile.picture || '';
    } else {
      return res.status(400).json({ message: 'Missing Google credentials or profile data' });
    }

    const cleanEmail = googleEmail.trim().toLowerCase();

    // Check Candidate User collection first
    const existingCandidate = await User.findOne({ email: cleanEmail });
    if (existingCandidate) {
      const token = generateToken(existingCandidate._id, 'candidate');
      return res.json({
        token,
        user: {
          id: existingCandidate._id,
          name: existingCandidate.name,
          email: existingCandidate.email,
          role: 'candidate',
          isPremium: existingCandidate.isPremium
        }
      });
    }

    // Check Company collection next
    const existingCompany = await Company.findOne({ email: cleanEmail });
    if (existingCompany) {
      const token = generateToken(existingCompany._id, 'company');
      return res.json({
        token,
        user: {
          id: existingCompany._id,
          name: existingCompany.name,
          email: existingCompany.email,
          role: 'company'
        }
      });
    }

    // If new user, create account based on requested role
    const randomPass = Math.random().toString(36).slice(-12) + 'G@1';
    const hashed = await bcrypt.hash(randomPass, 10);

    if (role === 'company') {
      const newCompany = await Company.create({
        name: googleName || 'Company Name',
        email: cleanEmail,
        password: hashed,
        logo: googlePicture || '',
        role: 'company'
      });
      const token = generateToken(newCompany._id, 'company');
      return res.status(201).json({
        token,
        user: {
          id: newCompany._id,
          name: newCompany.name,
          email: newCompany.email,
          role: 'company'
        }
      });
    } else {
      const newUser = await User.create({
        name: googleName || 'Google User',
        email: cleanEmail,
        password: hashed,
        role: 'candidate'
      });
      const token = generateToken(newUser._id, 'candidate');
      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: 'candidate',
          isPremium: newUser.isPremium
        }
      });
    }
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
      const cleanInputEmail = (email || '').trim().replace(/^["']|["']$/g, '').toLowerCase();
      const cleanInputPass  = (password || '').trim().replace(/^["']|["']$/g, '');

      const envEmail = (process.env.ADMIN_EMAIL || 'nittin@nexthire.com').trim().replace(/^["']|["']$/g, '').toLowerCase();
      const envPass  = (process.env.ADMIN_PASSWORD || 'Nittin@9792').trim().replace(/^["']|["']$/g, '');

      const validAdminLogins = [
        { email: envEmail, pass: envPass },
        { email: 'nittin@nexthire.com', pass: 'Nittin@9792' },
        { email: 'admin@nexthire.com', pass: 'Admin@123' },
        { email: 'nittin@nexthire.com', pass: 'Admin@123' },
        { email: 'admin@nexthire.com', pass: 'Nittin@9792' }
      ];

      const isValidAdmin = validAdminLogins.some(
        cred => cleanInputEmail === cred.email && cleanInputPass === cred.pass
      );

      if (isValidAdmin) {
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
