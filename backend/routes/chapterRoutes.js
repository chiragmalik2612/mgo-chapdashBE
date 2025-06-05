const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {
  getAllChapters,
  getChapterById,
  uploadChapters
} = require('../controllers/chapterController');

const isAdmin = require('../middleware/auth');
const cache = require('../middleware/cache');
const rateLimiter = require('../middleware/rateLimiter');

router.use(rateLimiter);

router.get('/', cache, getAllChapters);
router.get('/:id', getChapterById);
router.post('/', isAdmin, upload.single('file'), uploadChapters);

module.exports = router;
