const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('club'));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Club dashboard' });
});

module.exports = router;
