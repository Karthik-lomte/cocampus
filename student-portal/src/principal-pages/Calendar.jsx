import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import principalService from '../api/principalService';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await principalService.getAcademicEvents();

      if (response.success && response.data) {
        const eventsData = response.data;

        // Transform events for calendar display
        const calendarEvents = eventsData.map(event => {
          const eventType = event.eventType || event.type || 'Academic';
          return {
            _id: event._id,
            date: event.date || event.startDate,
            title: event.title || event.name,
            type: eventType,
            color: getEventColorByType(eventType)
          };
        });

        setEvents(calendarEvents);

        // Filter upcoming events (from today onwards) and sort by date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = eventsData
          .filter(event => {
            const eventDate = new Date(event.date || event.startDate);
            return eventDate >= today;
          })
          .sort((a, b) => new Date(a.date || a.startDate) - new Date(b.date || b.startDate))
          .slice(0, 5)
          .map(event => ({
            _id: event._id,
            date: event.date || event.startDate,
            title: event.title || event.name,
            description: event.description || 'No description available',
            type: event.eventType || event.type || 'Academic',
            time: event.time || 'TBD',
            venue: event.venue || event.location || 'TBD'
          }));

        setUpcomingEvents(upcoming);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventColorByType = (type) => {
    const typeStr = (type || '').toLowerCase();
    if (typeStr.includes('sport')) return 'bg-green-500';
    if (typeStr.includes('meeting')) return 'bg-purple-500';
    if (typeStr.includes('academic') || typeStr.includes('symposium')) return 'bg-blue-500';
    if (typeStr.includes('training') || typeStr.includes('workshop')) return 'bg-orange-500';
    if (typeStr.includes('exam')) return 'bg-red-500';
    if (typeStr.includes('cultural') || typeStr.includes('fest')) return 'bg-pink-500';
    return 'bg-gray-500';
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Sports': 'bg-green-100 text-green-700 border-green-200',
      'Meeting': 'bg-purple-100 text-purple-700 border-purple-200',
      'Academic': 'bg-blue-100 text-blue-700 border-blue-200',
      'Training': 'bg-orange-100 text-orange-700 border-orange-200',
      'Exam': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const hasEvent = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      const eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
      return eventDateStr === dateStr;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-20 bg-gray-50 border border-gray-200"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const event = hasEvent(day);
    const isToday = day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

    calendarDays.push(
      <div
        key={day}
        className={`h-20 border border-gray-200 p-2 ${isToday ? 'bg-purple-50 border-purple-300' : 'bg-white hover:bg-gray-50'} transition-colors cursor-pointer`}
      >
        <div className={`text-sm font-semibold ${isToday ? 'text-purple-600' : 'text-gray-700'}`}>{day}</div>
        {event && (
          <div className={`mt-1 ${event.color} text-white text-xs px-1 py-0.5 rounded truncate`}>
            {event.title}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Academic Calendar</h1>
        <p className="text-gray-600 mt-1">View institutional events and schedules</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <CalendarIcon className="mr-2 text-purple-600" size={24} />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-700 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0">
              {calendarDays}
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="font-bold text-gray-900 mb-4">Event Types</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-700">Sports Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-700">Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-700">Academic Events</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-700">Training</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Examinations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 rounded"></div>
              <span className="text-sm text-gray-700">Cultural Events</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {upcomingEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No upcoming events scheduled
            </div>
          ) : (
            upcomingEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div className="text-gray-600">
                      <CalendarIcon size={16} className="inline mr-2" />
                      <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="text-gray-600">
                      <strong>Time:</strong> {event.time}
                    </div>
                    <div className="text-gray-600">
                      <strong>Venue:</strong> {event.venue}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )))}
        </div>
      </motion.div>
    </div>
  );
}

export default Calendar;
