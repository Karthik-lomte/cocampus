import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { timetable, getTodaySchedule } from '../data/timetableData';

const Timetable = () => {
  const today = getTodaySchedule();
  const days = Object.keys(timetable);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Timetable</h1>
        <p className="text-gray-600 mt-1">Your weekly class schedule</p>
      </div>

      {/* Today's Schedule Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Today's Schedule - {today.day}</h2>
        <div className="space-y-2">
          {today.classes.filter(c => c.type !== 'Break').map((classItem, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-lg rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">{classItem.subject}</p>
                <p className="text-sm text-blue-100">{classItem.faculty}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{classItem.time}</p>
                <p className="text-sm text-blue-100">{classItem.room}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Timetable */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Time</th>
                {days.map(day => (
                  <th key={day} className={`px-6 py-4 text-left text-sm font-bold ${
                    day === today.day ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 'Lunch', 4, 5].map((period) => (
                <tr key={period} className="border-t border-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {period === 'Lunch' ? '12:00 - 01:00' :
                     period === 1 ? '09:00 - 09:50' :
                     period === 2 ? '10:00 - 10:50' :
                     period === 3 ? '11:00 - 11:50' :
                     period === 4 ? '01:00 - 01:50' :
                     '02:00 - 02:50'}
                  </td>
                  {days.map(day => {
                    const classItem = timetable[day].find(c => c.period === period);
                    if (!classItem) return <td key={day} className="px-6 py-4"></td>;

                    return (
                      <td key={day} className="px-6 py-4">
                        {classItem.type === 'Break' ? (
                          <div className="bg-gray-100 rounded-lg p-3 text-center">
                            <p className="text-sm font-medium text-gray-600">Lunch Break</p>
                          </div>
                        ) : (
                          <div className={`rounded-lg p-3 ${
                            classItem.type === 'Lab' ? 'bg-purple-50 border border-purple-200' :
                            classItem.type === 'Lecture' ? 'bg-blue-50 border border-blue-200' :
                            'bg-green-50 border border-green-200'
                          }`}>
                            <p className="text-sm font-semibold text-gray-900">{classItem.subject}</p>
                            <p className="text-xs text-gray-600 mt-1">{classItem.room}</p>
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

        {/* Mobile Day-by-Day View */}
        <div className="lg:hidden">
          {days.map((day, dayIndex) => (
            <div key={day} className={`border-b border-gray-200 last:border-0 ${day === today.day ? 'bg-blue-50' : ''}`}>
              <div className={`p-4 font-bold ${day === today.day ? 'text-blue-600' : 'text-gray-900'}`}>
                {day}
                {day === today.day && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Today</span>}
              </div>
              <div className="px-4 pb-4 space-y-2">
                {timetable[day].map((classItem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {classItem.type === 'Break' ? (
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <p className="text-sm font-medium text-gray-600">🍽️ {classItem.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">{classItem.time}</p>
                      </div>
                    ) : (
                      <div className={`rounded-lg p-3 ${
                        classItem.type === 'Lab' ? 'bg-purple-50 border-2 border-purple-300' :
                        classItem.type === 'Lecture' ? 'bg-blue-50 border-2 border-blue-300' :
                        'bg-green-50 border-2 border-green-300'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{classItem.subject}</p>
                            <p className="text-sm text-gray-600 mt-1">{classItem.faculty}</p>
                            <p className="text-xs text-gray-500 mt-1">📍 {classItem.room}</p>
                          </div>
                          <div className="text-right ml-2">
                            <p className="text-xs font-medium text-gray-500">{classItem.time}</p>
                            <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                              classItem.type === 'Lab' ? 'bg-purple-200 text-purple-800' :
                              classItem.type === 'Lecture' ? 'bg-blue-200 text-blue-800' :
                              'bg-green-200 text-green-800'
                            }`}>
                              {classItem.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
