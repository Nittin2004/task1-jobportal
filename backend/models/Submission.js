const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  questionSlug: { type: String, required: true },
  questionTitle: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  status: { type: String, required: true }, // 'Accepted', 'Wrong Answer', 'TLE', etc.
  timeTaken: { type: String, default: null },
  memoryUsed: { type: Number, default: null },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure only 1 latest submission document per user + questionSlug + language combination
// This keeps database lightweight and prevents data bloat.
submissionSchema.index({ userId: 1, questionSlug: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
