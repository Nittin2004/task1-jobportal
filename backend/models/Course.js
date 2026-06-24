const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // e.g. YouTube embed link
  content: { type: String }, // Text content or Markdown
  durationMinutes: { type: Number, default: 0 },
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  modules: [moduleSchema],
  thumbnailUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
