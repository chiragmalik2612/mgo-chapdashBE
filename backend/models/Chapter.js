const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  chapter: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  yearWiseQuestionCount: {
    type: Map,
    of: Number,
    default: {}
  },
  questionSolved: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Completed', 'Not Started'],
    required: true
  },
  isWeakChapter: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Chapter', ChapterSchema);
