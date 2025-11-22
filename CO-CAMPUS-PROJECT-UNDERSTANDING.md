# Co-Campus Project - Complete Understanding Document

## 📋 Executive Summary

Co-Campus is a comprehensive multi-portal educational management system built with React 18, designed to serve all stakeholders in an educational institution. The system currently has a fully functional frontend with **mock data** and is ready for **MongoDB backend integration**.

---

## 🏗️ System Architecture

### Technology Stack
- **Frontend Framework**: React 18 (Functional components with hooks)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: useState hooks (currently with mock data)

### Project Structure
```
/home/user/cocampus/
├── student-portal/
│   ├── src/
│   │   ├── pages/                  # Student Portal (18 pages)
│   │   ├── admin-pages/            # Admin Portal (13 pages)
│   │   ├── faculty-pages/          # Faculty Portal (10 pages)
│   │   ├── hod-pages/              # HoD Portal (9 pages)
│   │   ├── principal-pages/        # Principal Portal (8 pages)
│   │   ├── club-pages/             # Club Portal (6 pages)
│   │   ├── hostel-pages/           # Hostel Portal (6 pages)
│   │   ├── canteen-pages/          # Canteen Portal (5 pages)
│   │   ├── stall-pages/            # Stall Portal (4 pages)
│   │   ├── sports-pages/           # Sports Portal (5 pages)
│   │   ├── components/             # Shared components
│   │   ├── *-components/           # Portal-specific layouts
│   │   ├── data/                   # Mock data files
│   │   └── App.jsx                 # Main routing
│   ├── package.json
│   └── vite.config.js
├── co-campus-complete-prd.md      # Complete PRD (2260 lines)
└── previous.zip                    # Original upload
```

---

## 🎯 The 10 Portals

### 1. **Student Portal** (18 Pages)
**Route**: `/student/*`

**Pages**:
1. Dashboard - Overview with attendance, assignments, campus coins, CGPA
2. Assignments - View and submit assignments
3. Attendance - Subject-wise attendance tracking
4. Results - Semester marks and CGPA
5. Academic Calendar - Events and exam schedules
6. Events - Campus and club events registration
7. Canteen - Food ordering with campus coins
8. Campus Coins - Digital wallet management
9. Timetable - Class schedule
10. Notices - Announcements and circulars
11. Certificates - Request certificates (bonafide, character, etc.)
12. Feedback - Faculty and infrastructure feedback
13. Fee Management - Fee payment and history
14. Hostel - Room info, mess menu, complaints
15. Gate Pass - Request day passes (to HoD/Warden)
16. Achievements - Upload achievements
17. Profile - Student profile management
18. Login - Multi-role login page

**Key Features**:
- Real-time attendance percentage with color-coded status
- Pending assignments with urgency indicators
- Campus coins balance and transaction history
- CGPA and semester results
- Gate pass workflow (student → HoD/Warden approval)

**Data Dependencies**:
- Assignments from Faculty Portal
- Attendance from Faculty Portal
- Marks from Faculty Portal
- Gate pass approvals from HoD/Hostel Portal
- Campus coins from Admin Portal
- Events from Club Portal

---

### 2. **Faculty Portal** (10 Pages)
**Route**: `/faculty/*`

**Pages**:
1. Dashboard - Today's schedule and stats
2. Attendance Management - Manual class attendance marking
3. Marks Upload - Internal and external marks entry
4. Assignment Management - Create and manage assignments
5. Student Achievements - View student achievements
6. Timetable - Faculty class schedule
7. Leave Management - Apply for leave
8. Payroll Dashboard - Salary slips and tax info
9. Faculty Achievements - Faculty achievements
10. Profile - Faculty profile

**Key Features**:
- Manual attendance marking (Present/Absent/Late)
- Marks upload with subject selection
- Assignment creation with file uploads
- Leave request to HoD
- Today's class schedule with take attendance buttons

**Data Outputs**:
- Attendance data → Student Portal
- Marks data → Student Portal, Admin Portal
- Assignments → Student Portal
- Leave requests → HoD Portal

---

### 3. **HoD Portal** (9 Pages)
**Route**: `/hod/*`

**Pages**:
1. Dashboard - Department overview
2. Faculty Management - View and manage faculty
3. Add Faculty - Add new faculty members
4. Leave Approval - Approve/reject faculty leave
5. Gate Pass Approval - Approve student gate passes
6. Achievements Management - Department achievements
7. Performance Monitoring - Student performance analytics
8. Resource Management - Lab and classroom resources
9. Profile - HoD profile

**Key Features**:
- Faculty workload management
- Leave approval workflow
- Student gate pass approval (for academic leaves)
- Department performance tracking
- Resource allocation

**Data Dependencies**:
- Leave requests from Faculty Portal
- Gate pass requests from Student Portal
- Faculty data from Admin Portal
- Performance data from Faculty Portal

---

### 4. **Principal Portal** (8 Pages)
**Route**: `/principal/*`

**Pages**:
1. Dashboard - Institution-wide metrics
2. Department Management - All departments overview
3. Leave Management - High-level leave tracking
4. Club Management - Oversee all clubs
5. Performance - Institution performance analytics
6. Calendar - Academic calendar view
7. Settings - System settings
8. Profile - Principal profile

**Key Features**:
- Institution-wide statistics (students, faculty, departments)
- Club event approval workflow
- Department performance comparison
- Academic calendar management
- Financial overview (fee collection, pending dues)

---

### 5. **Club Portal** (6 Pages)
**Route**: `/club/*`

**Pages**:
1. Dashboard - Club overview and stats
2. Event Management - Create and manage events
3. Member Management - Club member registration
4. Attendance Management - Track member attendance
5. Department Management - Cross-department members
6. Profile - Club profile

**Key Features**:
- Event proposal to Principal (requires approval)
- Member registration workflow
- Budget tracking
- Event attendance management

**Data Flow**:
- Events → Student Portal (after Principal approval)
- Event requests → Principal Portal

---

### 6. **Hostel Portal** (6 Pages)
**Route**: `/hostel/*`

**Pages**:
1. Dashboard - Hostel overview
2. Gate Pass Management - Approve/reject gate passes
3. Mess Menu - Weekly menu publication
4. Room Management - Room allocation
5. Student Directory - Hostel students list
6. Profile - Warden profile

**Key Features**:
- Gate pass approval for hostel students
- Weekly mess menu publication
- Room allocation and management
- Student directory with room numbers

---

### 7. **Canteen Portal** (5 Pages)
**Route**: `/canteen/*`

**Pages**:
1. Dashboard - Canteen overview and stats
2. Stall Management - Manage multiple stalls
3. Order Overview - View all orders
4. Revenue Analytics - Sales analytics
5. Profile - Canteen manager profile

**Key Features**:
- Multi-stall management
- Order processing
- Revenue tracking
- Campus coins integration

---

### 8. **Stall Portal** (4 Pages)
**Route**: `/stall/*`

**Pages**:
1. Dashboard - Stall overview
2. Product Management - Menu items and pricing
3. Order Management - Process orders
4. Profile - Stall owner profile

**Key Features**:
- Product/menu management
- Order processing with campus coins
- Daily revenue tracking
- Inventory status

---

### 9. **Sports Portal** (5 Pages)
**Route**: `/sports/*`

**Pages**:
1. Dashboard - Sports facilities overview
2. Facilities - View available facilities
3. Book Facility - Book sports facilities
4. My Bookings - View booking history
5. Profile - User profile

**Key Features**:
- Guest registration (for external users)
- Facility booking with time slots
- Payment tracking
- Admin approval for guest bookings

**Special Note**: This portal has a **signup feature** for guest users (external people who want to book facilities).

---

### 10. **Admin Portal** (13 Pages)
**Route**: `/admin/*`

**Pages**:
1. Dashboard - System-wide overview
2. User Management - CRUD for all user types
3. Department Management - Add/edit departments
4. Subject Management - Manage subjects
5. Academic Management - Semesters, calendar, external marks
6. Fee Management - Fee structure configuration
7. Hostel Management - Blocks and wardens
8. Sports Management - Facility management
9. Approval Management - Centralized approvals
10. Notice Management - Publish notices
11. Reports & Analytics - System-wide reports
12. System Settings - Configuration
13. Profile - Admin profile

**Key Features**:
- **User Management**:
  - Add users with role assignment (student, faculty, HoD, principal, warden, canteen manager)
  - Bulk upload students via CSV
  - Password reset with profile display
  - Generate random passwords

- **Department Management**:
  - Add departments with: name, code, year established, email, phone, location, vision, mission
  - Removed: annual budget field

- **Academic Management** (3 tabs):
  - **Semesters**: Manage academic years and semesters
  - **Academic Calendar**: Calendar view with Google Calendar sync, event management
  - **External Marks**: Upload marks with bulk CSV upload

- **Hostel Management**:
  - Simplified: Only Blocks and Wardens (removed Rooms tab)
  - 3 stats cards (removed occupied status)

- **Notice Management**:
  - File attachments for circulars
  - Download attachments

- **Reports & Analytics**:
  - Fixed filters with useMemo
  - Active filter indicators
  - Clear filters button

---

## 🔄 Data Flow & Dependencies

### Current Data Storage (Mock Data)
All data is currently stored in **useState hooks** with hardcoded values in each component. Examples:

```javascript
// UserManagement.jsx
const [users, setUsers] = useState([
  { id: 1, name: 'Rahul Sharma', email: 'rahul@university.edu', ... },
  { id: 2, name: 'Dr. Priya Patel', email: 'priya@university.edu', ... },
  ...
]);

// DepartmentManagement.jsx
const [departments, setDepartments] = useState([
  { id: 1, name: 'Computer Science', code: 'CSE', ... },
  ...
]);

// StudentDashboard.jsx - Imports from data files
import { studentData } from '../data/studentData';
import { attendanceData } from '../data/attendanceData';
```

### Cross-Portal Dependencies

```
┌─────────────────────────────────────────────┐
│           ADMIN PORTAL (Master)             │
│  Users, Departments, Subjects, Semesters    │
└─────────────┬───────────────────────────────┘
              │
      ┌───────┴────────┬─────────────┐
      ↓                ↓             ↓
┌──────────┐     ┌──────────┐   ┌──────────┐
│ FACULTY  │────→│ STUDENT  │←──│   HoD    │
│ Portal   │     │ Portal   │   │ Portal   │
└────┬─────┘     └────┬─────┘   └────┬─────┘
     │                │              │
     │ Attendance     │ Gate Pass    │ Approval
     │ Marks          │ Request      │
     │ Assignments    │              │
     │                ↓              ↓
     │          ┌──────────┐   ┌──────────┐
     │          │ HOSTEL   │   │   CLUB   │
     │          │ Portal   │   │ Portal   │
     │          └──────────┘   └────┬─────┘
     │                              │
     │ Event Requests               │
     └──────────────────────────────┘
                    ↓
              ┌──────────┐
              │PRINCIPAL │
              │ Portal   │
              └──────────┘
```

### Key Data Flows:

1. **Assignment Flow**:
   - Faculty creates assignment → Students see in dashboard → Students submit → Faculty grades → Students see results

2. **Attendance Flow**:
   - Faculty marks attendance → Student dashboard updates → Admin can view reports

3. **Gate Pass Flow**:
   - Student requests pass → HoD/Warden reviews → Approves/Rejects → Student notified

4. **Leave Flow**:
   - Faculty applies leave → HoD receives request → Reviews → Approves/Rejects → Faculty notified

5. **Event Flow**:
   - Club creates event → Principal reviews → Approves → Published to Student Portal → Students register

6. **Campus Coins Flow**:
   - Admin configures → Student adds coins → Uses in Canteen/Events → Transaction recorded

---

## 📊 Database Entities Required (MongoDB Collections)

Based on code analysis, here are the required collections:

### Core Collections:

1. **users**
   - Fields: userId, name, email, phone, role, department, password, status, createdAt
   - Roles: student, faculty, hod, principal, admin, warden, canteen_manager, club_admin, guest

2. **students**
   - Fields: userId (ref), rollNumber, department, semester, cgpa, currentSemesterGPA, address, dob, guardian, guardianPhone

3. **faculty**
   - Fields: userId (ref), employeeId, department, designation, qualification, specialization, assignedSubjects[], assignedClasses[]

4. **departments**
   - Fields: name, code, hodId (ref), facultyCount, studentCount, performance, yearEstablished, email, phone, location, vision, mission

5. **subjects**
   - Fields: name, code, departmentId (ref), credits, semester, type (theory/lab)

6. **attendance**
   - Fields: studentId (ref), subjectId (ref), facultyId (ref), date, status (present/absent/late), sessionType

7. **assignments**
   - Fields: title, description, subjectId (ref), facultyId (ref), classId, dueDate, maxMarks, fileUrl, allowLateSubmission

8. **assignment_submissions**
   - Fields: assignmentId (ref), studentId (ref), fileUrl, submittedAt, marks, feedback, status

9. **marks**
   - Fields: studentId (ref), subjectId (ref), semester, mid1, mid2, internal, external, total, grade

10. **semesters**
    - Fields: academicYear, semester (Odd/Even), startDate, endDate, status (active/upcoming/completed)

11. **academic_calendar**
    - Fields: title, date, endDate, type (exam/holiday/academic), description

12. **gate_passes**
    - Fields: studentId (ref), reason, duration, parentContact, status (pending/approved/rejected), approvedBy (ref), documents

13. **leave_requests**
    - Fields: facultyId (ref), leaveType, startDate, endDate, reason, substituteId (ref), status, approvedBy (ref), documents

14. **notices**
    - Fields: title, content, category, department, priority, publishedBy (ref), publishedAt, attachment

15. **events**
    - Fields: title, description, organizerId (clubId/ref), date, time, venue, maxCapacity, registrationFee, status (pending/approved/rejected)

16. **event_registrations**
    - Fields: eventId (ref), studentId (ref), paymentStatus, registeredAt

17. **campus_coins**
    - Fields: studentId (ref), balance, transactions[] (type, amount, description, date)

18. **certificates**
    - Fields: studentId (ref), type, purpose, copies, priority, status (pending/processing/completed), requestedAt

19. **feedback**
    - Fields: studentId (ref), targetId (facultyId/facilityId), category, ratings[], comments, submittedAt

20. **hostel_blocks**
    - Fields: name, wardenId (ref), totalRooms, occupiedRooms, facilities[]

21. **hostel_rooms**
    - Fields: blockId (ref), roomNumber, capacity, occupants[] (studentIds), status

22. **mess_menu**
    - Fields: weekStartDate, meals[] (day, breakfast, lunch, snacks, dinner)

23. **canteen_stalls**
    - Fields: name, ownerId (ref), category, status

24. **stall_products**
    - Fields: stallId (ref), name, description, price, category, availability, image

25. **canteen_orders**
    - Fields: studentId (ref), stallId (ref), items[], totalAmount, status, orderTime, pickupTime

26. **sports_facilities**
    - Fields: name, type, capacity, surface, pricing (regular, premium), features[]

27. **sports_bookings**
    - Fields: facilityId (ref), userId (ref), date, timeSlot, duration, amount, status, paymentStatus

28. **clubs**
    - Fields: name, description, adminId (ref), members[], budget, activities[]

29. **club_members**
    - Fields: clubId (ref), studentId (ref), role, joinedAt, status

30. **achievements**
    - Fields: userId (ref), type, title, description, certificateUrl, visibility, submittedAt, verifiedBy (ref)

---

## 🎨 UI/UX Patterns

### Common Patterns Across Portals:

1. **Dashboard Layout**:
   - Gradient header with welcome message
   - Stats cards grid (4 columns)
   - Main content area with tables/lists
   - Quick actions section

2. **Modals**:
   - AnimatePresence for smooth animations
   - Gradient headers with close button
   - Form sections with validation
   - Cancel and Submit buttons

3. **Tables**:
   - Search and filter controls
   - Sortable columns
   - Action buttons (Edit, Delete)
   - Status badges with color coding
   - Hover effects for rows

4. **Forms**:
   - Labeled inputs with Tailwind styling
   - Validation (required, min/max, patterns)
   - File uploads with drag-and-drop
   - Multi-step forms where needed

5. **Status Indicators**:
   - Color-coded badges (green/yellow/red)
   - Progress bars for percentages
   - Icons from Lucide React

6. **Animations**:
   - Framer Motion for page transitions
   - Stagger animations for lists
   - Hover and click effects
   - Loading spinners

---

## 🚀 Current State Summary

### ✅ Completed:
- ✅ All 10 portals fully designed and implemented
- ✅ 84 pages across all portals
- ✅ Complete routing structure with React Router v6
- ✅ All UI components with Tailwind CSS styling
- ✅ Animations with Framer Motion
- ✅ Mock data for all features
- ✅ Form validations and user interactions
- ✅ Responsive design
- ✅ Multi-role login system

### ⏳ Pending (Ready for MongoDB Integration):
- ⏳ Backend API development
- ⏳ MongoDB database setup
- ⏳ Replace useState with API calls
- ⏳ Authentication & authorization
- ⏳ File upload handling
- ⏳ Real-time updates
- ⏳ Payment gateway integration
- ⏳ Email notifications
- ⏳ Push notifications

---

## 📝 Implementation Notes

### File Upload Locations:
1. **Assignment Submissions**: Faculty assigns → Students upload
2. **Achievement Certificates**: Students upload → Faculty/HoD verify
3. **Gate Pass Documents**: Students upload (if required)
4. **Leave Request Documents**: Faculty upload (medical leaves)
5. **Notice Attachments**: Admin uploads
6. **Product Images**: Stall owners upload
7. **Profile Pictures**: All users

### Workflow Approvals:
1. **Leave Requests**: Faculty → HoD → Approved/Rejected
2. **Gate Passes**: Student → HoD/Warden → Approved/Rejected
3. **Event Proposals**: Club → Principal → Approved/Rejected
4. **Sports Bookings (Guest)**: Guest → Admin → Approved/Rejected
5. **Certificate Requests**: Student → Admin → Processing → Completed

### Payment Flows:
1. **Campus Coins**: Add money → Use in canteen/events
2. **Fee Payments**: Student pays → Admin verifies
3. **Event Registration**: Pay with campus coins
4. **Sports Facility Booking**: Pay online or at venue

---

## 🎯 Next Steps for MongoDB Integration

### Phase 1: Setup (Current)
1. ✅ Extract and understand all project files
2. ✅ Analyze data structures and flows
3. ⏳ Design MongoDB schemas
4. ⏳ Set up backend API structure

### Phase 2: Core Collections
1. Users, Students, Faculty
2. Departments, Subjects
3. Authentication & Authorization

### Phase 3: Academic Features
1. Attendance system
2. Marks management
3. Assignments
4. Academic calendar

### Phase 4: Approval Workflows
1. Leave requests
2. Gate passes
3. Certificate requests
4. Event approvals

### Phase 5: Campus Services
1. Campus coins
2. Canteen orders
3. Hostel management
4. Sports bookings

### Phase 6: Advanced Features
1. Notifications
2. File uploads
3. Reports & Analytics
4. Payment integration

---

## 📌 Key Technical Decisions

1. **State Management**: Currently useState, will need:
   - React Query / SWR for server state
   - Context API for global state
   - Local storage for auth tokens

2. **API Structure**: RESTful API recommended:
   - `/api/auth/*` - Authentication
   - `/api/students/*` - Student operations
   - `/api/faculty/*` - Faculty operations
   - `/api/admin/*` - Admin operations
   - etc.

3. **File Storage**:
   - Local: Use Multer + serve static files
   - Cloud: AWS S3 / Cloudinary (recommended)

4. **Real-time Updates**:
   - Socket.io for notifications
   - Polling for critical data updates

5. **Authentication**:
   - JWT tokens
   - Role-based access control (RBAC)
   - Session management

---

## 📈 Statistics

- **Total Portals**: 10
- **Total Pages**: 84
- **JSX Files**: 98
- **Data Files**: ~15 mock data files
- **Routes**: 81 defined routes
- **User Roles**: 10 distinct roles
- **Database Collections Needed**: ~30 collections

---

**Document Version**: 1.0
**Last Updated**: November 22, 2025
**Status**: Ready for MongoDB Backend Integration
