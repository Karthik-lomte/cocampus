import express from 'express';
import {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  approveBooking,
  rejectBooking,
  getSportsStats
} from '../controllers/sportsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Facility Routes
router
  .route('/facilities')
  .get(protect, getFacilities)
  .post(protect, authorize('Admin'), createFacility);

router
  .route('/facilities/:id')
  .get(protect, getFacility)
  .put(protect, authorize('Admin'), updateFacility)
  .delete(protect, authorize('Admin'), deleteFacility);

// Booking Routes
router
  .route('/bookings')
  .get(protect, getBookings)
  .post(protect, createBooking);

router
  .route('/bookings/:id')
  .get(protect, getBooking)
  .put(protect, authorize('Admin', 'Faculty'), updateBooking)
  .delete(protect, authorize('Admin'), deleteBooking);

// Approval Routes
router.route('/bookings/:id/approve').put(protect, authorize('Admin', 'Faculty'), approveBooking);
router.route('/bookings/:id/reject').put(protect, authorize('Admin', 'Faculty'), rejectBooking);

// Stats Route
router.route('/stats').get(protect, getSportsStats);

export default router;
