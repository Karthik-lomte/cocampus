import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Save, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { facultyData } from '../faculty-data/facultyData';
import { studentsData } from '../faculty-data/studentsData';

function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sessionType, setSessionType] = useState('Regular');
  const [attendance, setAttendance] = useState({});

  const classes = ['CSE-3A', 'CSE-3B', 'CSE-4A'];
  const students = selectedClass ? (studentsData[selectedClass] || []) : [];

  const handleAttendanceChange = (rollNo, status) => {
    setAttendance(prev => ({
      ...prev,
      [rollNo]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.rollNo] = 'present';
    });
    setAttendance(allPresent);
  };

  const handleSaveAttendance = () => {
    if (!selectedClass || !selectedSubject) {
      alert('Please select class and subject');
      return;
    }
    alert(`Attendance saved successfully for ${selectedClass} - ${selectedSubject}`);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 65) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-600 mt-1">Mark attendance for your classes</p>
      </motion.div>

      {/* Class Selection Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Class Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class & Section</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setAttendance({});
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Subject</option>
              {facultyData.assignedSubjects.map(subject => (
                <option key={subject.code} value={subject.code}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Regular</option>
              <option>Extra Class</option>
              <option>Substitution</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Student List */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Student List - {selectedClass}</h2>
                <p className="text-sm text-gray-600">Total Students: {students.length}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleMarkAllPresent}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Users size={20} />
                  Mark All Present
                </button>
                <button
                  onClick={handleSaveAttendance}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <Save size={20} />
                  Save Attendance
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <motion.tr
                    key={student.rollNo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.rollNo}</td>
                    <td className="px-6 py-4">
                      <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${getAttendanceColor(student.attendance)}`}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAttendanceChange(student.rollNo, 'present')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            attendance[student.rollNo] === 'present'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                          }`}
                        >
                          <CheckCircle size={16} className="inline mr-1" />
                          Present
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.rollNo, 'absent')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            attendance[student.rollNo] === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                          }`}
                        >
                          <XCircle size={16} className="inline mr-1" />
                          Absent
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.rollNo, 'late')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            attendance[student.rollNo] === 'late'
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                          }`}
                        >
                          <Clock size={16} className="inline mr-1" />
                          Late
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {students.map((student, index) => (
              <motion.div
                key={student.rollNo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.rollNo}</p>
                    <p className={`text-sm font-semibold ${getAttendanceColor(student.attendance)}`}>
                      Attendance: {student.attendance}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAttendanceChange(student.rollNo, 'present')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      attendance[student.rollNo] === 'present'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    P
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student.rollNo, 'absent')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      attendance[student.rollNo] === 'absent'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(student.rollNo, 'late')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      attendance[student.rollNo] === 'late'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    L
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AttendanceManagement;
