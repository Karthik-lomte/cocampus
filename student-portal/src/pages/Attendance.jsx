import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { attendanceData, getAttendanceColor } from '../data/attendanceData';

const Attendance = () => {
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
            <p className={`text-5xl font-bold ${
              attendanceData.overall >= 85 ? 'text-green-600' :
              attendanceData.overall >= 75 ? 'text-orange-600' :
              'text-red-600'
            }`}>
              {attendanceData.overall}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Required: {attendanceData.required}%
            </p>
          </div>
          <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
            <TrendingUp size={48} className="text-green-600" />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attended</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.subjects.map((subject, index) => (
                <motion.tr
                  key={subject.subjectCode}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{subject.subjectName}</div>
                    <div className="text-sm text-gray-500">{subject.faculty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {subject.subjectCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {subject.totalClasses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {subject.attended}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(subject.status)}`}>
                      {subject.percentage}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {attendanceData.subjects.map((subject, index) => (
            <motion.div
              key={subject.subjectCode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{subject.subjectName}</h3>
                  <p className="text-sm text-gray-500 mb-1">{subject.faculty}</p>
                  <p className="text-xs text-gray-400">{subject.subjectCode}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getAttendanceColor(subject.status)}`}>
                  {subject.percentage}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Total Classes</p>
                  <p className="text-lg font-bold text-gray-900">{subject.totalClasses}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Attended</p>
                  <p className="text-lg font-bold text-gray-900">{subject.attended}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
