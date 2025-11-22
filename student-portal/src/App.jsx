import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Student Portal
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import Attendance from './pages/Attendance';
import Results from './pages/Results';
import Events from './pages/Events';
import Canteen from './pages/Canteen';
import CampusCoins from './pages/CampusCoins';
import Timetable from './pages/Timetable';
import Notices from './pages/Notices';
import Profile from './pages/Profile';
import AcademicCalendar from './pages/AcademicCalendar';
import Certificates from './pages/Certificates';
import Feedback from './pages/Feedback';
import FeeManagement from './pages/FeeManagement';
import Hostel from './pages/Hostel';
import GatePass from './pages/GatePass';
import Achievements from './pages/Achievements';

// Faculty Portal
import FacultyLayout from './faculty-components/FacultyLayout';
import FacultyDashboard from './faculty-pages/FacultyDashboard';
import AttendanceManagement from './faculty-pages/AttendanceManagement';
import MarksUpload from './faculty-pages/MarksUpload';
import AssignmentManagement from './faculty-pages/AssignmentManagement';
import StudentAchievements from './faculty-pages/StudentAchievements';
import LeaveManagement from './faculty-pages/LeaveManagement';
import PayrollDashboard from './faculty-pages/PayrollDashboard';
import FacultyTimetable from './faculty-pages/FacultyTimetable';
import FacultyProfile from './faculty-pages/FacultyProfile';

// HoD Portal
import HoDLayout from './hod-components/HoDLayout';
import HoDDashboard from './hod-pages/HoDDashboard';
import FacultyManagement from './hod-pages/FacultyManagement';
import AddFaculty from './hod-pages/AddFaculty';
import LeaveApproval from './hod-pages/LeaveApproval';
import GatePassApproval from './hod-pages/GatePassApproval';
import AchievementsManagement from './hod-pages/AchievementsManagement';
import PerformanceMonitoring from './hod-pages/PerformanceMonitoring';
import ResourceManagement from './hod-pages/ResourceManagement';
import HoDProfile from './hod-pages/HoDProfile';

// Principal Portal
import PrincipalLayout from './principal-components/PrincipalLayout';
import PrincipalDashboard from './principal-pages/PrincipalDashboard';
import DepartmentManagement from './principal-pages/DepartmentManagement';
import PrincipalLeaveManagement from './principal-pages/LeaveManagement';
import ClubManagement from './principal-pages/ClubManagement';
import Performance from './principal-pages/Performance';
import PrincipalCalendar from './principal-pages/Calendar';
import PrincipalSettings from './principal-pages/Settings';
import PrincipalProfile from './principal-pages/PrincipalProfile';

// Club Portal
import ClubLayout from './club-components/ClubLayout';
import ClubDashboard from './club-pages/ClubDashboard';
import EventManagement from './club-pages/EventManagement';
import MemberManagement from './club-pages/MemberManagement';
import AttendanceRequestManagement from './club-pages/AttendanceManagement';
import ClubDepartmentManagement from './club-pages/DepartmentManagement';
import ClubProfile from './club-pages/ClubProfile';

// Hostel Portal
import HostelLayout from './hostel-components/HostelLayout';
import HostelDashboard from './hostel-pages/HostelDashboard';
import HostelGatePassManagement from './hostel-pages/GatePassManagement';
import HostelMessMenu from './hostel-pages/MessMenu';
import HostelProfile from './hostel-pages/HostelProfile';

// Canteen Portal
import CanteenLayout from './canteen-components/CanteenLayout';
import CanteenDashboard from './canteen-pages/CanteenDashboard';
import CanteenStallManagement from './canteen-pages/StallManagement';
import OrderOverview from './canteen-pages/OrderOverview';
import RevenueAnalytics from './canteen-pages/RevenueAnalytics';
import CanteenProfile from './canteen-pages/CanteenProfile';

// Stall Portal
import StallLayout from './stall-components/StallLayout';
import StallDashboard from './stall-pages/StallDashboard';
import ProductManagement from './stall-pages/ProductManagement';
import StallOrderManagement from './stall-pages/OrderManagement';
import StallProfile from './stall-pages/StallProfile';

// Sports Portal
import SportsLayout from './sports-components/SportsLayout';
import SportsDashboard from './sports-pages/SportsDashboard';
import Facilities from './sports-pages/Facilities';
import BookFacility from './sports-pages/BookFacility';
import MyBookings from './sports-pages/MyBookings';
import SportsProfile from './sports-pages/SportsProfile';

// Admin Portal
import AdminLayout from './admin-components/AdminLayout';
import AdminDashboard from './admin-pages/AdminDashboard';
import UserManagement from './admin-pages/UserManagement';
import AdminDepartmentManagement from './admin-pages/DepartmentManagement';
import SubjectManagement from './admin-pages/SubjectManagement';
import AcademicManagement from './admin-pages/AcademicManagement';
import AdminFeeManagement from './admin-pages/FeeManagement';
import AdminHostelManagement from './admin-pages/HostelManagement';
import SportsManagement from './admin-pages/SportsManagement';
import ApprovalManagement from './admin-pages/ApprovalManagement';
import NoticeManagement from './admin-pages/NoticeManagement';
import ReportsAnalytics from './admin-pages/ReportsAnalytics';
import SystemSettings from './admin-pages/SystemSettings';
import AdminProfile from './admin-pages/AdminProfile';

// Auth
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Root redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Student Portal */}
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="results" element={<Results />} />
          <Route path="academic-calendar" element={<AcademicCalendar />} />
          <Route path="events" element={<Events />} />
          <Route path="canteen" element={<Canteen />} />
          <Route path="campus-coins" element={<CampusCoins />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="notices" element={<Notices />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="fee-management" element={<FeeManagement />} />
          <Route path="hostel" element={<Hostel />} />
          <Route path="gate-pass" element={<GatePass />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Faculty Portal */}
        <Route path="/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/faculty/dashboard" replace />} />
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="marks" element={<MarksUpload />} />
          <Route path="assignments" element={<AssignmentManagement />} />
          <Route path="achievements" element={<StudentAchievements />} />
          <Route path="timetable" element={<FacultyTimetable />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="payroll" element={<PayrollDashboard />} />
          <Route path="profile" element={<FacultyProfile />} />
        </Route>

        {/* HoD Portal */}
        <Route path="/hod" element={<ProtectedRoute allowedRoles={['hod']}><HoDLayout /></ProtectedRoute>}>
          <Route index element={<HoDDashboard />} />
          <Route path="faculty-management" element={<FacultyManagement />} />
          <Route path="add-faculty" element={<AddFaculty />} />
          <Route path="leave-approval" element={<LeaveApproval />} />
          <Route path="gate-pass" element={<GatePassApproval />} />
          <Route path="achievements" element={<AchievementsManagement />} />
          <Route path="performance" element={<PerformanceMonitoring />} />
          <Route path="resources" element={<ResourceManagement />} />
          <Route path="profile" element={<HoDProfile />} />
        </Route>

        {/* Principal Portal */}
        <Route path="/principal" element={<ProtectedRoute allowedRoles={['principal']}><PrincipalLayout /></ProtectedRoute>}>
          <Route index element={<PrincipalDashboard />} />
          <Route path="departments" element={<DepartmentManagement />} />
          <Route path="leave-management" element={<PrincipalLeaveManagement />} />
          <Route path="club-management" element={<ClubManagement />} />
          <Route path="performance" element={<Performance />} />
          <Route path="calendar" element={<PrincipalCalendar />} />
          <Route path="settings" element={<PrincipalSettings />} />
          <Route path="profile" element={<PrincipalProfile />} />
        </Route>

        {/* Club Portal */}
        <Route path="/club" element={<ProtectedRoute allowedRoles={['club_admin']}><ClubLayout /></ProtectedRoute>}>
          <Route index element={<ClubDashboard />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="members" element={<MemberManagement />} />
          <Route path="attendance" element={<AttendanceRequestManagement />} />
          <Route path="departments" element={<ClubDepartmentManagement />} />
          <Route path="profile" element={<ClubProfile />} />
        </Route>

        {/* Hostel Portal */}
        <Route path="/hostel" element={<ProtectedRoute allowedRoles={['warden']}><HostelLayout /></ProtectedRoute>}>
          <Route index element={<HostelDashboard />} />
          <Route path="gate-pass" element={<HostelGatePassManagement />} />
          <Route path="mess" element={<HostelMessMenu />} />
          <Route path="profile" element={<HostelProfile />} />
        </Route>

        {/* Canteen Portal */}
        <Route path="/canteen" element={<ProtectedRoute allowedRoles={['canteen_manager']}><CanteenLayout /></ProtectedRoute>}>
          <Route index element={<CanteenDashboard />} />
          <Route path="stalls" element={<CanteenStallManagement />} />
          <Route path="orders" element={<OrderOverview />} />
          <Route path="revenue" element={<RevenueAnalytics />} />
          <Route path="profile" element={<CanteenProfile />} />
        </Route>

        {/* Stall Portal */}
        <Route path="/stall" element={<ProtectedRoute allowedRoles={['stall_owner']}><StallLayout /></ProtectedRoute>}>
          <Route index element={<StallDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<StallOrderManagement />} />
          <Route path="profile" element={<StallProfile />} />
        </Route>

        {/* Sports Portal */}
        <Route path="/sports" element={<ProtectedRoute allowedRoles={['guest']}><SportsLayout /></ProtectedRoute>}>
          <Route index element={<SportsDashboard />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="book" element={<BookFacility />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="profile" element={<SportsProfile />} />
        </Route>

        {/* Admin Portal */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="departments" element={<AdminDepartmentManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="academic" element={<AcademicManagement />} />
          <Route path="fees" element={<AdminFeeManagement />} />
          <Route path="hostel" element={<AdminHostelManagement />} />
          <Route path="sports" element={<SportsManagement />} />
          <Route path="approvals" element={<ApprovalManagement />} />
          <Route path="notices" element={<NoticeManagement />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
