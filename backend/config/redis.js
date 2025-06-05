require('dotenv').config();

const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("✅ Redis connected");
  console.log("📍 Connected to host:", redis.options.host);
});
redis.on("error", (err) => console.error("❌ Redis error:", err));

module.exports = redis;
