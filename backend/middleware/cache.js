const redis = require('../config/redis');

const cacheChapters = async (req, res, next) => {
  const key = `chapters:${JSON.stringify(req.query)}`;
  const cached = await redis.get(key);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }
  res.sendResponse = res.json;
  res.json = (body) => {
    redis.set(key, JSON.stringify(body), 'EX', 3600);
    res.sendResponse(body);
  };
  next();
};

module.exports = cacheChapters;
