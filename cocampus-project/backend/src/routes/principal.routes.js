const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.use(protect);
router.use(authorize('principal'));

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Principal dashboard' });
});

module.exports = router;
