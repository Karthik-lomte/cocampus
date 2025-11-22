import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { sportsService } from '../services/sportsService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const SportsDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard Data
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    facilitiesAvailable: 0
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [featuredFacilities, setFeaturedFacilities] = useState([]);

  // Load Dashboard Data
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sportsService.getDashboard();

      setDashboardStats({
        totalBookings: data?.totalBookings || 0,
        upcomingBookings: data?.upcomingBookings?.length || 0,
        facilitiesAvailable: data?.facilitiesAvailable || 0
      });
      setUpcomingBookings(data?.upcomingBookings || []);
      setFeaturedFacilities(data?.featuredFacilities || []);
    } catch (err) {
      console.error('Error loading sports dashboard:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading and Error Screens
  if (loading) return <Loading fullScreen message="Loading sports dashboard..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadDashboard} fullScreen />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome to Sports Booking</h1>
        <p className="text-emerald-100 mb-4">Book premium sports facilities at our campus</p>
        <button
          onClick={() => navigate('/sports/facilities')}
          className="flex items-center px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
        >
          Browse Facilities
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalBookings}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.upcomingBookings}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Facilities Available</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.facilitiesAvailable}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
            <button
              onClick={() => navigate('/sports/my-bookings')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All
            </button>
          </div>
        </div>
        {upcomingBookings?.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {upcomingBookings.map((booking) => (
              <div key={booking?.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{booking?.facility || 'Unknown Facility'}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {booking?.date || 'N/A'}
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 mr-1" />
                      {booking?.time || 'N/A'}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(booking?.status)}`}>
                    {booking?.status === 'confirmed' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertCircle className="w-3 h-3 inline mr-1" />}
                    {booking?.status || 'pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming bookings</p>
            <button
              onClick={() => navigate('/sports/book')}
              className="mt-3 text-emerald-600 font-medium hover:text-emerald-700"
            >
              Book a facility
            </button>
          </div>
        )}
      </motion.div>

      {/* Featured Facilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Featured Facilities</h2>
            <button
              onClick={() => navigate('/sports/facilities')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredFacilities?.map((facility) => (
            <button
              key={facility?.id}
              onClick={() => navigate('/sports/book')}
              className="p-4 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors text-center"
            >
              <div className="text-4xl mb-2">{facility?.image || facility?.icon || '🏅'}</div>
              <p className="font-medium text-gray-900 text-sm">{facility?.name || 'Unknown Facility'}</p>
              <p className="text-xs text-emerald-600 mt-1">₹{facility?.price || 0}/hr</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/sports/book')}
            className="p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors text-center"
          >
            <Calendar className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Book Now</span>
          </button>
          <button
            onClick={() => navigate('/sports/facilities')}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
          >
            <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">View Facilities</span>
          </button>
          <button
            onClick={() => navigate('/sports/my-bookings')}
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
          >
            <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">My Bookings</span>
          </button>
          <button
            onClick={() => navigate('/sports/profile')}
            className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-center"
          >
            <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">My Profile</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SportsDashboard;
