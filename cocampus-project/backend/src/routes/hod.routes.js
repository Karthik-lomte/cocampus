const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('hod'));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'HoD dashboard' });
});

module.exports = router;
