import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  BookOpen,
  Upload,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  FileText,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  Save,
  Download,
  Filter,
  RefreshCw,
  Grid,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const AcademicManagement = () => {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState('semesters');
  const [searchTerm, setSearchTerm] = useState('');

  // Calendar View State
  const [calendarViewMode, setCalendarViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Bulk Upload State
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Semesters State
  const [semesters, setSemesters] = useState([]);

  // Calendar Events State
  const [events, setEvents] = useState([]);

  // External Marks State
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studentMarks, setStudentMarks] = useState([]);

  // Modals State
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form Data
  const [semesterForm, setSemesterForm] = useState({
    academicYear: '', semester: '', startDate: '', endDate: '', status: 'upcoming'
  });
  const [eventForm, setEventForm] = useState({
    title: '', date: '', endDate: '', type: 'academic', description: ''
  });

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology'];
  const semesterOptions = ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
  const subjects = {
    'Computer Science': ['Data Structures', 'Database Management', 'Operating Systems', 'Computer Networks', 'Software Engineering'],
    'Electronics': ['Digital Electronics', 'Microprocessors', 'Signal Processing', 'VLSI Design', 'Embedded Systems'],
    'Mechanical': ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing', 'Heat Transfer'],
    'Civil': ['Structural Analysis', 'Concrete Technology', 'Surveying', 'Geotechnical Engineering', 'Transportation'],
    'Information Technology': ['Web Technologies', 'Cloud Computing', 'Cyber Security', 'Mobile Computing', 'Data Mining']
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Load Data from Backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [semestersData, calendarData] = await Promise.all([
        adminService.getSemesters(),
        adminService.getAcademicCalendar()
      ]);
      setSemesters(semestersData.semesters || semestersData || []);
      setEvents(calendarData.events || calendarData || []);
    } catch (err) {
      console.error('Error loading academic data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Load student marks when department/semester/subject changes
  useEffect(() => {
    if (selectedDepartment && selectedSemester && selectedSubject) {
      loadStudentMarks();
    }
  }, [selectedDepartment, selectedSemester, selectedSubject]);

  const loadStudentMarks = async () => {
    try {
      const marksData = await adminService.getStudentMarks({
        department: selectedDepartment,
        semester: selectedSemester,
        subject: selectedSubject
      });
      setStudentMarks(marksData.students || marksData || []);
    } catch (err) {
      console.error('Error loading student marks:', err);
      toast.error(err.response?.data?.message || 'Failed to load student marks');
    }
  };

  // Google Calendar Sync Function
  const handleGoogleCalendarSync = async () => {
    if (!isGoogleCalendarConnected) {
      // Mock connect to Google Calendar
      setIsSyncing(true);
      setTimeout(() => {
        setIsGoogleCalendarConnected(true);
        setIsSyncing(false);
        alert('Successfully connected to Google Calendar!');
      }, 2000);
    } else {
      // Mock sync events
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        alert('Calendar events synced successfully!');
      }, 1500);
    }
  };

  // Calendar Helper Functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      const startDate = new Date(event.date);
      const endDate = new Date(event.endDate);
      const currentDate = new Date(dateStr);
      return currentDate >= startDate && currentDate <= endDate;
    });
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Semester Functions
  const handleAddSemester = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingSemester) {
        await adminService.updateSemester(editingSemester.id, semesterForm);
        toast.success('Semester updated successfully!');
      } else {
        await adminService.createSemester(semesterForm);
        toast.success('Semester added successfully!');
      }
      await loadData();
      setShowSemesterModal(false);
      setEditingSemester(null);
      setSemesterForm({ academicYear: '', semester: '', startDate: '', endDate: '', status: 'upcoming' });
    } catch (err) {
      console.error('Error saving semester:', err);
      toast.error(err.response?.data?.message || 'Failed to save semester');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditSemester = (semester) => {
    setEditingSemester(semester);
    setSemesterForm(semester);
    setShowSemesterModal(true);
  };

  const deleteSemester = async (id) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        await adminService.deleteSemester(id);
        toast.success('Semester deleted successfully!');
        await loadData();
      } catch (err) {
        console.error('Error deleting semester:', err);
        toast.error(err.response?.data?.message || 'Failed to delete semester');
      }
    }
  };

  // Event Functions
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingEvent) {
        await adminService.updateAcademicEvent(editingEvent.id, eventForm);
        toast.success('Event updated successfully!');
      } else {
        await adminService.createAcademicEvent(eventForm);
        toast.success('Event added successfully!');
      }
      await loadData();
      setShowEventModal(false);
      setEditingEvent(null);
      setEventForm({ title: '', date: '', endDate: '', type: 'academic', description: '' });
    } catch (err) {
      console.error('Error saving event:', err);
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm(event);
    setShowEventModal(true);
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await adminService.deleteAcademicEvent(id);
        toast.success('Event deleted successfully!');
        await loadData();
      } catch (err) {
        console.error('Error deleting event:', err);
        toast.error(err.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  // Marks Functions
  const handleMarksChange = (studentId, value) => {
    setStudentMarks(studentMarks.map(s => {
      if (s.id === studentId) {
        const external = parseInt(value) || 0;
        return { ...s, external: value, total: s.internal + external };
      }
      return s;
    }));
  };

  const handleSaveMarks = async () => {
    if (!selectedDepartment || !selectedSemester || !selectedSubject) {
      toast.error('Please select department, semester, and subject first!');
      return;
    }
    const unmarkedStudents = studentMarks.filter(s => s.external === '');
    if (unmarkedStudents.length > 0) {
      toast.error('Please enter marks for all students!');
      return;
    }
    try {
      setSubmitting(true);
      await adminService.saveExternalMarks({
        department: selectedDepartment,
        semester: selectedSemester,
        subject: selectedSubject,
        marks: studentMarks
      });
      toast.success('Marks saved successfully!');
    } catch (err) {
      console.error('Error saving marks:', err);
      toast.error(err.response?.data?.message || 'Failed to save marks');
    } finally {
      setSubmitting(false);
    }
  };

  // Bulk Upload Functions
  const handleDownloadMarksTemplate = () => {
    const csvContent = `Roll No,Student Name,Internal Marks,External Marks
CSE2022001,Rahul Sharma,35,
CSE2022002,Priya Patel,38,
CSE2022003,Amit Kumar,32,
CSE2022004,Neha Gupta,40,
CSE2022005,Vikram Singh,28,`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks_template_${selectedDepartment}_${selectedSemester}_${selectedSubject}.csv`.replace(/\s+/g, '_');
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkUploadFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBulkUploadFile(file);
    }
  };

  const handleBulkUploadSubmit = async () => {
    if (!bulkUploadFile) {
      toast.error('Please select a file to upload!');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', bulkUploadFile);
      formData.append('department', selectedDepartment);
      formData.append('semester', selectedSemester);
      formData.append('subject', selectedSubject);

      const result = await adminService.bulkUploadMarks(formData);

      // Update student marks with uploaded data
      if (result.marks) {
        setStudentMarks(result.marks);
      }

      setShowBulkUploadModal(false);
      setBulkUploadFile(null);
      toast.success('Marks uploaded successfully! Please verify and save.');
    } catch (err) {
      console.error('Error uploading marks:', err);
      toast.error(err.response?.data?.message || 'Failed to upload marks');
    } finally {
      setIsUploading(false);
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'exam': return 'red';
      case 'holiday': return 'green';
      case 'academic': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'upcoming': return 'blue';
      case 'completed': return 'gray';
      default: return 'gray';
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calendar Grid Component
  const CalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-100"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = new Date().getDate() === day &&
                      new Date().getMonth() === currentMonth &&
                      new Date().getFullYear() === currentYear;

      days.push(
        <div
          key={day}
          className={`h-24 p-1 border border-gray-100 overflow-hidden ${isToday ? 'bg-indigo-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer
                  ${event.type === 'exam' ? 'bg-red-100 text-red-700' : ''}
                  ${event.type === 'holiday' ? 'bg-green-100 text-green-700' : ''}
                  ${event.type === 'academic' ? 'bg-blue-100 text-blue-700' : ''}
                `}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 px-1">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days}
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-gray-600">Exam</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-gray-600">Holiday</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-gray-600">Academic</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading academic management data..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadData} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Academic Management</h1>
        <p className="text-indigo-100">Manage semesters, academic calendar, and external marks</p>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('semesters')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'semesters'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Semesters
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Academic Calendar
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'marks'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Upload className="w-4 h-4 mr-2" />
            External Marks
          </button>
        </div>
      </div>

      {/* Semesters Tab */}
      {activeTab === 'semesters' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Semesters</p>
                  <p className="text-3xl font-bold text-gray-900">{semesters.length}</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-gray-900">{semesters.filter(s => s.status === 'active').length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900">{semesters.filter(s => s.status === 'upcoming').length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{semesters.filter(s => s.status === 'completed').length}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Semesters Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Academic Years & Semesters</h2>
              <button
                onClick={() => setShowSemesterModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Semester
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Academic Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {semesters.map((semester) => (
                    <tr key={semester.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{semester.academicYear}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{semester.semester}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(semester.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(semester.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(semester.status)}-100 text-${getStatusColor(semester.status)}-700 capitalize`}>
                          {semester.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditSemester(semester)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSemester(semester.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">{events.length}</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Exams</p>
                  <p className="text-3xl font-bold text-gray-900">{events.filter(e => e.type === 'exam').length}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Holidays</p>
                  <p className="text-3xl font-bold text-gray-900">{events.filter(e => e.type === 'holiday').length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Academic</p>
                  <p className="text-3xl font-bold text-gray-900">{events.filter(e => e.type === 'academic').length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search, View Toggle, Google Calendar, and Add */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setCalendarViewMode('calendar')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      calendarViewMode === 'calendar'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="w-4 h-4 mr-1" />
                    Calendar
                  </button>
                  <button
                    onClick={() => setCalendarViewMode('list')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      calendarViewMode === 'list'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="w-4 h-4 mr-1" />
                    List
                  </button>
                </div>

                {/* Google Calendar Sync */}
                <button
                  onClick={handleGoogleCalendarSync}
                  disabled={isSyncing}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isGoogleCalendarConnected
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing
                    ? 'Syncing...'
                    : isGoogleCalendarConnected
                      ? 'Sync Calendar'
                      : 'Connect Google Calendar'
                  }
                </button>

                <button
                  onClick={() => setShowEventModal(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </button>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          {calendarViewMode === 'calendar' && <CalendarGrid />}

          {/* List View (Events Table) */}
          {calendarViewMode === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getEventTypeColor(event.type)}-100 text-${getEventTypeColor(event.type)}-700 capitalize`}>
                            {event.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(event.endDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{event.description}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => openEditEvent(event)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* External Marks Tab */}
      {activeTab === 'marks' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Selection Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-indigo-600" />
              Select Class Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedSubject('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Semester</option>
                  {semesterOptions.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={!selectedDepartment}
                >
                  <option value="">Select Subject</option>
                  {selectedDepartment && subjects[selectedDepartment]?.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Marks Entry Table */}
          {selectedDepartment && selectedSemester && selectedSubject && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Enter External Marks</h2>
                  <p className="text-sm text-gray-500">{selectedDepartment} - {selectedSemester} - {selectedSubject}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownloadMarksTemplate}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </button>
                  <button
                    onClick={() => setShowBulkUploadModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Upload
                  </button>
                  <button
                    onClick={handleSaveMarks}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Marks
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Internal (40)</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">External (60)</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total (100)</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {studentMarks.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-900">{student.rollNo}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">{student.internal}</td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={student.external}
                            onChange={(e) => handleMarksChange(student.id, e.target.value)}
                            className="w-20 px-3 py-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                          {student.total || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {student.external !== '' ? (
                            student.total >= 40 ? (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Pass
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                Fail
                              </span>
                            )
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Note: Maximum marks for external examination is 60. Minimum 40% required to pass.
                </p>
              </div>
            </div>
          )}

          {(!selectedDepartment || !selectedSemester || !selectedSubject) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select Class Details</h3>
              <p className="text-gray-500">Please select department, semester, and subject to upload external marks.</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Add/Edit Semester Modal */}
      <AnimatePresence>
        {showSemesterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {editingSemester ? 'Edit Semester' : 'Add New Semester'}
                  </h2>
                  <button onClick={() => {
                    setShowSemesterModal(false);
                    setEditingSemester(null);
                    setSemesterForm({ academicYear: '', semester: '', startDate: '', endDate: '', status: 'upcoming' });
                  }} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddSemester} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 2024-25"
                      value={semesterForm.academicYear}
                      onChange={(e) => setSemesterForm({ ...semesterForm, academicYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                    <select
                      required
                      value={semesterForm.semester}
                      onChange={(e) => setSemesterForm({ ...semesterForm, semester: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="Odd">Odd Semester</option>
                      <option value="Even">Even Semester</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={semesterForm.startDate}
                      onChange={(e) => setSemesterForm({ ...semesterForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={semesterForm.endDate}
                      onChange={(e) => setSemesterForm({ ...semesterForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      required
                      value={semesterForm.status}
                      onChange={(e) => setSemesterForm({ ...semesterForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSemesterModal(false);
                      setEditingSemester(null);
                      setSemesterForm({ academicYear: '', semester: '', startDate: '', endDate: '', status: 'upcoming' });
                    }}
                    disabled={submitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : (editingSemester ? 'Save Changes' : 'Add Semester')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </h2>
                  <button onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                    setEventForm({ title: '', date: '', endDate: '', type: 'academic', description: '' });
                  }} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddEvent} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={eventForm.endDate}
                      onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <select
                    required
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Exam</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEvent(null);
                      setEventForm({ title: '', date: '', endDate: '', type: 'academic', description: '' });
                    }}
                    disabled={submitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : (editingEvent ? 'Save Changes' : 'Add Event')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showBulkUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Bulk Upload Marks</h2>
                  <button
                    onClick={() => {
                      setShowBulkUploadModal(false);
                      setBulkUploadFile(null);
                    }}
                    className="text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Instructions:</h3>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Download the marks template CSV file</li>
                    <li>Fill in the external marks for each student</li>
                    <li>Upload the completed CSV file</li>
                    <li>Review and save the marks</li>
                  </ol>
                </div>

                {/* Download Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Step 1: Download Template</label>
                  <button
                    onClick={handleDownloadMarksTemplate}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Marks Template
                  </button>
                </div>

                {/* Upload File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Step 2: Upload Filled CSV</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleBulkUploadFile}
                      className="hidden"
                      id="bulk-upload-file"
                    />
                    <label htmlFor="bulk-upload-file" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {bulkUploadFile ? (
                          <span className="text-indigo-600 font-medium">{bulkUploadFile.name}</span>
                        ) : (
                          <>
                            <span className="text-indigo-600 font-medium">Click to upload</span> or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">CSV files only</p>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBulkUploadModal(false);
                      setBulkUploadFile(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkUploadSubmit}
                    disabled={!bulkUploadFile || isUploading}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      bulkUploadFile && !isUploading
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Marks
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademicManagement;
