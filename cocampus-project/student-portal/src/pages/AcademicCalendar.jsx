import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Grid, List, X } from 'lucide-react';
import { studentService } from '../services/studentService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function AcademicCalendar() {
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('month');

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAcademicCalendar();
      setCalendarData(data);
    } catch (err) {
      console.error('Calendar error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading calendar..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadCalendar} fullScreen />;

  const events = calendarData?.events || [];
  const categories = calendarData?.categories || [
    { value: 'all', name: 'All Events', color: '#3B82F6' },
    { value: 'exam', name: 'Exams', color: '#EF4444' },
    { value: 'holiday', name: 'Holidays', color: '#10B981' },
    { value: 'event', name: 'Events', color: '#F59E0B' }
  ];

  const getEventsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return events.filter(event => {
      const eventStart = new Date(event.startDate || event.start);
      const eventEnd = new Date(event.endDate || event.end);
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      return (
        (eventStart >= monthStart && eventStart <= monthEnd) ||
        (eventEnd >= monthStart && eventEnd <= monthEnd) ||
        (eventStart <= monthStart && eventEnd >= monthEnd)
      );
    }).filter(event =>
      selectedCategory === 'all' || event.category === selectedCategory
    );
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      const dayEvents = getEventsForMonth().filter(event => {
        const eventStart = new Date(event.startDate || event.start);
        const eventEnd = new Date(event.endDate || event.end);
        return date >= eventStart && date <= eventEnd;
      });

      days.push({ day, date: date.toISOString().split('T')[0], events: dayEvents });
    }

    return days;
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredEvents = getEventsForMonth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Calendar</h1>
        <p className="text-gray-600">View all academic events, exams, and important dates</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView('month')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid size={18} />
              <span className="hidden md:inline">Month</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List size={18} />
              <span className="hidden md:inline">List</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.value
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedCategory === category.value ? category.color : undefined
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </motion.div>

      {view === 'month' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {generateCalendarDays().map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`min-h-[100px] p-2 border border-gray-200 ${
                  day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                } transition-colors`}
              >
                {day && (
                  <>
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {day.day}
                    </div>
                    <div className="space-y-1">
                      {day.events.slice(0, 2).map((event, i) => {
                        const categoryObj = categories.find(c => c.value === event.category);
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedEvent(event)}
                            className="w-full text-left text-xs p-1 rounded truncate hover:shadow-md transition-shadow"
                            style={{ backgroundColor: categoryObj?.color || '#3B82F6', color: 'white' }}
                          >
                            {event.title || event.name}
                          </button>
                        );
                      })}
                      {day.events.length > 2 && (
                        <div className="text-xs text-gray-500 pl-1">
                          +{day.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {view === 'list' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No events found for this month</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredEvents.sort((a, b) => new Date(a.startDate || a.start) - new Date(b.startDate || b.start)).map((event, index) => {
                const categoryObj = categories.find(c => c.value === event.category);
                return (
                  <motion.div
                    key={event._id || event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: categoryObj?.color || '#3B82F6' }}
                      >
                        <div className="text-xs font-medium">
                          {new Date(event.startDate || event.start).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-2xl font-bold">
                          {new Date(event.startDate || event.start).getDate()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{event.title || event.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded capitalize">
                            {event.category}
                          </span>
                          <span>
                            {new Date(event.startDate || event.start).toLocaleDateString()} - {new Date(event.endDate || event.end).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="p-6 text-white"
                style={{ backgroundColor: categories.find(c => c.value === selectedEvent.category)?.color || '#3B82F6' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm opacity-90 mb-1 capitalize">{selectedEvent.category}</div>
                    <h2 className="text-2xl font-bold">{selectedEvent.title || selectedEvent.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-500 mb-1">Description</div>
                    <p className="text-gray-900">{selectedEvent.description}</p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-500 mb-1">Duration</div>
                    <p className="text-gray-900">
                      {new Date(selectedEvent.startDate || selectedEvent.start).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {(selectedEvent.startDate || selectedEvent.start) !== (selectedEvent.endDate || selectedEvent.end) && (
                        <> to {new Date(selectedEvent.endDate || selectedEvent.end).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AcademicCalendar;
