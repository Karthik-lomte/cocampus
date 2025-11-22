import express from 'express';
import {
  getFeeStructures,
  getFeeStructure,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeePayments,
  getFeePayment,
  createFeePayment,
  updateFeePayment,
  deleteFeePayment,
  getFeeStats
} from '../controllers/feeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Fee Structure Routes
router
  .route('/structures')
  .get(protect, getFeeStructures)
  .post(protect, authorize('Admin'), createFeeStructure);

router
  .route('/structures/:id')
  .get(protect, getFeeStructure)
  .put(protect, authorize('Admin'), updateFeeStructure)
  .delete(protect, authorize('Admin'), deleteFeeStructure);

// Fee Payment Routes
router
  .route('/payments')
  .get(protect, authorize('Admin', 'Faculty'), getFeePayments)
  .post(protect, authorize('Admin', 'Faculty'), createFeePayment);

router
  .route('/payments/:id')
  .get(protect, getFeePayment)
  .put(protect, authorize('Admin', 'Faculty'), updateFeePayment)
  .delete(protect, authorize('Admin'), deleteFeePayment);

// Stats Route
router.route('/stats').get(protect, authorize('Admin', 'Faculty'), getFeeStats);

export default router;
