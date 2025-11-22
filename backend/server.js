import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import hostelRoutes from './routes/hostelRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import sportsRoutes from './routes/sportsRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/sports', sportsRoutes);
app.use('/api/leaves', leaveRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    data: {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Co-Campus API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      departments: '/api/departments',
      subjects: '/api/subjects',
      notices: '/api/notices',
      approvals: '/api/approvals',
      dashboard: '/api/dashboard',
      fees: '/api/fees',
      hostels: '/api/hostels',
      academic: '/api/academic',
      sports: '/api/sports',
      leaves: '/api/leaves',
      health: '/api/health',
    },
  });
});

// Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ===================================');
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🚀 API URL: http://localhost:${PORT}`);
  console.log('🚀 ===================================');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
