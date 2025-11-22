import express from 'express';
import {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePin,
  getNoticeStats,
} from '../controllers/noticeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Stats route
router.get('/stats', protect, getNoticeStats);

// CRUD routes
router
  .route('/')
  .get(protect, getNotices)
  .post(protect, authorize('admin', 'faculty', 'hod', 'principal'), createNotice);

router
  .route('/:id')
  .get(protect, getNotice)
  .put(protect, authorize('admin', 'faculty', 'hod', 'principal'), updateNotice)
  .delete(protect, authorize('admin'), deleteNotice);

// Pin toggle route
router.patch('/:id/pin', protect, authorize('admin'), togglePin);

export default router;
