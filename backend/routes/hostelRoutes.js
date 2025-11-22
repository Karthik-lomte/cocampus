import express from 'express';
import {
  getBlocks,
  getBlock,
  createBlock,
  updateBlock,
  deleteBlock,
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getAllocations,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  getHostelStats
} from '../controllers/hostelController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Block Routes
router
  .route('/blocks')
  .get(protect, getBlocks)
  .post(protect, authorize('Admin'), createBlock);

router
  .route('/blocks/:id')
  .get(protect, getBlock)
  .put(protect, authorize('Admin'), updateBlock)
  .delete(protect, authorize('Admin'), deleteBlock);

// Room Routes
router
  .route('/rooms')
  .get(protect, getRooms)
  .post(protect, authorize('Admin'), createRoom);

router
  .route('/rooms/:id')
  .get(protect, getRoom)
  .put(protect, authorize('Admin'), updateRoom)
  .delete(protect, authorize('Admin'), deleteRoom);

// Allocation Routes
router
  .route('/allocations')
  .get(protect, getAllocations)
  .post(protect, authorize('Admin', 'Faculty'), createAllocation);

router
  .route('/allocations/:id')
  .put(protect, authorize('Admin', 'Faculty'), updateAllocation)
  .delete(protect, authorize('Admin'), deleteAllocation);

// Stats Route
router.route('/stats').get(protect, getHostelStats);

export default router;
