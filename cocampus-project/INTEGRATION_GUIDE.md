# Complete Frontend-Backend Integration Guide

## Overview

This guide shows how to integrate all remaining pages with the backend API. All service methods are already created - pages just need to call them!

## Integration Pattern (Copy-Paste Template)

Every page follows this exact pattern:

```javascript
import React, { useState, useEffect } from 'react';
import { [portalName]Service } from '../services/[portalName]Service';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const PageName = () => {
  const toast = useToast();
  const [data, setData] = useState(null); // or [] for lists
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add other local state (filters, modals, etc.)

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await [portalName]Service.getMethod();
      setData(result);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submissions
  const handleSubmit = async (formData) => {
    try {
      await [portalName]Service.submitMethod(formData);
      toast.success('Success message!');
      await loadData(); // Reload data
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err.response?.data?.message || 'Error message');
    }
  };

  // Loading and error states
  if (loading) return <Loading fullScreen message="Loading..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadData} fullScreen />;

  return (
    <div>
      {/* Your existing JSX, using {data} instead of mock data */}
    </div>
  );
};

export default PageName;
```

## Step-by-Step Integration Checklist

For each page, follow these steps:

### 1. Update Imports
```javascript
// ❌ Remove these
import { mockData } from '../data/mockData';

// ✅ Add these
import { useState, useEffect } from 'react';
import { studentService } from '../services/studentService'; // or appropriate service
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
```

### 2. Add State Management
```javascript
const toast = useToast();
const [data, setData] = useState([]); // or null for objects
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### 3. Add Data Fetching
```javascript
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    setLoading(true);
    setError(null);
    const result = await serviceName.getMethod();
    setData(result);
  } catch (err) {
    console.error('Error:', err);
    setError(err);
  } finally {
    setLoading(false);
  }
};
```

### 4. Add Loading/Error Handling
```javascript
if (loading) return <Loading fullScreen message="Loading..." />;
if (error) return <ErrorMessage error={error} onRetry={loadData} fullScreen />;
```

### 5. Update Form Submissions
```javascript
// ❌ Replace alert() or setTimeout()
const handleSubmit = (e) => {
  e.preventDefault();
  alert('Success!');
};

// ✅ With real API call
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await serviceName.submitMethod(formData);
    toast.success('Success message!');
    await loadData(); // Reload data
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error');
  }
};
```

### 6. Update Data References
```javascript
// ❌ Replace mock data
{mockData.map(item => ...)}

// ✅ With state data (add null safety)
{data?.map(item => ...)}
{data?.field || 'default'}
```

## Complete Service Method Reference

### Student Portal (`studentService`)
```javascript
// Dashboard
getDashboard() → { student, attendance, pendingAssignments, wallet, etc. }

// Assignments
getAssignments() → [...assignments]
submitAssignment(id, formData)
getAssignmentDetails(id)

// Attendance
getAttendance() → { overall, subjects: [...] }

// Results
getResults() → { semesters: [...], cgpa, etc. }

// Campus Coins
getWallet() → { balance, transactions: [...] }
topupWallet(amount, paymentMethod)
getTransactions(params)

// Gate Pass
getGatePasses() → [...passes]
requestGatePass(data)

// Events
getEvents() → [...events]
registerForEvent(eventId)
getMyEvents()

// Canteen
getCanteenStalls() → [...stalls]
getStallMenu(stallId) → [...menuItems]
placeOrder(orderData)
getMyOrders()

// Hostel
getHostelInfo() → { room, block, etc. }
getMessMenu() → { days: {...} }

// Certificates
requestCertificate(type, details)
getMyCertificates() → [...certificates]

// Achievements
getAchievements() → [...achievements]
uploadAchievement(formData)

// Timetable
getTimetable() → { days: {...} }

// Academic Calendar
getAcademicCalendar() → [...events]

// Fees
getFees() → { total, paid, pending, etc. }
payFees(amount, paymentMethod)

// Feedback
submitFeedback(data)

// Notices
getNotices() → [...notices]

// Profile
getProfile() → { student data }
updateProfile(data)
```

### Faculty Portal (`facultyService`)
```javascript
getDashboard() → dashboard data
getTimetable() → timetable
getAssignments(params) → [...assignments]
createAssignment(data)
updateAssignment(id, data)
deleteAssignment(id)
getAssignmentSubmissions(id) → [...submissions]
gradeSubmission(id, gradeData)
getSessions(params) → [...sessions]
createSession(data)
markAttendance(sessionId, data)
getAttendanceReport(params)
getExams(params) → [...exams]
enterMarks(examId, marksData)
updateMarks(markId, data)
getStudents(params) → [...students]
getLeaveRequests(params) → [...requests]
respondToLeave(leaveId, response)
getMaterials(params) → [...materials]
uploadMaterial(formData)
getProfile()
updateProfile(data)
```

### Admin Portal (`adminService`)
```javascript
getDashboard() → dashboard stats
getUsers(params) → [...users]
createUser(data)
updateUser(id, data)
deleteUser(id)
bulkUploadUsers(formData)
resetPassword(userId, newPassword)
getDepartments() → [...departments]
createDepartment(data)
updateDepartment(id, data)
deleteDepartment(id)
getSubjects(params) → [...subjects]
createSubject(data)
updateSubject(id, data)
deleteSubject(id)
getAcademicCalendar()
createAcademicEvent(data)
getFeeStructures() → [...structures]
createFeeStructure(data)
getHostelBlocks() → [...blocks]
createHostelBlock(data)
getSportsFacilities() → [...facilities]
createFacility(data)
getPendingApprovals() → [...approvals]
getNotices() → [...notices]
createNotice(formData)
updateNotice(id, formData)
deleteNotice(id)
getReports(params)
getSettings()
updateSettings(data)
```

### Other Portals
All service methods follow the same pattern. See:
- `hodService.js` for HoD methods
- `principalService.js` for Principal methods
- `clubService.js` for Club methods
- `hostelService.js` for Hostel/Warden methods
- `canteenService.js` for Canteen methods
- `stallService.js` for Stall methods
- `sportsService.js` for Sports methods

## Common Patterns

### 1. List Pages (Assignments, Users, etc.)
```javascript
const [items, setItems] = useState([]);
const [filter, setFilter] = useState('all');

const filteredItems = items.filter(item => {
  if (filter === 'all') return true;
  return item.status === filter;
});

// In JSX
{filteredItems.map(item => (
  <div key={item._id}>{item.name}</div>
))}
```

### 2. Detail Pages
```javascript
const { id } = useParams(); // from react-router-dom

useEffect(() => {
  loadDetail();
}, [id]);

const loadDetail = async () => {
  try {
    setLoading(true);
    const result = await service.getDetails(id);
    setData(result);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};
```

### 3. Form Pages with File Upload
```javascript
const [formData, setFormData] = useState({});
const [file, setFile] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    data.append('file', file);
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    await service.submitMethod(data);
    toast.success('Success!');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error');
  }
};
```

### 4. Modal/Dialog Pages
```javascript
const [showModal, setShowModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

const handleOpen = (item) => {
  setSelectedItem(item);
  setShowModal(true);
};

const handleClose = () => {
  setShowModal(false);
  setSelectedItem(null);
};

const handleModalSubmit = async (data) => {
  try {
    await service.submitMethod(selectedItem.id, data);
    toast.success('Success!');
    setShowModal(false);
    await loadData(); // Refresh
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error');
  }
};
```

### 5. Search/Filter Pages
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');

const filteredData = data?.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
  return matchesSearch && matchesStatus;
});
```

### 6. Pagination
```javascript
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const loadData = async () => {
  try {
    const result = await service.getItems({ page, limit: 10 });
    setData(result.items);
    setTotalPages(result.totalPages);
  } catch (err) {
    setError(err);
  }
};

useEffect(() => {
  loadData();
}, [page]); // Reload when page changes
```

## Data Field Mappings

Mock data vs. Backend data structures:

### User/Student
```javascript
// Mock
{id, name, rollNumber, department, semester, cgpa}

// Backend (handle both)
{_id, name, rollNumber, department: {name, code}, semester, cgpa}

// Safe access
{student._id || student.id}
{student.department?.name || student.department}
```

### Assignments
```javascript
// Mock
{id, title, subject, subjectCode, dueDate, status}

// Backend
{_id, title, subject: {name, code}, dueDate, status}

// Safe access
{assignment._id || assignment.id}
{assignment.subject?.name || assignment.subject}
{assignment.subject?.code || assignment.subjectCode}
```

## Error Handling Best Practices

```javascript
try {
  await service.method();
  toast.success('Operation successful!');
} catch (err) {
  console.error('Operation error:', err);

  // Display user-friendly error
  const message = err.response?.data?.message ||
                  err.response?.data?.error ||
                  'Operation failed. Please try again.';
  toast.error(message);
}
```

## File Upload Best Practices

```javascript
const handleFileUpload = async (file) => {
  // Validate file size
  if (file.size > 10 * 1024 * 1024) { // 10MB
    toast.error('File size must be less than 10MB');
    return;
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    toast.error('Invalid file type');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    await service.uploadFile(formData);
    toast.success('File uploaded successfully!');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Upload failed');
  }
};
```

## Testing Checklist

For each integrated page:

- [ ] Page loads without errors
- [ ] Loading state displays while fetching
- [ ] Error state displays when API fails
- [ ] Retry button works after error
- [ ] Data displays correctly (no undefined/null errors)
- [ ] Forms submit successfully
- [ ] Toast notifications appear
- [ ] Data refreshes after submission
- [ ] Filters/search work correctly
- [ ] File uploads work (if applicable)
- [ ] Modal dialogs open/close properly
- [ ] Navigation links work
- [ ] Protected routes redirect unauthorized users

## Quick Reference: Update Checklist by Page Count

### Student Portal (17 pages) ✅
1. Dashboard.jsx ✅ - Done
2. Assignments.jsx ✅ - Done
3. Attendance.jsx - `studentService.getAttendance()`
4. Results.jsx - `studentService.getResults()`
5. CampusCoins.jsx - `studentService.getWallet(), topupWallet(), getTransactions()`
6. GatePass.jsx - `studentService.getGatePasses(), requestGatePass()`
7. Events.jsx - `studentService.getEvents(), registerForEvent()`
8. Canteen.jsx - `studentService.getCanteenStalls(), placeOrder()`
9. Hostel.jsx - `studentService.getHostelInfo(), getMessMenu()`
10. Certificates.jsx - `studentService.getMyCertificates(), requestCertificate()`
11. Achievements.jsx - `studentService.getAchievements(), uploadAchievement()`
12. Timetable.jsx - `studentService.getTimetable()`
13. AcademicCalendar.jsx - `studentService.getAcademicCalendar()`
14. FeeManagement.jsx - `studentService.getFees(), payFees()`
15. Feedback.jsx - `studentService.submitFeedback()`
16. Notices.jsx - `studentService.getNotices()`
17. Profile.jsx - `studentService.getProfile(), updateProfile()`

### Faculty Portal (9 pages)
Use `facultyService` - all methods listed above

### Admin Portal (13 pages)
Use `adminService` - all methods listed above

### Other Portals
Use respective service files - all methods already created!

## Summary

**The hard work is DONE!** All service methods exist and work. Pages just need to:
1. Import the service
2. Add useState/useEffect
3. Call the service method
4. Display the data
5. Add loading/error handling

Copy the template at the top of this guide for each page and fill in the blanks!
