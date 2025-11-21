import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  BookOpen,
  Coins,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Bell
} from 'lucide-react';
import { studentService } from '../services/studentService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const getGreeting = (name) => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good Morning, ${name}!`;
  if (hour < 18) return `Good Afternoon, ${name}!`;
  return `Good Evening, ${name}!`;
};

const Dashboard = () => {
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
      const data = await studentService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading dashboard..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadDashboard} fullScreen />;
  if (!dashboardData) return null;

  const {
    student,
    attendance,
    pendingAssignments = [],
    urgentAssignments = [],
    wallet,
    recentTransactions = [],
    currentClass,
    recentNotices = []
  } = dashboardData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

        <div className="relative z-10">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl lg:text-4xl font-bold mb-2"
          >
            {getGreeting(student.name?.split(' ')[0] || 'Student')}
          </motion.h1>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-100 text-lg"
          >
            Roll No: {student.rollNumber || student.email} | {student.department?.name || 'N/A'} | Semester {student.semester || 'N/A'}
          </motion.p>

          {currentClass && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white/20 backdrop-blur-lg rounded-xl p-4 inline-flex items-center space-x-3"
            >
              <Clock className="text-yellow-300" size={24} />
              <div>
                <p className="text-sm text-blue-100">Next Class</p>
                <p className="font-semibold">{currentClass.subject} at {currentClass.time.split(' - ')[0]} in {currentClass.room}</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Attendance Card */}
        <motion.div variants={itemVariants}>
          <Link to="/student/attendance">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${attendance?.overall >= 75 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Calendar className={attendance?.overall >= 75 ? 'text-green-600' : 'text-red-600'} size={24} />
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Attendance</h3>
              <p className={`text-3xl font-bold ${attendance?.overall >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                {attendance?.overall || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {attendance?.overall >= 75 ? '✓ Above requirement' : '⚠ Below requirement'}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Pending Assignments */}
        <motion.div variants={itemVariants}>
          <Link to="/student/assignments">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BookOpen className="text-purple-600" size={24} />
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Assignments</h3>
              <p className="text-3xl font-bold text-purple-600">{pendingAssignments?.length || 0}</p>
              <p className="text-xs text-gray-500 mt-2">
                {urgentAssignments?.length || 0} urgent
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Campus Coins */}
        <motion.div variants={itemVariants}>
          <Link to="/student/campus-coins">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Coins className="text-amber-600" size={24} />
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Campus Coins</h3>
              <p className="text-3xl font-bold text-amber-600">₹{wallet?.balance || 0}</p>
              <p className="text-xs text-gray-500 mt-2">
                Available balance
              </p>
            </div>
          </Link>
        </motion.div>

        {/* CGPA */}
        <motion.div variants={itemVariants}>
          <Link to="/student/results">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Award className="text-blue-600" size={24} />
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">CGPA</h3>
              <p className="text-3xl font-bold text-blue-600">{student.cgpa || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-2">
                Current semester: {student.currentSemesterGPA || 'N/A'}
              </p>
            </div>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Assignments List */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <BookOpen className="mr-2 text-purple-500" size={24} />
                  Pending Assignments
                </h2>
                <Link to="/student/assignments" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingAssignments?.slice(0, 5).map((assignment, index) => {
                const dueDate = new Date(assignment.dueDate);
                const isUrgent = urgentAssignments?.some(a => a._id === assignment._id);

                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {isUrgent && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                              Urgent
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {assignment.subject?.code || assignment.subjectCode}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">Subject: {assignment.subject?.name || assignment.subject}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {(!pendingAssignments || pendingAssignments.length === 0) && (
                <div className="p-8 text-center">
                  <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
                  <p className="text-gray-500">All assignments completed!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Recent Campus Coins Transactions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Coins className="mr-2 text-amber-500" size={24} />
                Recent Transactions
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentTransactions?.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`text-sm font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Bell className="mr-2 text-red-500" size={20} />
                  Recent Notices
                </h2>
                <Link to="/student/notices" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentNotices?.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-2">
                    <div className={`mt-1 w-2 h-2 rounded-full ${notice.priority === 'high' ? 'bg-red-500' : notice.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notice.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notice.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
