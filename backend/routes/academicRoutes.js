import express from 'express';
import {
  getSemesters,
  getSemester,
  createSemester,
  updateSemester,
  deleteSemester,
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getAcademicStats
} from '../controllers/academicController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Semester Routes
router
  .route('/semesters')
  .get(protect, getSemesters)
  .post(protect, authorize('Admin'), createSemester);

router
  .route('/semesters/:id')
  .get(protect, getSemester)
  .put(protect, authorize('Admin'), updateSemester)
  .delete(protect, authorize('Admin'), deleteSemester);

// Event Routes
router
  .route('/events')
  .get(protect, getEvents)
  .post(protect, authorize('Admin', 'Faculty'), createEvent);

router
  .route('/events/:id')
  .get(protect, getEvent)
  .put(protect, authorize('Admin', 'Faculty'), updateEvent)
  .delete(protect, authorize('Admin'), deleteEvent);

// Stats Route
router.route('/stats').get(protect, getAcademicStats);

export default router;
