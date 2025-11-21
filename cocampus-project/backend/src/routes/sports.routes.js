const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('sports', 'student', 'faculty'));

router.get('/facilities', (req, res) => {
  res.json({ message: 'Get facilities' });
});

router.post('/bookings', (req, res) => {
  res.json({ message: 'Create booking' });
});

module.exports = router;
