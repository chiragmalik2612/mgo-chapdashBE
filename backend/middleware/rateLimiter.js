const redis = require('../config/redis');

const rateLimiter = async (req, res, next) => {
  const ip = req.ip;
  const limit = 30;
  const key = `ratelimit:${ip}`;

  try {
    const requests = await redis.incr(key);

    if (requests === 1) {
      // First request from this IP: set expiry of 60 seconds
      await redis.expire(key, 60);
    }

    if (requests > limit) {
      const ttl = await redis.ttl(key); // Time until unblock
      console.warn(`🚨 IP ${ip} exceeded rate limit (${requests} requests)`);

      res.set('Retry-After', ttl);
      return res.status(429).json({
        message: `Too many requests. Try again in ${ttl} seconds.`,
      });
    }

    next();
  } catch (err) {
    console.error('❌ Rate limiting error:', err.message);
    next(); // Fail open — allow request if Redis fails
  }
};

module.exports = rateLimiter;
