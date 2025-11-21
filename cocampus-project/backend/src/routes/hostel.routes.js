const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('warden'));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Hostel dashboard' });
});

module.exports = router;
