const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to || !process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
      console.log('Email skipped (not configured):', subject);
      return;
    }
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    console.log('Email sent to:', to);
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = { sendEmail };
