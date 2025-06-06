const Chapter = require('../models/Chapter');
const parseAndInsertChapters = require('../utils/parseChapters');
const redis = require('../config/redis');

//Controller to fetch chapters with optional filters and pagination
exports.getAllChapters = async (req, res) => {
  console.log('[GET] /api/v1/chapters - Fetch request received');
  const { class: classQuery, unit, status, subject, weakChapters, page = 1, limit = 10 } = req.query;
  const filter = {};

  //Add filters if query parameters are present
  if (classQuery) filter.class = classQuery;
  if (unit) filter.unit = unit;
  if (status) filter.status = status;
  if (subject) filter.subject = subject;
  if (weakChapters === 'true') filter.isWeakChapter = true;

  console.log('Filters applied:', filter);

  const skip = (page - 1) * limit;

  try {
    const [chapters, total] = await Promise.all([
      Chapter.find(filter).skip(skip).limit(parseInt(limit)),
      Chapter.countDocuments(filter)
    ]);

    console.log(`Found ${chapters.length} chapters (Page ${page}/${Math.ceil(total / limit)})`);

    res.json({ total, page: Number(page), limit: Number(limit), chapters });
  } catch (err) {
    console.error('Error fetching chapters:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

//Controller to fetch chapter by ID
exports.getChapterById = async (req, res) => {
  console.log(`[GET] /api/v1/chapters/${req.params.id} - Fetch by ID`);

  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      console.warn('Chapter not found');
      return res.status(404).json({ message: 'Chapter not found' });
    }

    console.log('Chapter found:', chapter.chapter);
    res.json(chapter);
  } catch (err) {
    console.error('Error retrieving chapter:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to upload chapters via JSON file
exports.uploadChapters = async (req, res) => {
  console.log('[POST] /api/v1/chapters - Upload request received');

  if (!req.file) {
    console.warn('No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  let chaptersData;
  try {
    chaptersData = JSON.parse(req.file.buffer.toString());
    console.log(`Parsed JSON file with ${chaptersData.length} entries`);
  } catch (err) {
    console.error('Invalid JSON format:', err.message);
    return res.status(400).json({ message: 'Invalid JSON format' });
  }

  try {
    const { inserted, failed } = await parseAndInsertChapters(chaptersData);
    console.log(`Inserted ${inserted.length} chapters`);
    if (failed.length > 0) console.warn(` ${failed.length} chapters failed to insert`);

    await redis.flushall(); // Clear Redis cache
    console.log('Redis cache flushed');

    res.json({ insertedCount: inserted.length, failed });
  } catch (err) {
    console.error('Error processing upload:', err.message);
    res.status(500).json({ message: 'Server error during upload' });
  }
};
