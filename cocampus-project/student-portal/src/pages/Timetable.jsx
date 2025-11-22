import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { studentService } from '../services/studentService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Timetable = () => {
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 1);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getTimetable();
      setTimetableData(data);
    } catch (err) {
      console.error('Timetable error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading timetable..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadTimetable} fullScreen />;

  const daySchedule = timetableData?.days?.[days[selectedDay - 1]?.toLowerCase()] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
        <p className="text-gray-600 mt-1">Your class schedule for the week</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index + 1)}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedDay === index + 1
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {daySchedule.length > 0 ? (
          daySchedule.map((classItem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {classItem.subject?.name || classItem.subjectName}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>{classItem.startTime} - {classItem.endTime}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{classItem.room || 'TBA'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User size={16} className="mr-2" />
                      <span>{classItem.faculty?.name || classItem.facultyName || 'TBA'}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                  {classItem.subject?.code || classItem.subjectCode}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-gray-100">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes scheduled</h3>
            <p className="text-gray-600">You have no classes on {days[selectedDay - 1]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;
