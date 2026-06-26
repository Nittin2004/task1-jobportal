require('express-async-errors');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Secure CORS policy
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl) or allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS origin policy'));
    }
  },
  credentials: true,
}));
app.use(express.json()); // Parse incoming JSON requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth')); // nittin
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/compiler', require('./routes/compiler'));
app.use('/api/leetcode', require('./routes/leetcode'));
app.use('/api/saved-jobs', require('./routes/savedJobs'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/mentorship', require('./routes/mentorship'));
app.use('/api/payment', require('./routes/payment'));

// Health check
app.get('/', (req, res) => res.json({ message: 'NextHire API is running!' }));

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'Internal server error';
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}:`, err.message);
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


