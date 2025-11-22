import express from 'express';
import {
  getLeaves,
  getLeave,
  createLeave,
  updateLeave,
  deleteLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  getLeaveStats
} from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Leave Routes
router
  .route('/')
  .get(protect, getLeaves)
  .post(protect, createLeave);

router
  .route('/:id')
  .get(protect, getLeave)
  .put(protect, updateLeave)
  .delete(protect, deleteLeave);

// Approval Routes
router.route('/:id/approve').put(protect, authorize('Principal', 'Admin'), approveLeave);
router.route('/:id/reject').put(protect, authorize('Principal', 'Admin'), rejectLeave);
router.route('/:id/cancel').put(protect, cancelLeave);

// Stats Route
router.route('/stats/overview').get(protect, authorize('Principal', 'Admin'), getLeaveStats);

export default router;
