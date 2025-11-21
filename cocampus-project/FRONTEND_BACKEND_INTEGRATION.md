# Frontend-Backend Integration Guide

Complete guide to connect the React frontend with the Node.js backend.

## 🔗 Overview

This guide will help you integrate the Co-Campus React frontend (student-portal) with the Node.js backend API.

---

## 📋 Prerequisites

1. ✅ Backend server running on `http://localhost:5000`
2. ✅ Frontend dev server running on `http://localhost:5173`
3. ✅ MongoDB database set up and seeded

---

## 1️⃣ Install Axios in Frontend

```bash
cd student-portal
npm install axios
```

---

## 2️⃣ Create API Configuration

Create `student-portal/src/config/api.js`:

```javascript
import axios from 'axios';

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 3️⃣ Update Login Page

Modify `student-portal/src/pages/Login.jsx`:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

function Login() {
  // ... existing code ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call backend API
      const response = await api.post('/auth/login', {
        email: formData.username,
        password: formData.password
      });

      const { user, token, refreshToken } = response.data.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate based on role
      const roleRoutes = {
        student: '/student/dashboard',
        faculty: '/faculty/dashboard',
        hod: '/hod',
        principal: '/principal',
        club: '/club',
        warden: '/hostel',
        canteen: '/canteen',
        stall: '/stall',
        sports: '/sports',
        admin: '/admin'
      };

      navigate(roleRoutes[user.role] || '/login');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component ...
}
```

---

## 4️⃣ Create API Service Files

### Student API Service

Create `student-portal/src/services/studentApi.js`:

```javascript
import api from '../config/api';

export const studentApi = {
  // Dashboard
  getDashboard: () => api.get('/student/dashboard'),

  // Assignments
  getAssignments: () => api.get('/student/assignments'),
  submitAssignment: (assignmentId, formData) =>
    api.post(`/student/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Attendance
  getAttendance: () => api.get('/student/attendance'),

  // Results
  getResults: (semester) => api.get(`/student/results?semester=${semester}`),

  // Campus Coins
  getCampusCoins: () => api.get('/student/campus-coins'),
  topupCoins: (amount, method) =>
    api.post('/student/campus-coins/topup', { amount, method }),
  getTransactions: (params) => api.get('/student/campus-coins/transactions', { params }),

  // Gate Pass
  getGatePasses: () => api.get('/student/gate-pass'),
  requestGatePass: (data) => api.post('/student/gate-pass', data),

  // Events
  getEvents: () => api.get('/student/events'),
  registerEvent: (eventId) => api.post(`/student/events/${eventId}/register`),

  // Canteen
  getCanteenStalls: () => api.get('/student/canteen/stalls'),
  getMenuItems: (stallId) => api.get(`/student/canteen/menu/${stallId}`),
  placeOrder: (orderData) => api.post('/student/canteen/orders', orderData),
  getOrders: () => api.get('/student/canteen/orders'),

  // Profile
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data)
};
```

---

## 5️⃣ Update Dashboard to Use Real Data

Modify `student-portal/src/pages/Dashboard.jsx`:

```javascript
import React, { useState, useEffect } from 'react';
import { studentApi } from '../services/studentApi';
import { motion } from 'framer-motion';
// ... other imports ...

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getDashboard();
      setDashboardData(response.data.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6">
      {/* Use dashboardData instead of mock data */}
      {/* ... rest of dashboard JSX ... */}
    </motion.div>
  );
};

export default Dashboard;
```

---

## 6️⃣ Create Protected Route Component

Create `student-portal/src/components/ProtectedRoute.jsx`:

```javascript
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

Update `App.jsx` to use ProtectedRoute:

```javascript
import ProtectedRoute from './components/ProtectedRoute';

// In App.jsx routes:
<Route path="/student" element={
  <ProtectedRoute allowedRoles={['student']}>
    <Layout />
  </ProtectedRoute>
}>
  {/* Student routes */}
</Route>
```

---

## 7️⃣ Environment Variables

Create `student-portal/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Co-Campus
```

---

## 8️⃣ Handle File Uploads

Example: Assignment Submission with file upload

```javascript
const handleFileUpload = async (assignmentId, file) => {
  const formData = new FormData();
  formData.append('assignment', file);
  formData.append('comments', 'My submission comments');

  try {
    const response = await studentApi.submitAssignment(assignmentId, formData);
    alert('Assignment submitted successfully!');
  } catch (error) {
    alert('Failed to submit assignment');
  }
};
```

---

## 9️⃣ Testing the Integration

### Test Login

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd student-portal && npm run dev`
3. Open `http://localhost:5173/login`
4. Login with: `admin@cocampus.edu` / `Admin@123`
5. Should redirect to appropriate dashboard

### Test API Calls

Open browser console and check network tab:
- You should see API calls to `localhost:5000`
- Check Authorization header contains Bearer token
- Verify responses from backend

---

## 🔟 Error Handling

Create `student-portal/src/utils/errorHandler.js`:

```javascript
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || 'An error occurred';
    return {
      type: 'error',
      message,
      statusCode: error.response.status
    };
  } else if (error.request) {
    // No response received
    return {
      type: 'error',
      message: 'No response from server. Please check your connection.',
      statusCode: 0
    };
  } else {
    // Error in request setup
    return {
      type: 'error',
      message: error.message || 'An unexpected error occurred',
      statusCode: 0
    };
  }
};

// Usage:
try {
  const response = await studentApi.getAssignments();
} catch (error) {
  const errorInfo = handleApiError(error);
  alert(errorInfo.message);
}
```

---

## 1️⃣1️⃣ Loading States

Create a reusable loading component:

```javascript
// src/components/Loading.jsx
export const Loading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6">
      <Loading />
      <p className="mt-4 text-gray-700">Loading...</p>
    </div>
  </div>
);
```

---

## 1️⃣2️⃣ API Call Examples for Each Portal

### Student Portal

```javascript
// Get assignments
const assignments = await studentApi.getAssignments();

// Submit assignment
const formData = new FormData();
formData.append('assignment', file);
await studentApi.submitAssignment(assignmentId, formData);

// Get attendance
const attendance = await studentApi.getAttendance();

// Place canteen order
const order = await studentApi.placeOrder({
  stallId: 'STALL-001',
  items: [{ itemId: 'ITEM-001', quantity: 2 }]
});
```

### Faculty Portal

```javascript
import api from '../config/api';

// Mark attendance
await api.post('/faculty/attendance', {
  date: new Date(),
  class: 'CSE-3A',
  subject: 'CS501',
  attendance: [
    { studentId: 'xxx', status: 'present' },
    // ...
  ]
});

// Upload marks
await api.post('/faculty/marks', {
  semester: 5,
  subject: 'CS501',
  examType: 'mid1',
  marks: [
    { studentId: 'xxx', marks: 25 },
    // ...
  ]
});
```

### Admin Portal

```javascript
// Create user
await api.post('/admin/users', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'student',
  department: 'CSE'
});

// Get all users
const users = await api.get('/admin/users');

// Update user
await api.put(`/admin/users/${userId}`, updateData);
```

---

## 1️⃣3️⃣ Real-time Updates (Optional)

For real-time notifications, you can implement WebSocket:

```javascript
// Install socket.io-client
npm install socket.io-client

// src/config/socket.js
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token')
  }
});

socket.on('notification', (data) => {
  // Handle notification
  console.log('New notification:', data);
});

export default socket;
```

---

## 🧪 Testing Checklist

- [ ] Login works and stores token
- [ ] Protected routes redirect to login if not authenticated
- [ ] API calls include Authorization header
- [ ] Dashboard loads real data
- [ ] Assignment submission works
- [ ] File uploads work
- [ ] Error messages display correctly
- [ ] Loading states show during API calls
- [ ] Logout clears token and redirects
- [ ] Token expiry redirects to login

---

## 🐛 Common Issues

### CORS Error

**Problem**: `Access-Control-Allow-Origin` error

**Solution**: Backend already has CORS configured, but verify `CORS_ORIGIN` in backend `.env` matches frontend URL (`http://localhost:5173`)

### 401 Unauthorized

**Problem**: API returns 401 even with token

**Solution**:
- Check token is stored in localStorage
- Verify token format in Authorization header
- Check token hasn't expired
- Try logging in again

### Network Error

**Problem**: Cannot connect to backend

**Solution**:
- Ensure backend server is running (`npm run dev`)
- Check backend is on port 5000
- Verify `VITE_API_URL` in frontend `.env`

---

## 📊 Data Flow Diagram

```
┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
│             │   API Request   │             │   MongoDB Query │             │
│  React      │────────────────>│  Express    │────────────────>│  MongoDB    │
│  Frontend   │                 │  Backend    │                 │  Database   │
│             │<────────────────│             │<────────────────│             │
└─────────────┘   JSON Response └─────────────┘   Data          └─────────────┘
     │                                 │
     │                                 │
     └─────────────────────────────────┘
               JWT Token in
            Authorization Header
```

---

## ✅ Next Steps

1. Replace mock data in all pages with API calls
2. Implement error handling for all API calls
3. Add loading states to all components
4. Test each portal thoroughly
5. Implement file uploads for assignments, certificates
6. Add real-time notifications
7. Implement caching for frequently accessed data
8. Add offline support (optional)

---

**Integration Complete! Your frontend is now connected to the backend!** 🎉
