import express from 'express';
import {
  getApprovals,
  getApproval,
  createApproval,
  approveRequest,
  rejectRequest,
  getApprovalStats,
} from '../controllers/approvalController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Stats route
router.get('/stats', protect, getApprovalStats);

// CRUD routes
router
  .route('/')
  .get(protect, authorize('admin', 'hod', 'principal'), getApprovals)
  .post(protect, createApproval);

router.get('/:id', protect, getApproval);

// Approval actions
router.put('/:id/approve', protect, authorize('admin', 'hod', 'principal'), approveRequest);
router.put('/:id/reject', protect, authorize('admin', 'hod', 'principal'), rejectRequest);

export default router;
