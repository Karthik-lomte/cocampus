# Co-Campus Backend API

Complete Node.js/Express/MongoDB backend for the Co-Campus Campus Management System.

## 🎯 Overview

This backend powers all 10 portals of the Co-Campus system:
- Student Portal
- Faculty Portal
- HoD Portal
- Principal Portal
- Admin Portal
- Club Portal
- Hostel Portal
- Canteen Portal
- Stall Portal
- Sports Portal

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0 or higher (running locally via MongoDB Compass)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file with your settings
# Minimum required:
MONGODB_URI=mongodb://localhost:27017/cocampus
JWT_SECRET=your-secret-key-here
```

### 3. Setup MongoDB Database

**Follow the steps in `MONGODB_COMPASS_SETUP.md`:**

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Create database named `cocampus`
4. Create all 45+ collections listed in the guide
5. (Optional) Add indexes for performance

### 4. Seed Database with Sample Data

```bash
npm run seed
```

This will create:
- ✅ Admin user (admin@cocampus.edu / Admin@123)
- ✅ 3 Departments (CSE, ECE, ME)
- ✅ 1 Faculty member
- ✅ 5 Students with Campus Coins wallets
- ✅ 3 Subjects
- ✅ 2 Clubs
- ✅ 1 Canteen stall with 3 menu items
- ✅ 2 Sports facilities

### 5. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── auth.controller.js   # Authentication logic
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── rateLimiter.js       # Rate limiting
│   │   └── upload.js            # File upload handling
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── AllModels.js         # All 45+ mongoose models
│   ├── routes/
│   │   ├── auth.routes.js       # Authentication routes
│   │   ├── student.routes.js    # Student portal routes
│   │   ├── faculty.routes.js    # Faculty portal routes
│   │   ├── hod.routes.js        # HoD portal routes
│   │   ├── principal.routes.js  # Principal portal routes
│   │   ├── admin.routes.js      # Admin portal routes
│   │   ├── club.routes.js       # Club portal routes
│   │   ├── hostel.routes.js     # Hostel portal routes
│   │   ├── canteen.routes.js    # Canteen portal routes
│   │   ├── stall.routes.js      # Stall portal routes
│   │   └── sports.routes.js     # Sports portal routes
│   └── utils/                    # Utility functions
├── scripts/
│   └── seedDatabase.js          # Database seeding script
├── uploads/                      # File uploads directory
├── logs/                         # Application logs
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies
├── server.js                     # Express app entry point
├── MONGODB_COMPASS_SETUP.md      # MongoDB Compass setup guide
├── MONGODB_SCHEMA.md             # Complete database schema
└── README.md                     # This file
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@cocampus.edu",
  "password": "Admin@123"
}

# Response:
{
  "status": "success",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "..."
  }
}
```

### Using the Token

Include the token in the Authorization header for all protected routes:

```bash
Authorization: Bearer <your-token-here>
```

## 📡 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| POST | `/logout` | Logout user | Private |
| PUT | `/change-password` | Change password | Private |

### Student Routes (`/api/v1/student`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get student dashboard data |
| GET | `/assignments` | Get all assignments |
| POST | `/assignments/:id/submit` | Submit assignment |
| GET | `/attendance` | Get attendance records |
| GET | `/results` | Get exam results |
| GET | `/campus-coins` | Get wallet balance |
| POST | `/campus-coins/topup` | Topup campus coins |
| GET | `/gate-pass` | Get gate pass requests |
| POST | `/gate-pass` | Create gate pass request |

### Faculty Routes (`/api/v1/faculty`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Faculty dashboard |
| POST | `/attendance` | Mark attendance |
| POST | `/marks` | Upload marks |
| POST | `/assignments` | Create assignment |
| GET | `/assignments` | Get all assignments |
| POST | `/leave` | Request leave |

### Admin Routes (`/api/v1/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Admin dashboard |
| GET | `/users` | Get all users |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/departments` | Get all departments |
| POST | `/departments` | Create department |

*Full API documentation available in MONGODB_SCHEMA.md*

## 🛡️ Security Features

- ✅ **Helmet**: Security headers
- ✅ **CORS**: Cross-Origin Resource Sharing
- ✅ **Rate Limiting**: Prevent brute force attacks
- ✅ **Mongo Sanitize**: Prevent NoSQL injection
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Password Hashing**: Bcrypt with salt rounds
- ✅ **Input Validation**: Request validation
- ✅ **File Upload Limits**: Max 50MB per file

## 📦 Dependencies

### Core
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT tokens
- `dotenv`: Environment variables

### Security
- `helmet`: Security headers
- `cors`: CORS handling
- `express-rate-limit`: Rate limiting
- `express-mongo-sanitize`: NoSQL injection prevention

### Utilities
- `multer`: File uploads
- `express-validator`: Input validation
- `compression`: Response compression
- `morgan`: HTTP logging
- `nodemailer`: Email sending
- `date-fns`: Date manipulation
- `uuid`: Unique ID generation

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Environment Variables

Create a `.env` file with the following variables:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/cocampus

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=30d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=90d

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads

# CORS
CORS_ORIGIN=http://localhost:5173

# Admin Credentials
ADMIN_EMAIL=admin@cocampus.edu
ADMIN_PASSWORD=Admin@123
```

## 🔧 Common Issues & Solutions

### MongoDB Connection Error

**Problem**: `MongooseServerSelectionError`

**Solution**:
1. Ensure MongoDB is running (check MongoDB Compass)
2. Verify `MONGODB_URI` in `.env` file
3. Check if port 27017 is not blocked

### JWT Token Expired

**Problem**: `TokenExpiredError`

**Solution**:
- Login again to get a new token
- Increase `JWT_EXPIRES_IN` in `.env` for development

### File Upload Fails

**Problem**: `File too large` error

**Solution**:
- Check file size (max 50MB)
- Ensure `uploads/` directory exists
- Verify `MAX_FILE_SIZE` in `.env`

### Port Already in Use

**Problem**: `EADDRINUSE: address already in use`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env file
```

## 📊 Database Schema

Complete database schema with all 45+ collections is documented in `MONGODB_SCHEMA.md`.

### Key Collections:
- `users` - All users (students, faculty, admin, etc.)
- `departments` - Academic departments
- `subjects` - Course subjects
- `assignments` - Assignment records
- `attendance` - Attendance tracking
- `marks` - Exam marks
- `gate_pass_requests` - Gate pass requests
- `campus_coins_wallets` - Digital wallet
- `transactions` - Financial transactions
- `orders` - Canteen orders
- `facility_bookings` - Sports bookings
- `clubs` - Student clubs
- `events` - Event management

## 🚦 API Response Format

### Success Response

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error message here"
}
```

## 📈 Performance Optimization

- ✅ **Database Indexes**: Critical indexes on frequently queried fields
- ✅ **Connection Pooling**: MongoDB connection pool (10 connections)
- ✅ **Response Compression**: Gzip compression enabled
- ✅ **Rate Limiting**: Prevents API abuse
- ✅ **Caching**: (Can be implemented with Redis)

## 🔄 Development Workflow

1. **Make changes** to code
2. **Nodemon auto-restarts** server (in dev mode)
3. **Test** using Postman/Insomnia or frontend
4. **Check logs** for any errors
5. **Commit** changes with clear messages

## 📞 Support

For issues or questions:
- Check `MONGODB_SCHEMA.md` for database structure
- Review `MONGODB_COMPASS_SETUP.md` for setup steps
- Check the error logs in `logs/` directory

## 📜 License

MIT License - See LICENSE file for details

---

## 🎓 Next Steps

1. ✅ Setup MongoDB (follow MONGODB_COMPASS_SETUP.md)
2. ✅ Install dependencies (`npm install`)
3. ✅ Configure `.env` file
4. ✅ Seed database (`npm run seed`)
5. ✅ Start server (`npm run dev`)
6. 🔄 Test API endpoints with Postman
7. 🔄 Connect frontend to backend
8. 🔄 Implement remaining features

**Happy Coding! 🚀**
