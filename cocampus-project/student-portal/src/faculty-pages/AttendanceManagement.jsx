import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Save, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { facultyService } from '../services/facultyService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function AttendanceManagement() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sessionType, setSessionType] = useState('Regular');
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    loadSessionData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedClass]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyService.getSessions();
      setSessionData(data);
    } catch (err) {
      console.error('Session data error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      const data = await facultyService.getStudents({ class: selectedClass });
      setStudents(data.students || data || []);
      setAttendance({});
    } catch (err) {
      console.error('Students error:', err);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const classes = sessionData?.classes || [];
  const subjects = sessionData?.subjects || [];

  const handleAttendanceChange = (rollNo, status) => {
    setAttendance(prev => ({
      ...prev,
      [rollNo]: status
    }));
  };

  const handleMarkAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.rollNo || student.rollNumber] = 'present';
    });
    setAttendance(allPresent);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select class and subject');
      return;
    }

    const markedCount = Object.keys(attendance).length;
    if (markedCount === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    try {
      setSaving(true);

      // Create attendance session
      const sessionResponse = await facultyService.createSession({
        date: selectedDate,
        class: selectedClass,
        subject: selectedSubject,
        sessionType,
        studentsPresent: students.length
      });

      // Mark attendance for each student
      const attendanceData = {
        attendance: Object.entries(attendance).map(([rollNo, status]) => ({
          rollNo,
          status
        }))
      };

      await facultyService.markAttendance(sessionResponse._id || sessionResponse.id, attendanceData);

      toast.success(`Attendance saved successfully for ${selectedClass} - ${selectedSubject}`);
      setAttendance({});
      setSelectedClass('');
      setSelectedSubject('');
    } catch (err) {
      console.error('Save attendance error:', err);
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 65) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) return <Loading fullScreen message="Loading attendance management..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadSessionData} fullScreen />;

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
              {subjects.map(subject => (
                <option key={subject._id || subject.code} value={subject.code || subject.subjectCode}>
                  {subject.name || subject.subjectName} ({subject.code || subject.subjectCode})
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
                  disabled={saving || loadingStudents}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            {loadingStudents ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No students found for this class</p>
              </div>
            ) : (
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
                  {students.map((student, index) => {
                    const rollNo = student.rollNo || student.rollNumber;
                    const studentName = student.name || student.studentName;
                    const studentPhoto = student.photo || student.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&size=40&background=059669&color=fff&bold=true`;
                    const attendancePercentage = student.attendance || student.attendancePercentage || 0;

                    return (
                      <motion.tr
                        key={rollNo || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{rollNo}</td>
                        <td className="px-6 py-4">
                          <img src={studentPhoto} alt={studentName} className="w-10 h-10 rounded-full" />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{studentName}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${getAttendanceColor(attendancePercentage)}`}>
                            {attendancePercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAttendanceChange(rollNo, 'present')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                attendance[rollNo] === 'present'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                              }`}
                            >
                              <CheckCircle size={16} className="inline mr-1" />
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(rollNo, 'absent')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                attendance[rollNo] === 'absent'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                              }`}
                            >
                              <XCircle size={16} className="inline mr-1" />
                              Absent
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(rollNo, 'late')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                attendance[rollNo] === 'late'
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
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {loadingStudents ? (
              <div className="p-8 text-center">
                <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No students found for this class</p>
              </div>
            ) : (
              students.map((student, index) => {
                const rollNo = student.rollNo || student.rollNumber;
                const studentName = student.name || student.studentName;
                const studentPhoto = student.photo || student.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&size=48&background=059669&color=fff&bold=true`;
                const attendancePercentage = student.attendance || student.attendancePercentage || 0;

                return (
                  <motion.div
                    key={rollNo || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img src={studentPhoto} alt={studentName} className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{studentName}</h3>
                        <p className="text-sm text-gray-600">{rollNo}</p>
                        <p className={`text-sm font-semibold ${getAttendanceColor(attendancePercentage)}`}>
                          Attendance: {attendancePercentage}%
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAttendanceChange(rollNo, 'present')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          attendance[rollNo] === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        P
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(rollNo, 'absent')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          attendance[rollNo] === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(rollNo, 'late')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          attendance[rollNo] === 'late'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        L
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AttendanceManagement;
