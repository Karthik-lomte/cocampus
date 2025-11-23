import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, BarChart3, Users, Award, AlertTriangle,
  Calendar, BookOpen, Target, Filter
} from 'lucide-react';
import hodService from '../api/hodService';
import { useAuth } from '../context/AuthContext';

function PerformanceMonitoring() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('classwise');
  const [performanceData, setPerformanceData] = useState({
    classWise: [],
    subjectWise: []
  });

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await hodService.getPerformanceMetrics(user?.department);

      if (response.success && response.data) {
        setPerformanceData({
          classWise: response.data.classWise || [],
          subjectWise: response.data.subjectWise || []
        });
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'bg-green-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const totalStudents = performanceData.classWise.reduce((sum, cls) => sum + (cls.students || 0), 0);
  const totalToppers = performanceData.classWise.reduce((sum, cls) => sum + (cls.toppers || 0), 0);
  const totalNeedsAttention = performanceData.classWise.reduce((sum, cls) => sum + (cls.needsAttention || 0), 0);
  const avgPerformance = performanceData.classWise.length > 0
    ? (performanceData.classWise.reduce((sum, cls) => sum + (cls.avgPercentage || 0), 0) / performanceData.classWise.length).toFixed(1)
    : 0;

  if (loading && performanceData.classWise.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Monitoring</h1>
          <p className="text-gray-600 mt-1">
            Track and analyze student academic performance
          </p>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Users size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <p className="text-blue-100 text-sm">Total Students</p>
          <p className="text-4xl font-bold mt-2">{totalStudents}</p>
          <p className="text-sm text-blue-100 mt-1">Across {performanceData.classWise.length} classes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Award size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <p className="text-green-100 text-sm">Top Performers</p>
          <p className="text-4xl font-bold mt-2">{totalToppers}</p>
          <p className="text-sm text-green-100 mt-1">Above 85% marks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Target size={32} />
            <BarChart3 size={24} className="opacity-75" />
          </div>
          <p className="text-purple-100 text-sm">Avg Performance</p>
          <p className="text-4xl font-bold mt-2">{avgPerformance}%</p>
          <p className="text-sm text-purple-100 mt-1">Department average</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <p className="text-orange-100 text-sm">Needs Attention</p>
          <p className="text-4xl font-bold mt-2">{totalNeedsAttention}</p>
          <p className="text-sm text-orange-100 mt-1">Below 60% marks</p>
        </motion.div>
      </div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-2 flex gap-2 overflow-x-auto"
      >
        <button
          onClick={() => setViewType('classwise')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            viewType === 'classwise'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Class-wise Analysis
        </button>
        <button
          onClick={() => setViewType('subjectwise')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            viewType === 'subjectwise'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Subject-wise Analysis
        </button>
      </motion.div>

      {/* Class-wise Performance */}
      {viewType === 'classwise' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 size={24} className="text-green-600" />
              Class-wise Performance
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {performanceData.classWise.map((classData, index) => (
              <motion.div
                key={classData.class}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{classData.class}</h3>
                    <p className="text-sm text-gray-600">{classData.students} students</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getPerformanceColor(classData.avgPercentage)}`}>
                      {classData.avgPercentage}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Top Performers</p>
                    <p className="text-green-600 font-bold text-xl">{classData.toppers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Needs Attention</p>
                    <p className="text-red-600 font-bold text-xl">{classData.needsAttention}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Attendance</p>
                    <p className="text-blue-600 font-bold text-xl">{classData.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Avg Marks</p>
                    <p className="text-purple-600 font-bold text-xl">{classData.avgPercentage}%</p>
                  </div>
                </div>

                {/* Attendance Bar */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Attendance Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getAttendanceColor(classData.attendance)} transition-all`}
                      style={{ width: `${classData.attendance}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Subject-wise Performance */}
      {viewType === 'subjectwise' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen size={24} className="text-green-600" />
              Subject-wise Performance
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {performanceData.subjectWise.map((subject, index) => (
              <motion.div
                key={subject.subject}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{subject.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">Faculty: {subject.faculty}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getPerformanceColor(subject.avgMarks)}`}>
                    {subject.avgMarks}%
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Average Marks</p>
                    <p className="text-green-600 font-bold text-xl">{subject.avgMarks}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pass Percentage</p>
                    <p className="text-green-600 font-bold text-xl">{subject.passPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Top Score</p>
                    <p className="text-purple-600 font-bold text-xl">{subject.topScore}%</p>
                  </div>
                </div>

                {/* Performance Bar */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Pass Rate</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                      style={{ width: `${subject.passPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default PerformanceMonitoring;
