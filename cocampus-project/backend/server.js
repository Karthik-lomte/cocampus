const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

// Import configurations
const { connectDatabase } = require('./src/config/database');
const rateLimiter = require('./src/middleware/rateLimiter');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const studentRoutes = require('./src/routes/student.routes');
const facultyRoutes = require('./src/routes/faculty.routes');
const hodRoutes = require('./src/routes/hod.routes');
const principalRoutes = require('./src/routes/principal.routes');
const adminRoutes = require('./src/routes/admin.routes');
const clubRoutes = require('./src/routes/club.routes');
const hostelRoutes = require('./src/routes/hostel.routes');
const canteenRoutes = require('./src/routes/canteen.routes');
const stallRoutes = require('./src/routes/stall.routes');
const sportsRoutes = require('./src/routes/sports.routes');

// Initialize Express app
const app = express();

// Database connection
connectDatabase();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(mongoSanitize()); // Prevent NoSQL injection

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(rateLimiter);

// Static files
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Co-Campus API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/student`, studentRoutes);
app.use(`/api/${API_VERSION}/faculty`, facultyRoutes);
app.use(`/api/${API_VERSION}/hod`, hodRoutes);
app.use(`/api/${API_VERSION}/principal`, principalRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/club`, clubRoutes);
app.use(`/api/${API_VERSION}/hostel`, hostelRoutes);
app.use(`/api/${API_VERSION}/canteen`, canteenRoutes);
app.use(`/api/${API_VERSION}/stall`, stallRoutes);
app.use(`/api/${API_VERSION}/sports`, sportsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              🎓 CO-CAMPUS API SERVER 🎓                   ║
║                                                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}                                    ║
║  Port: ${PORT}                                              ║
║  API Version: ${API_VERSION}                                        ║
║  Database: ${process.env.DB_NAME || 'cocampus'}                                     ║
║                                                           ║
║  API Endpoints:                                          ║
║  • http://localhost:${PORT}/health                         ║
║  • http://localhost:${PORT}/api/${API_VERSION}                       ║
║                                                           ║
║  Status: ✅ Server is running successfully!              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
