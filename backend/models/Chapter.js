const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  subject: String,
  chapter: String,
  class: String,
  unit: String,
  yearWiseQuestionCount: {
    type: Map,
    of: Number
  },
  questionSolved: Number,
  status: {
    type: String,
    enum: ['Completed', 'Not Started']
  },
  isWeakChapter: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Chapter', ChapterSchema);
