# CoCampus Frontend - Complete Project Documentation

## Project Overview
**Project Name:** CoCampus Student Portal System
**Technology Stack:** React 19.2.0, Vite 7.2.2, Tailwind CSS 3.4.1
**Architecture:** Multi-Portal Web Application with Role-Based Access Control
**Total Files:** 128+ JSX/JS files
**Backend API:** RESTful API running on http://localhost:5000/api

---

## 1. Technology Stack & Dependencies

### Core Technologies
- **React:** 19.2.0 - UI framework
- **React Router DOM:** 7.9.6 - Client-side routing
- **Vite:** 7.2.2 - Build tool and dev server
- **Tailwind CSS:** 3.4.1 - Utility-first CSS framework
- **PostCSS:** 8.4.35 - CSS processing
- **Autoprefixer:** 10.4.18 - CSS vendor prefixing

### Key Libraries
- **axios:** 1.13.2 - HTTP client for API requests
- **framer-motion:** 12.23.24 - Animation library
- **lucide-react:** 0.554.0 - Icon library
- **react-icons:** 5.5.0 - Additional icon library
- **recharts:** 3.4.1 - Charting library for data visualization
- **date-fns:** 4.1.0 - Date utility library

### Development Dependencies
- **ESLint:** Code linting
- **TypeScript types** for React and React DOM
- **@vitejs/plugin-react:** React plugin for Vite

---

## 2. Project Structure

```
student-portal/
├── src/
│   ├── api/                          # API service layer
│   │   ├── client.js                 # Axios client with interceptors
│   │   ├── authService.js            # Authentication APIs
│   │   ├── adminService.js           # Admin portal APIs
│   │   ├── hodService.js             # HOD portal APIs
│   │   └── principalService.js       # Principal portal APIs
│   │
│   ├── context/                      # React Context
│   │   └── AuthContext.jsx           # Authentication state management
│   │
│   ├── components/                   # Shared components
│   │   ├── Layout.jsx                # Student portal layout
│   │   └── ProtectedRoute.jsx        # Route protection component
│   │
│   ├── pages/                        # Student portal pages (18 pages)
│   ├── admin-pages/                  # Admin portal pages (13 pages)
│   ├── admin-components/             # Admin layout components
│   ├── faculty-pages/                # Faculty portal pages (9 pages)
│   ├── faculty-components/           # Faculty layout components
│   ├── hod-pages/                    # HOD portal pages (9 pages)
│   ├── hod-components/               # HOD layout components
│   ├── principal-pages/              # Principal portal pages (9 pages)
│   ├── principal-components/         # Principal layout components
│   ├── club-pages/                   # Club portal pages (6 pages)
│   ├── club-components/              # Club layout components
│   ├── hostel-pages/                 # Hostel portal pages (4 pages)
│   ├── hostel-components/            # Hostel layout components
│   ├── canteen-pages/                # Canteen portal pages (5 pages)
│   ├── canteen-components/           # Canteen layout components
│   ├── stall-pages/                  # Stall portal pages (4 pages)
│   ├── stall-components/             # Stall layout components
│   ├── sports-pages/                 # Sports portal pages (5 pages)
│   ├── sports-components/            # Sports layout components
│   ├── data/                         # Mock data and constants
│   ├── assets/                       # Images and static assets
│   ├── App.jsx                       # Root component with routing
│   └── main.jsx                      # Entry point
│
├── public/                           # Public assets
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
└── eslint.config.js                  # ESLint configuration
```

---

## 3. Portal System Architecture

The application consists of **10 distinct portals** with role-based access:

### 3.1 Student Portal (`/student`)
**Role:** `student`
**Pages:** 18 pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/student/dashboard` | Overview with quick stats, upcoming events |
| Assignments | `/student/assignments` | View and submit assignments |
| Attendance | `/student/attendance` | Check attendance records |
| Results | `/student/results` | Exam results and grades |
| Academic Calendar | `/student/academic-calendar` | View academic events and deadlines |
| Events | `/student/events` | Campus events and activities |
| Canteen | `/student/canteen` | Order food from canteen |
| Campus Coins | `/student/campus-coins` | Virtual currency system |
| Timetable | `/student/timetable` | Class schedule |
| Notices | `/student/notices` | Important announcements |
| Certificates | `/student/certificates` | Download certificates |
| Feedback | `/student/feedback` | Provide course/faculty feedback |
| Fee Management | `/student/fee-management` | View and pay fees |
| Hostel | `/student/hostel` | Hostel-related information |
| Gate Pass | `/student/gate-pass` | Request outpass/gate pass |
| Achievements | `/student/achievements` | View achievements and awards |
| Profile | `/student/profile` | Student profile management |

**Key Features:**
- Dashboard with widgets for quick access
- Interactive assignment submission
- Attendance tracking with visualization
- Canteen ordering system with campus coins
- Gate pass request workflow
- Real-time notifications

---

### 3.2 Admin Portal (`/admin`)
**Role:** `admin`
**Pages:** 13 pages

| Page | Route | Description |
|------|-------|-------------|
| Admin Dashboard | `/admin` | System-wide analytics and stats |
| User Management | `/admin/users` | Manage all users (students, faculty, etc.) |
| Department Management | `/admin/departments` | CRUD operations for departments |
| Subject Management | `/admin/subjects` | Manage subjects and courses |
| Academic Management | `/admin/academic` | Semesters, events, external marks |
| Fee Management | `/admin/fees` | Fee structure and payment tracking |
| Hostel Management | `/admin/hostel` | Hostel blocks, rooms, wardens |
| Sports Management | `/admin/sports` | Sports facilities and bookings |
| Approval Management | `/admin/approvals` | Approve various requests |
| Notice Management | `/admin/notices` | Create and manage notices |
| Reports & Analytics | `/admin/reports` | Generate reports and analytics |
| System Settings | `/admin/settings` | System configuration |
| Admin Profile | `/admin/profile` | Admin profile |

**Key Features:**
- **Hostel Management:**
  - Create/update/delete hostel blocks
  - Manage rooms and capacity
  - Track occupancy statistics
  - Assign wardens
- **Sports Management:**
  - Manage sports facilities (indoor/outdoor)
  - Approve/reject booking requests
  - Track facility status (available/maintenance)
  - Revenue tracking
- **Academic Management:**
  - Create/update semesters
  - Manage academic events calendar
  - Google Calendar sync (mock)
  - Bulk marks upload
- **Dashboard Analytics:**
  - Total users breakdown
  - Department statistics
  - Fee collection metrics
  - Real-time system health

**API Integration Status:** ✅ Fully integrated with backend APIs

---

### 3.3 Faculty Portal (`/faculty`)
**Role:** `faculty`
**Pages:** 9 pages

| Page | Route | Description |
|------|-------|-------------|
| Faculty Dashboard | `/faculty/dashboard` | Faculty overview and quick actions |
| Attendance Management | `/faculty/attendance` | Mark and manage student attendance |
| Marks Upload | `/faculty/marks` | Upload internal/external marks |
| Assignment Management | `/faculty/assignments` | Create and grade assignments |
| Student Achievements | `/faculty/achievements` | Record student achievements |
| Timetable | `/faculty/timetable` | Faculty schedule |
| Leave Management | `/faculty/leave` | Apply for leave |
| Payroll Dashboard | `/faculty/payroll` | View salary and payslips |
| Faculty Profile | `/faculty/profile` | Faculty profile |

**Key Features:**
- Attendance marking with multiple options (Present, Absent, Late)
- Bulk marks upload via CSV
- Assignment creation with deadlines
- Leave request workflow
- Payroll transparency

---

### 3.4 HOD Portal (`/hod`)
**Role:** `hod` (Head of Department)
**Pages:** 9 pages

| Page | Route | Description |
|------|-------|-------------|
| HOD Dashboard | `/hod` | Department overview |
| Faculty Management | `/hod/faculty-management` | View and manage faculty |
| Add Faculty | `/hod/add-faculty` | Add new faculty to department |
| Leave Approval | `/hod/leave-approval` | Approve/reject faculty leave |
| Gate Pass Approval | `/hod/gate-pass` | Approve student gate passes |
| Achievements Management | `/hod/achievements` | Manage department achievements |
| Performance Monitoring | `/hod/performance` | Monitor faculty performance |
| Resource Management | `/hod/resources` | Manage department resources |
| HOD Profile | `/hod/profile` | HOD profile |

**Key Features:**
- Faculty roster with performance metrics
- Leave approval workflow
- Gate pass approval system
- Achievement tracking and display
- Resource allocation
- Department analytics

**API Integration Status:** ✅ Dashboard and core features integrated

---

### 3.5 Principal Portal (`/principal`)
**Role:** `principal`
**Pages:** 8 pages

| Page | Route | Description |
|------|-------|-------------|
| Principal Dashboard | `/principal` | Institution-wide overview |
| Department Management | `/principal/departments` | Oversee all departments |
| Leave Management | `/principal/leave-management` | Review leave requests |
| Club Management | `/principal/club-management` | Manage student clubs |
| Performance | `/principal/performance` | Institution performance analytics |
| Calendar | `/principal/calendar` | Academic calendar overview |
| Settings | `/principal/settings` | Principal preferences |
| Principal Profile | `/principal/profile` | Principal profile |

**Key Features:**
- Cross-department analytics
- HOD management
- Club oversight and approval
- Institution-wide performance tracking
- Strategic planning tools

**API Integration Status:** ✅ Fully integrated with backend APIs

---

### 3.6 Club Portal (`/club`)
**Role:** `club_admin`
**Pages:** 6 pages

| Page | Route | Description |
|------|-------|-------------|
| Club Dashboard | `/club` | Club overview and stats |
| Event Management | `/club/events` | Create and manage club events |
| Member Management | `/club/members` | Manage club members |
| Attendance Management | `/club/attendance` | Track event attendance |
| Department Management | `/club/departments` | Department-wise participation |
| Club Profile | `/club/profile` | Club information |

**Key Features:**
- Event creation and promotion
- Member registration and tracking
- Attendance for club events
- Inter-department collaboration
- Club analytics

---

### 3.7 Hostel Portal (`/hostel`)
**Role:** `warden`
**Pages:** 4 pages

| Page | Route | Description |
|------|-------|-------------|
| Hostel Dashboard | `/hostel` | Hostel overview |
| Gate Pass Management | `/hostel/gate-pass` | Approve/reject gate passes |
| Mess Menu | `/hostel/mess` | View and update mess menu |
| Hostel Profile | `/hostel/profile` | Warden profile |

**Key Features:**
- Gate pass approval system
- Student check-in/check-out tracking
- Mess menu management
- Room occupancy tracking
- Complaint management

---

### 3.8 Canteen Portal (`/canteen`)
**Role:** `canteen_manager`
**Pages:** 5 pages

| Page | Route | Description |
|------|-------|-------------|
| Canteen Dashboard | `/canteen` | Orders and sales overview |
| Stall Management | `/canteen/stalls` | Manage canteen stalls |
| Order Overview | `/canteen/orders` | View all orders |
| Revenue Analytics | `/canteen/revenue` | Financial reports |
| Canteen Profile | `/canteen/profile` | Manager profile |

**Key Features:**
- Real-time order tracking
- Multi-stall management
- Revenue analytics with charts
- Peak hours analysis
- Inventory integration

---

### 3.9 Stall Portal (`/stall`)
**Role:** `stall_owner`
**Pages:** 4 pages

| Page | Route | Description |
|------|-------|-------------|
| Stall Dashboard | `/stall` | Stall performance |
| Product Management | `/stall/products` | Add/edit menu items |
| Order Management | `/stall/orders` | Process orders |
| Stall Profile | `/stall/profile` | Stall information |

**Key Features:**
- Menu item CRUD operations
- Order queue management
- Price and availability control
- Sales analytics
- Rating and review system

---

### 3.10 Sports Portal (`/sports`)
**Role:** `guest` (public access)
**Pages:** 5 pages

| Page | Route | Description |
|------|-------|-------------|
| Sports Dashboard | `/sports` | Sports facilities overview |
| Facilities | `/sports/facilities` | View available facilities |
| Book Facility | `/sports/book` | Book sports facilities |
| My Bookings | `/sports/my-bookings` | View booking history |
| Sports Profile | `/sports/profile` | User profile |

**Key Features:**
- Facility browsing with filters
- Real-time availability checking
- Booking system with time slots
- Booking history and status
- Payment integration

---

## 4. Authentication & Authorization

### AuthContext (`src/context/AuthContext.jsx`)
Centralized authentication state management using React Context API.

**Features:**
- Login with email, password, and role
- Logout functionality
- Token management (localStorage)
- User state persistence
- Error handling

**Methods:**
```javascript
{
  user,              // Current logged-in user object
  login(email, password, role),  // Login function
  logout(),          // Logout function
  loading,           // Loading state
  error,             // Error message
  updateUser(userData) // Update user data
}
```

### Protected Routes
**Component:** `ProtectedRoute.jsx`

Implements role-based access control:
```javascript
<ProtectedRoute allowedRoles={['admin', 'hod']}>
  <SomeComponent />
</ProtectedRoute>
```

**Flow:**
1. Check if user is authenticated
2. Verify user role matches allowed roles
3. Redirect to login if not authenticated
4. Show unauthorized message if wrong role

---

## 5. API Integration Layer

### API Client (`src/api/client.js`)
Centralized Axios instance with interceptors.

**Configuration:**
- **Base URL:** `http://localhost:5000/api`
- **Headers:** `Content-Type: application/json`

**Request Interceptor:**
- Automatically adds Bearer token from localStorage
- Adds `Authorization: Bearer <token>` header

**Response Interceptor:**
- Handles 401 errors (token expiration)
- Auto-redirects to login on authentication failure
- Clears localStorage on token expiry

### API Services

#### adminService.js
**Endpoints:**
- User Management: CRUD operations for users
- Department Management: Department CRUD
- Subject Management: Subject CRUD
- **Semester Management:**
  - `getSemesters(filters)`
  - `createSemester(semesterData)`
  - `updateSemester(id, semesterData)`
  - `deleteSemester(id)`
- **Academic Events:**
  - `getAcademicEvents(filters)`
  - `createAcademicEvent(eventData)`
  - `updateAcademicEvent(id, eventData)`
  - `deleteAcademicEvent(id)`
  - `getAcademicStats()`
- **Hostel Management:**
  - `getHostelBlocks()`
  - `createHostelBlock(blockData)`
  - `updateHostelBlock(id, blockData)`
  - `deleteHostelBlock(id)`
  - `getHostelStats()`
- **Sports Management:**
  - `getSportsFacilities(filters)`
  - `createSportsFacility(facilityData)`
  - `updateSportsFacility(id, facilityData)`
  - `deleteSportsFacility(id)`
  - `getSportsBookings(filters)`
  - `approveSportsBooking(id)`
  - `rejectSportsBooking(id, reason)`
  - `getSportsStats()`
- **Fee Management:**
  - `getFeeRecords(filters)`
  - `createFeeRecord(feeData)`
  - `updateFeeRecord(id, feeData)`
- **Notice Management:**
  - `getNotices()`
  - `createNotice(noticeData)`
  - `updateNotice(id, noticeData)`
  - `deleteNotice(id)`

**Total:** ~40+ API endpoints

#### hodService.js
**Endpoints:**
- Dashboard statistics
- Faculty management
- Leave approval
- Gate pass approval
- Performance monitoring
- Resource management

#### principalService.js
**Endpoints:**
- Dashboard statistics
- Department overview
- Club management
- Performance analytics
- Leave management

#### authService.js
**Endpoints:**
- `login(email, password, role)` - User authentication
- `logout()` - User logout
- `register(userData)` - User registration
- `refreshToken()` - Token refresh

---

## 6. UI/UX Design System

### Tailwind CSS Configuration

#### Custom Color Palette
```javascript
primary: {
  50-900: Blue shades (#f0f9ff to #0c4a6e)
}
secondary: {
  50-900: Purple shades (#faf5ff to #581c87)
}
```

#### Custom Animations
- `fade-in` - 0.5s fade in effect
- `slide-up` - 0.5s slide up animation
- `slide-down` - 0.5s slide down animation
- `scale-in` - 0.3s scale animation
- `bounce-gentle` - 2s infinite gentle bounce

### Framer Motion
Used for:
- Page transitions
- Modal animations
- Card hover effects
- List item animations
- Loading states

### Icon Libraries
- **lucide-react:** Primary icon library (modern, consistent)
- **react-icons:** Supplementary icons

### Design Patterns

#### Common Components
1. **Stat Cards:** Display metrics with icons
2. **Data Tables:** Sortable, filterable tables
3. **Modals:** Add/Edit forms in overlays
4. **Action Buttons:** Primary, secondary, danger variants
5. **Status Badges:** Color-coded status indicators
6. **Charts:** Bar, line, pie charts using Recharts
7. **Loading Spinners:** Consistent loading states
8. **Empty States:** Friendly no-data messages

#### Color Coding
- **Green:** Success, available, approved
- **Red:** Danger, unavailable, rejected
- **Amber/Yellow:** Warning, pending
- **Blue:** Info, active
- **Gray:** Neutral, inactive

---

## 7. Routing Structure

### Route Protection
All portals except login are protected with `ProtectedRoute` component.

### Role-Based Routes

| Portal | Base Path | Allowed Roles | Default Redirect |
|--------|-----------|---------------|------------------|
| Student | `/student/*` | `student` | `/student/dashboard` |
| Admin | `/admin/*` | `admin` | `/admin` |
| Faculty | `/faculty/*` | `faculty` | `/faculty/dashboard` |
| HOD | `/hod/*` | `hod` | `/hod` |
| Principal | `/principal/*` | `principal` | `/principal` |
| Club | `/club/*` | `club_admin` | `/club` |
| Hostel | `/hostel/*` | `warden` | `/hostel` |
| Canteen | `/canteen/*` | `canteen_manager` | `/canteen` |
| Stall | `/stall/*` | `stall_owner` | `/stall` |
| Sports | `/sports/*` | `guest` | `/sports` |

### Navigation Flow
1. Root `/` → Redirects to `/login`
2. After login → Redirects to portal based on user role
3. Nested routes use `<Outlet />` from React Router
4. Each portal has its own layout component

---

## 8. State Management

### Approach
- **Context API** for global authentication state
- **Local State (useState)** for component-level state
- **No Redux** - kept simple with Context + local state

### Data Flow
1. User logs in → AuthContext stores user data
2. API calls made with token from localStorage
3. Components fetch data on mount using useEffect
4. Loading states managed locally in each component
5. Error handling with try-catch and user alerts

### Caching Strategy
- No client-side caching implemented
- Fresh data fetched on each page load
- Refetch after mutations (create/update/delete)

---

## 9. Key Features Implementation

### 9.1 Dashboard Analytics
**Used in:** Admin, HOD, Principal, Faculty dashboards

**Components:**
- Stat cards with icons and colors
- Trend indicators (up/down arrows)
- Quick action buttons
- Recent activity lists
- Charts (bar, line, pie) using Recharts

**Data Points:**
- Total counts (users, departments, etc.)
- Percentage metrics
- Revenue/financial data
- Time-series data for trends

### 9.2 CRUD Operations
**Pattern used across all portals:**

```javascript
// Fetch data
useEffect(() => {
  fetchData();
}, []);

// Create
const handleAdd = async (formData) => {
  const response = await service.create(formData);
  if (response.success) {
    await fetchData(); // Refresh list
  }
};

// Update
const handleUpdate = async (id, formData) => {
  const response = await service.update(id, formData);
  if (response.success) {
    await fetchData();
  }
};

// Delete
const handleDelete = async (id) => {
  if (confirm('Are you sure?')) {
    const response = await service.delete(id);
    if (response.success) {
      await fetchData();
    }
  }
};
```

### 9.3 Form Handling
**Pattern:**
- Controlled inputs with `useState`
- Form validation on submit
- Loading states during submission
- Success/error alerts
- Modal-based forms using AnimatePresence

### 9.4 Table Management
**Features:**
- Search/filter functionality
- Sorting capabilities
- Pagination (where needed)
- Action buttons per row (edit, delete)
- Empty state handling
- Loading skeleton states

### 9.5 File Upload
**Used in:**
- Assignment submission
- Bulk marks upload
- Certificate upload
- Profile picture upload

**Implementation:**
- Input type="file" with onChange handler
- FileReader API for preview
- FormData for multipart upload
- Progress indicators

### 9.6 Real-time Updates
**Current Implementation:**
- Manual refresh on actions
- Auto-fetch on component mount

**Future Enhancement Areas:**
- WebSocket integration for live updates
- Notification system
- Real-time order tracking

---

## 10. Common UI Patterns

### 10.1 Layout Structure
Each portal has a layout component with:
- **Sidebar:** Navigation links with icons
- **Header:** User info, notifications, logout
- **Main Content:** `<Outlet />` for nested routes
- **Footer:** (optional)

### 10.2 Modal Pattern
```javascript
const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState({});

<AnimatePresence>
  {showModal && (
    <motion.div className="fixed inset-0 bg-black/50">
      <motion.div className="bg-white rounded-xl">
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
        </form>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### 10.3 Loading State
```javascript
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent" />
    </div>
  );
}
```

### 10.4 Empty State
```javascript
{items.length === 0 && (
  <div className="text-center py-12">
    <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500">No items found</p>
    <button onClick={handleAdd}>Add New</button>
  </div>
)}
```

---

## 11. Performance Optimizations

### Current Optimizations
1. **Code Splitting:** React Router lazy loading capability (not implemented yet)
2. **Vite:** Fast HMR (Hot Module Replacement)
3. **Tailwind CSS:** Purging unused styles in production
4. **React 19:** Latest performance improvements

### Recommended Optimizations
1. **React.lazy()** for route-based code splitting
2. **useMemo/useCallback** for expensive computations
3. **Virtualization** for long lists
4. **Image optimization** with lazy loading
5. **API response caching** with SWR or React Query
6. **Service Workers** for offline capability

---

## 12. Error Handling

### API Error Handling
```javascript
try {
  const response = await apiService.getData();
  if (response.success) {
    setData(response.data);
  } else {
    alert(response.message || 'Operation failed');
  }
} catch (error) {
  console.error('Error:', error);
  alert(error.response?.data?.message || 'Something went wrong');
}
```

### Authentication Errors
- 401 errors caught by Axios interceptor
- Auto-logout and redirect to login
- Clear localStorage on token expiry

### Form Validation
- Client-side validation using HTML5 attributes
- Required fields marked with `*`
- Pattern matching for email, phone, etc.
- Custom validation logic in submit handlers

---

## 13. Accessibility Features

### Current Implementation
- Semantic HTML elements
- Button elements for clickable items
- Form labels properly associated
- Alt text for icons (where applicable)

### Areas for Improvement
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance

---

## 14. Responsive Design

### Breakpoints (Tailwind Default)
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px
- `2xl:` 1536px

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement with breakpoints
- Grid layouts with responsive columns
- Collapsible sidebar on mobile
- Touch-friendly buttons and inputs

---

## 15. Build & Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:5173 (Vite default)
```

### Production Build
```bash
npm run build
# Outputs to dist/ folder
# Optimized and minified
```

### Preview Production
```bash
npm run preview
# Preview production build locally
```

### Environment Variables
Not currently used, but recommended:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=CoCampus
```

---

## 16. Security Considerations

### Implemented
1. **JWT Token Authentication:** Stored in localStorage
2. **Authorization Header:** Added to all API requests
3. **Role-Based Access Control:** Protected routes
4. **Token Expiry Handling:** Auto-logout on 401

### Recommendations
1. **HTTPS:** Use HTTPS in production
2. **CSP Headers:** Content Security Policy
3. **XSS Prevention:** Sanitize user inputs
4. **CSRF Protection:** Use CSRF tokens
5. **HttpOnly Cookies:** Store tokens in HttpOnly cookies instead of localStorage
6. **Rate Limiting:** Implement on API calls
7. **Input Validation:** Both client and server-side

---

## 17. Testing Strategy

### Current State
No tests implemented.

### Recommended Testing
1. **Unit Tests:** Jest + React Testing Library
2. **Integration Tests:** Test API integration
3. **E2E Tests:** Cypress or Playwright
4. **Visual Regression:** Chromatic or Percy
5. **Accessibility Tests:** axe-core

---

## 18. Code Style & Conventions

### File Naming
- **Components:** PascalCase (e.g., `Dashboard.jsx`)
- **Utilities:** camelCase (e.g., `authService.js`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Component Structure
```javascript
// Imports
import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import service from '../api/service';

// Component
const ComponentName = () => {
  // State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effects
  useEffect(() => {
    fetchData();
  }, []);

  // Functions
  const fetchData = async () => {
    // ...
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### CSS Classes
- Tailwind utility classes
- Responsive modifiers
- Hover/focus states
- Conditional classes with template literals

---

## 19. API Response Format

### Standard Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation successful"
}
```

### Standard Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors */ ]
}
```

### Authentication Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    }
  }
}
```

---

## 20. Future Enhancements

### Planned Features
1. **Real-time Notifications:** WebSocket integration
2. **Progressive Web App (PWA):** Offline support
3. **Dark Mode:** Theme toggle
4. **Multi-language Support:** i18n
5. **Advanced Analytics:** More chart types
6. **Export Functionality:** PDF/Excel exports
7. **Bulk Operations:** Select multiple items
8. **Advanced Filters:** Date ranges, multi-select
9. **Audit Logs:** Track all changes
10. **Email Notifications:** Integration with email service

### Technical Improvements
1. Code splitting with React.lazy()
2. State management with Zustand or Jotai
3. API caching with SWR or React Query
4. Form library (React Hook Form)
5. Schema validation (Zod or Yup)
6. TypeScript migration
7. Storybook for component documentation
8. Automated testing setup
9. CI/CD pipeline
10. Performance monitoring

---

## 21. Troubleshooting

### Common Issues

#### 1. Token Expired
**Symptom:** Redirected to login repeatedly
**Solution:** Check token expiry time, implement token refresh

#### 2. CORS Errors
**Symptom:** Network errors in browser console
**Solution:** Configure CORS on backend server

#### 3. Build Errors
**Symptom:** Vite build fails
**Solution:** Check for missing dependencies, clear node_modules and reinstall

#### 4. Slow Performance
**Symptom:** Laggy UI, slow page loads
**Solution:** Implement code splitting, optimize images, reduce bundle size

---

## 22. Project Statistics

- **Total Components:** 128+ JSX/JS files
- **Total Portals:** 10 distinct role-based portals
- **Total Pages:** ~90 pages across all portals
- **API Services:** 5 service files (~1,200+ lines)
- **Total Routes:** 90+ protected routes
- **Supported Roles:** 10 roles (admin, student, faculty, hod, principal, club_admin, warden, canteen_manager, stall_owner, guest)

---

## 23. Key Architectural Decisions

### Why React?
- Component-based architecture
- Large ecosystem
- Virtual DOM for performance
- React 19 latest features

### Why Vite?
- Faster than Create React App
- Lightning-fast HMR
- Optimized production builds
- Native ES modules

### Why Tailwind CSS?
- Utility-first approach
- Rapid development
- Consistent design system
- Small production bundle

### Why Context API over Redux?
- Simpler setup for authentication
- No need for complex state management
- Sufficient for current requirements
- Can migrate to Redux/Zustand if needed

### Why Axios over Fetch?
- Interceptor support
- Automatic JSON parsing
- Better error handling
- Request/response transformation

---

## 24. Dependencies Breakdown

### Production Dependencies
```json
{
  "axios": "HTTP client",
  "date-fns": "Date formatting",
  "framer-motion": "Animations",
  "lucide-react": "Icons",
  "react": "UI framework",
  "react-dom": "DOM rendering",
  "react-icons": "Additional icons",
  "react-router-dom": "Routing",
  "recharts": "Charts"
}
```

### Dev Dependencies
```json
{
  "vite": "Build tool",
  "tailwindcss": "CSS framework",
  "postcss": "CSS processing",
  "autoprefixer": "CSS prefixing",
  "eslint": "Linting",
  "@vitejs/plugin-react": "React support"
}
```

---

## 25. Contact & Support

This documentation covers the complete frontend architecture of the CoCampus Student Portal System. For backend integration details, refer to the backend API documentation.

**Project Repository:** (Add your GitHub URL)
**API Documentation:** (Add API docs URL)
**Deployment URL:** (Add production URL)

---

## Appendix A: File Structure Tree

```
student-portal/
├── dist/                     # Production build (generated)
├── node_modules/             # Dependencies (gitignored)
├── public/                   # Static assets
├── src/
│   ├── admin-components/     # AdminLayout.jsx
│   ├── admin-pages/          # 13 admin pages
│   ├── api/                  # 5 API service files
│   ├── assets/               # Images, logos
│   ├── canteen-components/   # CanteenLayout.jsx
│   ├── canteen-pages/        # 5 canteen pages
│   ├── club-components/      # ClubLayout.jsx
│   ├── club-data/            # Mock data
│   ├── club-pages/           # 6 club pages
│   ├── components/           # Shared components
│   ├── context/              # AuthContext.jsx
│   ├── data/                 # Mock data
│   ├── faculty-components/   # FacultyLayout.jsx
│   ├── faculty-data/         # Mock data
│   ├── faculty-pages/        # 9 faculty pages
│   ├── hod-components/       # HoDLayout.jsx
│   ├── hod-data/             # Mock data
│   ├── hod-pages/            # 9 HOD pages
│   ├── hostel-components/    # HostelLayout.jsx
│   ├── hostel-pages/         # 4 hostel pages
│   ├── pages/                # 18 student pages
│   ├── principal-components/ # PrincipalLayout.jsx
│   ├── principal-data/       # Mock data
│   ├── principal-pages/      # 8 principal pages
│   ├── sports-components/    # SportsLayout.jsx
│   ├── sports-pages/         # 5 sports pages
│   ├── stall-components/     # StallLayout.jsx
│   ├── stall-pages/          # 4 stall pages
│   ├── App.jsx               # Root component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── .eslintrc.cjs             # ESLint config
├── .gitignore                # Git ignore rules
├── index.html                # HTML template
├── package.json              # Dependencies
├── postcss.config.js         # PostCSS config
├── tailwind.config.js        # Tailwind config
└── vite.config.js            # Vite config
```

---

## Appendix B: Complete Page Listing

### Student Portal (18 pages)
1. Dashboard
2. Assignments
3. Attendance
4. Results
5. Academic Calendar
6. Events
7. Canteen
8. Campus Coins
9. Timetable
10. Notices
11. Certificates
12. Feedback
13. Fee Management
14. Hostel
15. Gate Pass
16. Achievements
17. Profile
18. Login (shared)

### Admin Portal (13 pages)
1. Dashboard
2. User Management
3. Department Management
4. Subject Management
5. Academic Management
6. Fee Management
7. Hostel Management ✅
8. Sports Management ✅
9. Approval Management
10. Notice Management
11. Reports & Analytics
12. System Settings
13. Profile

### Faculty Portal (9 pages)
1. Dashboard
2. Attendance Management
3. Marks Upload
4. Assignment Management
5. Student Achievements
6. Timetable
7. Leave Management
8. Payroll Dashboard
9. Profile

### HOD Portal (9 pages)
1. Dashboard ✅
2. Faculty Management ✅
3. Add Faculty
4. Leave Approval
5. Gate Pass Approval
6. Achievements Management
7. Performance Monitoring
8. Resource Management
9. Profile

### Principal Portal (8 pages)
1. Dashboard ✅
2. Department Management ✅
3. Leave Management
4. Club Management ✅
5. Performance
6. Calendar
7. Settings
8. Profile

### Club Portal (6 pages)
1. Dashboard
2. Event Management
3. Member Management
4. Attendance Management
5. Department Management
6. Profile

### Hostel Portal (4 pages)
1. Dashboard
2. Gate Pass Management
3. Mess Menu
4. Profile

### Canteen Portal (5 pages)
1. Dashboard
2. Stall Management
3. Order Overview
4. Revenue Analytics
5. Profile

### Stall Portal (4 pages)
1. Dashboard
2. Product Management
3. Order Management
4. Profile

### Sports Portal (5 pages)
1. Dashboard
2. Facilities
3. Book Facility
4. My Bookings
5. Profile

**Total: ~90 pages**

✅ = Fully integrated with backend APIs

---

*End of Documentation*
