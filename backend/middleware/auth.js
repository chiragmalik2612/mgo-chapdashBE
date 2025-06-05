const isAdmin = (req, res, next) => {
  // For simulation, check a hardcoded key
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.ADMIN_API_KEY) return next();
  return res.status(403).json({ message: 'Forbidden: Admin access only' });
};

module.exports = isAdmin;
