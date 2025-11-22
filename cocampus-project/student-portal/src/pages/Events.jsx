import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Coins as CoinsIcon, CheckCircle, X, UserCircle } from 'lucide-react';
import { studentService } from '../services/studentService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Events = () => {
  const toast = useToast();
  const [eventsData, setEventsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registrationType, setRegistrationType] = useState('single');
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getEvents();
      setEventsData(data);
    } catch (err) {
      console.error('Events error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setRegistrationType('single');
    setShowRegisterModal(true);
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    try {
      setRegistering(true);
      await studentService.registerForEvent(selectedEvent._id || selectedEvent.id, {
        ...formData,
        registrationType
      });
      toast.success(`Successfully registered for ${selectedEvent.name}!`);
      setShowRegisterModal(false);
      setFormData({ fullName: '', rollNumber: '', email: '', phone: '' });
      await loadEvents();
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading events..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadEvents} fullScreen />;

  const events = eventsData?.events || [];
  const filteredEvents = filter === 'all' ? events :
                        filter === 'registered' ? events.filter(e => e.isRegistered) :
                        events.filter(e => e.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
        <p className="text-gray-600 mt-1">Explore and register for upcoming events</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'college', 'clubs', 'registered'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              filter === f
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f} Events
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event._id || event.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={event.image || 'https://via.placeholder.com/400x200'}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              {event.isRegistered && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  Registered
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {event.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="mr-2" />
                  {event.registeredCount || 0}/{event.maxCapacity} registered
                </div>
                {event.registrationFee > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CoinsIcon size={16} className="mr-2" />
                    Fee: ₹{event.registrationFee}
                  </div>
                )}
              </div>
              <button
                onClick={() => !event.isRegistered && handleRegister(event)}
                disabled={event.isRegistered}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  event.isRegistered
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {event.isRegistered ? 'Already Registered' : 'Register Now'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showRegisterModal && selectedEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !registering && setShowRegisterModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                  <div>
                    <h2 className="text-2xl font-bold">Event Registration</h2>
                    <p className="text-blue-100 text-sm mt-1">{selectedEvent.name}</p>
                  </div>
                  <button
                    onClick={() => !registering && setShowRegisterModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitRegistration} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowRegisterModal(false)}
                      disabled={registering}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={registering}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
                    >
                      {registering ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Registering...
                        </>
                      ) : (
                        selectedEvent.registrationFee > 0 ? `Pay ₹${selectedEvent.registrationFee} & Register` : 'Register'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
