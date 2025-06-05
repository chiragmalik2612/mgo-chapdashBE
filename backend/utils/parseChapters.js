const Chapter = require('../models/Chapter');

const parseAndInsertChapters = async (chaptersArray) => {
  const failed = [];
  const inserted = [];

  for (const data of chaptersArray) {
    try {
      const chapter = new Chapter(data);
      await chapter.validate(); // schema check
      await chapter.save();
      inserted.push(chapter);
    } catch (err) {
      failed.push({ chapter: data.chapter, reason: err.message });
    }
  }

  return { inserted, failed };
};

module.exports = parseAndInsertChapters;
