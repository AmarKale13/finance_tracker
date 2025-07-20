    // server/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/test/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().limit(5);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
