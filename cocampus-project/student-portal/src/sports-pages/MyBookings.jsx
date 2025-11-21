import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      facility: 'Badminton Court 3',
      icon: '🏸',
      date: '2024-11-22',
      time: '10:00 AM - 11:00 AM',
      duration: '1 hour',
      amount: 400,
      status: 'confirmed',
      paymentStatus: 'paid',
      location: 'Indoor Complex, 1st Floor',
      bookingDate: '2024-11-18'
    },
    {
      id: 'BK002',
      facility: 'Table Tennis',
      icon: '🏓',
      date: '2024-11-24',
      time: '4:00 PM - 5:00 PM',
      duration: '1 hour',
      amount: 200,
      status: 'pending',
      paymentStatus: 'unpaid',
      location: 'Indoor Complex, Ground Floor',
      bookingDate: '2024-11-19'
    },
    {
      id: 'BK003',
      facility: 'Cricket Stadium',
      icon: '🏏',
      date: '2024-11-15',
      time: '6:00 AM - 9:00 AM',
      duration: '3 hours',
      amount: 15000,
      status: 'completed',
      paymentStatus: 'paid',
      location: 'Sports Complex, Ground Floor',
      bookingDate: '2024-11-10'
    },
    {
      id: 'BK004',
      facility: 'Volleyball Court',
      icon: '🏐',
      date: '2024-11-12',
      time: '5:00 PM - 7:00 PM',
      duration: '2 hours',
      amount: 1600,
      status: 'cancelled',
      paymentStatus: 'refunded',
      location: 'Outdoor Sports Area',
      bookingDate: '2024-11-08',
      cancelReason: 'Weather conditions'
    }
  ]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = bookings.filter(booking =>
    statusFilter === 'all' || booking.status === statusFilter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'cancelled', paymentStatus: 'refund_pending' } : booking
      ));
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: 'cancelled', paymentStatus: 'refund_pending' });
      }
      alert('Booking cancelled. Refund will be processed within 3-5 business days.');
    }
  };

  const bookingStats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">View and manage your facility bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-100 text-center">
          <p className="text-2xl font-bold text-green-600">{bookingStats.confirmed}</p>
          <p className="text-sm text-gray-600">Confirmed</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 text-center">
          <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 text-center">
          <p className="text-2xl font-bold text-blue-600">{bookingStats.completed}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
          <p className="text-2xl font-bold text-red-600">{bookingStats.cancelled}</p>
          <p className="text-sm text-gray-600">Cancelled</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Bookings</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{booking.icon}</div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{booking.facility}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-4 gap-y-1">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {booking.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {booking.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Booking ID: {booking.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{booking.amount.toLocaleString()}</p>
                  <p className={`text-xs ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus === 'refunded' ? 'Refunded' : 'Unpaid'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                >
                  View
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bookings found</p>
        </div>
      )}

      {/* Booking Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                  <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <span className="text-3xl">{selectedBooking.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedBooking.facility}</p>
                    <p className="text-sm text-gray-600">{selectedBooking.location}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-medium">{selectedBooking.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{selectedBooking.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{selectedBooking.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{selectedBooking.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment</span>
                    <span className={`font-medium ${selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedBooking.paymentStatus === 'paid' ? 'Paid' : selectedBooking.paymentStatus === 'refunded' ? 'Refunded' : 'Unpaid'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booked On</span>
                    <span className="font-medium">{selectedBooking.bookingDate}</span>
                  </div>
                </div>

                {selectedBooking.cancelReason && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Cancel Reason:</strong> {selectedBooking.cancelReason}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total Amount</span>
                    <span className="text-xl font-bold text-emerald-600">₹{selectedBooking.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 space-y-3">
                {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'pending') && (
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
