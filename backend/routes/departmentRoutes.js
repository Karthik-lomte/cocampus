import express from 'express';
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
} from '../controllers/departmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public stats route
router.get('/stats', protect, getDepartmentStats);

// CRUD routes
router
  .route('/')
  .get(protect, getDepartments)
  .post(protect, authorize('admin'), createDepartment);

router
  .route('/:id')
  .get(protect, getDepartment)
  .put(protect, authorize('admin'), updateDepartment)
  .delete(protect, authorize('admin'), deleteDepartment);

export default router;
