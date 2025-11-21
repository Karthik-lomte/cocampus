import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { studentService } from '../services/studentService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAttendance();
      setAttendanceData(data);
    } catch (err) {
      console.error('Attendance error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading attendance..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadAttendance} fullScreen />;
  if (!attendanceData) return null;

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBgColor = (percentage) => {
    if (percentage >= 85) return 'bg-green-100';
    if (percentage >= 75) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-1">Track your class attendance</p>
      </div>

      {/* Overall Attendance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-2">Overall Attendance</p>
            <p className={`text-5xl font-bold ${getAttendanceColor(attendanceData.overall || 0)}`}>
              {attendanceData.overall || 0}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Required: {attendanceData.required || 75}%
            </p>
          </div>
          <div className={`w-32 h-32 rounded-full border-8 ${
            (attendanceData.overall || 0) >= 75 ? 'border-green-500' : 'border-red-500'
          } flex items-center justify-center`}>
            {(attendanceData.overall || 0) >= 75 ? (
              <TrendingUp size={48} className="text-green-600" />
            ) : (
              <AlertTriangle size={48} className="text-red-600" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Subject-wise Attendance */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Subject-wise Attendance</h2>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Code</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Present</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Total</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Percentage</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceData.subjects?.map((subject, index) => (
                <motion.tr
                  key={subject._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{subject.name || subject.subjectName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{subject.code || subject.subjectCode}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 font-semibold">{subject.present || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-600 font-semibold">{subject.total || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-lg font-bold ${getAttendanceColor(subject.percentage || 0)}`}>
                      {subject.percentage || 0}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBgColor(subject.percentage || 0)} ${getAttendanceColor(subject.percentage || 0)}`}>
                      {(subject.percentage || 0) >= 75 ? 'Good' : 'Low'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {attendanceData.subjects?.map((subject, index) => (
            <motion.div
              key={subject._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{subject.name || subject.subjectName}</h3>
                  <p className="text-sm text-gray-600">{subject.code || subject.subjectCode}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBgColor(subject.percentage || 0)} ${getAttendanceColor(subject.percentage || 0)}`}>
                  {(subject.percentage || 0) >= 75 ? 'Good' : 'Low'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Present</p>
                  <p className="text-lg font-bold text-green-600">{subject.present || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold text-gray-600">{subject.total || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Percentage</p>
                  <p className={`text-lg font-bold ${getAttendanceColor(subject.percentage || 0)}`}>
                    {subject.percentage || 0}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {(!attendanceData.subjects || attendanceData.subjects.length === 0) && (
          <div className="p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No attendance records</h3>
            <p className="text-gray-600">Your attendance records will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
