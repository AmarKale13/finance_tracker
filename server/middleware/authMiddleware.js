const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Get token from header
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // 2. Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId};
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
