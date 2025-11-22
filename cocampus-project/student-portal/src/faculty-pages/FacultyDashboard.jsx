import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Edit, Briefcase, Users, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { facultyService } from '../services/facultyService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function FacultyDashboard() {
  const toast = useToast();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  if (loading) return <Loading fullScreen message="Loading dashboard..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadDashboard} fullScreen />;

  const faculty = dashboardData?.faculty || {};
  const stats = dashboardData?.stats || {};
  const todayClasses = dashboardData?.todayClasses || [];
  const assignedSubjects = dashboardData?.assignedSubjects || [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Good {getTimeOfDay()}, {faculty.name}!</h1>
        <p className="text-green-100">
          Department: {faculty.department} | Employee ID: {faculty.employeeId}
        </p>
        <p className="text-green-100 mt-1">
          You have {todayClasses.length} classes scheduled for today
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Classes Today', value: stats.classesToday || 0, icon: Calendar, color: 'blue' },
          { title: 'Pending Evaluations', value: stats.pendingEvaluations || 0, icon: Edit, color: 'purple' },
          { title: 'Leave Balance', value: stats.leaveBalance || 0, icon: Briefcase, color: 'red' },
          { title: 'Students Taught', value: stats.studentsTaught || 0, icon: Users, color: 'green' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
          <p className="text-gray-600 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="p-6 space-y-4">
          {todayClasses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No classes scheduled for today</p>
            </div>
          ) : (
            todayClasses.map((cls, index) => (
              <motion.div
                key={cls._id || cls.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex flex-col items-center justify-center text-white">
                    <Clock size={20} />
                    <span className="text-xs mt-1">{cls.time?.split(' - ')[0] || cls.startTime}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{cls.subject || cls.subjectName}</h3>
                  <p className="text-sm text-gray-600">{cls.subjectCode} • {cls.class || cls.className} • Room: {cls.room}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cls.type === 'Lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {cls.type}
                    </span>
                    <span className="text-sm text-gray-500">{cls.studentsCount || cls.studentCount || 0} students</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/faculty/attendance"
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={16} className="inline mr-1" />
                    Take Attendance
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                    <Users size={16} className="inline mr-1" />
                    View Students
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Assigned Subjects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Assigned Subjects</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignedSubjects.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No subjects assigned</p>
              </div>
            ) : (
              assignedSubjects.map((subject, index) => (
                <motion.div
                  key={subject._id || subject.code || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <BookOpen className="text-green-600" size={24} />
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {subject.credits || 3} Credits
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{subject.name || subject.subjectName}</h3>
                  <p className="text-sm text-gray-600">{subject.code || subject.subjectCode}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Classes: {Array.isArray(subject.classes) ? subject.classes.join(', ') : (subject.class || subject.className || 'N/A')}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default FacultyDashboard;
