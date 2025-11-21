const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('canteen'));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Canteen dashboard' });
});

module.exports = router;
