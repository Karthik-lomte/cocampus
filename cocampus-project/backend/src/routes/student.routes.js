const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// All student routes protected and role-restricted
router.use(protect);
router.use(authorize('student'));

// Dashboard
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Student dashboard' });
});

// Assignments
router.get('/assignments', (req, res) => {
  res.json({ message: 'Get assignments' });
});

router.post('/assignments/:id/submit', (req, res) => {
  res.json({ message: 'Submit assignment' });
});

// Attendance
router.get('/attendance', (req, res) => {
  res.json({ message: 'Get attendance' });
});

// Results
router.get('/results', (req, res) => {
  res.json({ message: 'Get results' });
});

// Campus Coins
router.get('/campus-coins', (req, res) => {
  res.json({ message: 'Get campus coins' });
});

router.post('/campus-coins/topup', (req, res) => {
  res.json({ message: 'Topup campus coins' });
});

// Gate Pass
router.get('/gate-pass', (req, res) => {
  res.json({ message: 'Get gate passes' });
});

router.post('/gate-pass', (req, res) => {
  res.json({ message: 'Request gate pass' });
});

module.exports = router;
