const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Placeholder - implement user routes
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'User profile route' });
});

module.exports = router;
