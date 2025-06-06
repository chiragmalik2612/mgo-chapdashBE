// parseAndInsertChapters.js
const Chapter = require('../models/Chapter');

/**
 * Parses and inserts an array of chapter objects into the database.
 * Performs schema validation and duplicate check before insertion.
 *
 * @param {Array<Object>} chaptersArray - Array of chapter JSON objects to be inserted.
 * @returns {Object} - { inserted: Chapter[], failed: { index, chapter, reason }[] }
 */
const parseAndInsertChapters = async (chaptersArray) => {
  const inserted = [];
  const failed = [];

  for (const [index, data] of chaptersArray.entries()) {
    try {
      // Basic existence check
      if (!data.subject || !data.chapter || !data.class) {
        throw new Error('Missing required fields: subject, chapter, or class');
      }

      // Check for existing entry with same subject + chapter + class
      const exists = await Chapter.findOne({
        subject: data.subject,
        chapter: data.chapter,
        class: data.class
      });

      if (exists) {
        throw new Error('Duplicate entry: chapter already exists for this class and subject');
      }

      // Create and validate document
      const chapter = new Chapter(data);
      await chapter.validate();
      await chapter.save();

      inserted.push(chapter);
    } catch (err) {
      failed.push({
        index,
        chapter: data.chapter || '(Unnamed)',
        reason: err.message
      });
    }
  }

  return { inserted, failed };
};

module.exports = parseAndInsertChapters;
