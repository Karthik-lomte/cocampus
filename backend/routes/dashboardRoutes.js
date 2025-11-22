import express from 'express';
import { getAdminDashboard } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin dashboard
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

export default router;
