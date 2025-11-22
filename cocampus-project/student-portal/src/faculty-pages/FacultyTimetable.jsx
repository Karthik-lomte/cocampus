import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react';
import { facultyService } from '../services/facultyService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function FacultyTimetable() {
  const toast = useToast();
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '9:00 - 9:50',
    '10:00 - 10:50',
    '11:00 - 11:50',
    '12:00 - 12:50',
    '1:00 - 1:50',
    '2:00 - 2:50',
    '3:00 - 3:50',
    '4:00 - 4:50'
  ];

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyService.getTimetable();
      setTimetableData(data);
    } catch (err) {
      console.error('Timetable error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getClassForSlot = (day, time) => {
    if (!timetableData?.weeklySchedule) return null;
    const daySchedule = timetableData.weeklySchedule[day] || [];
    return daySchedule.find(cls => cls.time === time || `${cls.startTime} - ${cls.endTime}` === time);
  };

  const getClassColor = (type) => {
    if (type === 'Lab') return 'from-purple-500 to-pink-500';
    if (type === 'Theory') return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-teal-500';
  };

  const isToday = (day) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return day === today;
  };

  if (loading) return <Loading fullScreen message="Loading timetable..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadTimetable} fullScreen />;

  const todayClasses = timetableData?.todayClasses || [];
  const weeklySchedule = timetableData?.weeklySchedule || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <Calendar size={32} />
          <h1 className="text-3xl font-bold">My Timetable</h1>
        </div>
        <p className="text-green-100">Weekly class schedule</p>
        <p className="text-green-100 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </motion.div>

      {/* Today's Classes Quick View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
          <h2 className="text-xl font-bold text-gray-900">Today's Classes</h2>
          <p className="text-gray-600 text-sm">{todayClasses.length} classes scheduled</p>
        </div>
        <div className="p-6">
          {todayClasses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No classes scheduled for today</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todayClasses.map((cls, index) => (
                <motion.div
                  key={cls._id || cls.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r ${getClassColor(cls.type)} rounded-xl p-4 text-white`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} />
                    <span className="text-sm font-medium">{cls.time || `${cls.startTime} - ${cls.endTime}`}</span>
                  </div>
                  <h3 className="font-bold mb-1">{cls.subject || cls.subjectName}</h3>
                  <p className="text-sm opacity-90">{cls.class || cls.className}</p>
                  <div className="mt-3 pt-3 border-t border-white border-opacity-20 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {cls.room}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {cls.studentsCount || cls.studentCount || 0}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Weekly Timetable - Desktop View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden hidden lg:block"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Weekly Schedule</h2>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 w-32">
                  Time
                </th>
                {days.map(day => (
                  <th
                    key={day}
                    className={`p-3 text-center text-sm font-semibold border border-gray-200 ${
                      isToday(day)
                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, timeIndex) => (
                <tr key={time}>
                  <td className="p-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {time}
                    </div>
                  </td>
                  {days.map(day => {
                    const classInfo = getClassForSlot(day, time);
                    return (
                      <td
                        key={`${day}-${time}`}
                        className={`border border-gray-200 p-2 ${
                          isToday(day) ? 'bg-green-50' : ''
                        }`}
                      >
                        {classInfo ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: timeIndex * 0.05 }}
                            className={`bg-gradient-to-r ${getClassColor(classInfo.type)} rounded-lg p-3 text-white`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-bold text-sm">{classInfo.subject}</h4>
                              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                                {classInfo.type}
                              </span>
                            </div>
                            <p className="text-xs opacity-90 mb-2">{classInfo.subjectCode}</p>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-1">
                                <Users size={10} />
                                <span>{classInfo.class}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin size={10} />
                                <span>{classInfo.room}</span>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="h-24 flex items-center justify-center text-gray-300 text-xs">
                            Free
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Weekly Timetable - Mobile/Tablet View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:hidden space-y-4"
      >
        {days.map((day, dayIndex) => {
          const dayClasses = weeklySchedule[day] || [];
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              className={`bg-white rounded-xl shadow-md overflow-hidden ${
                isToday(day) ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div
                className={`p-4 ${
                  isToday(day)
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                <h3 className="font-bold flex items-center gap-2">
                  <Calendar size={18} />
                  {day}
                  {isToday(day) && <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Today</span>}
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {dayClasses.length > 0 ? (
                  dayClasses.map((cls, index) => (
                    <motion.div
                      key={cls.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-r ${getClassColor(cls.type)} rounded-lg p-4 text-white`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span className="text-sm font-medium">{cls.time}</span>
                        </div>
                        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                          {cls.type}
                        </span>
                      </div>
                      <h4 className="font-bold mb-1">{cls.subject}</h4>
                      <p className="text-sm opacity-90 mb-3">{cls.subjectCode}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {cls.class}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {cls.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {cls.studentsCount} students
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar size={40} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No classes scheduled</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Weekly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Weekly Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Classes',
                value: Object.values(weeklySchedule).flat().length,
                icon: BookOpen,
                color: 'blue'
              },
              {
                label: 'Theory Classes',
                value: Object.values(weeklySchedule).flat().filter(c => c.type === 'Theory').length,
                icon: BookOpen,
                color: 'cyan'
              },
              {
                label: 'Lab Sessions',
                value: Object.values(weeklySchedule).flat().filter(c => c.type === 'Lab').length,
                icon: BookOpen,
                color: 'purple'
              },
              {
                label: 'Working Days',
                value: Object.keys(weeklySchedule).length,
                icon: Calendar,
                color: 'green'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-xl"
              >
                <stat.icon className={`text-${stat.color}-600 mx-auto mb-2`} size={24} />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default FacultyTimetable;
