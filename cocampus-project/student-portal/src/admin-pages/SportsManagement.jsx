import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  MapPin,
  Users,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
  Eye,
  IndianRupee,
  Activity,
  Timer
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const SportsManagement = () => {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Facilities State
  const [facilities, setFacilities] = useState([]);

  // Bookings State
  const [bookings, setBookings] = useState([]);

  // UI State
  const [activeView, setActiveView] = useState('facilities');
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals State
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Form Data
  const [facilityForm, setFacilityForm] = useState({
    name: '', location: '', capacity: '', pricePerHour: '', status: 'available', type: 'indoor'
  });

  // Load Data from Backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [facilitiesData, bookingsData] = await Promise.all([
        adminService.getSportsFacilities(),
        adminService.getSportsBookings()
      ]);
      setFacilities(facilitiesData.facilities || facilitiesData || []);
      setBookings(bookingsData.bookings || bookingsData || []);
    } catch (err) {
      console.error('Error loading sports data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Stats
  const totalRevenue = bookings
    .filter(b => b.status === 'approved')
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingApprovals = bookings.filter(b => b.status === 'pending').length;
  const totalBookings = bookings.filter(b => b.status === 'approved').length;

  // Facility Functions
  const handleAddFacility = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const facilityData = {
        name: facilityForm.name,
        location: facilityForm.location,
        capacity: parseInt(facilityForm.capacity),
        pricePerHour: parseInt(facilityForm.pricePerHour),
        status: facilityForm.status,
        type: facilityForm.type
      };

      if (editingFacility) {
        await adminService.updateFacility(editingFacility.id, facilityData);
        toast.success('Facility updated successfully!');
      } else {
        await adminService.createFacility(facilityData);
        toast.success('Facility added successfully!');
      }

      await loadData();
      setShowFacilityModal(false);
      setEditingFacility(null);
      setFacilityForm({ name: '', location: '', capacity: '', pricePerHour: '', status: 'available', type: 'indoor' });
    } catch (err) {
      console.error('Error saving facility:', err);
      toast.error(err.response?.data?.message || 'Failed to save facility');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditFacility = (facility) => {
    setEditingFacility(facility);
    setFacilityForm({
      name: facility.name,
      location: facility.location,
      capacity: facility.capacity.toString(),
      pricePerHour: facility.pricePerHour.toString(),
      status: facility.status,
      type: facility.type
    });
    setShowFacilityModal(true);
  };

  const deleteFacility = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await adminService.deleteFacility(id);
        toast.success('Facility deleted successfully!');
        await loadData();
      } catch (err) {
        console.error('Error deleting facility:', err);
        toast.error(err.response?.data?.message || 'Failed to delete facility');
      }
    }
  };

  const toggleFacilityStatus = async (id) => {
    try {
      const facility = facilities.find(f => f.id === id);
      if (facility) {
        const newStatus = facility.status === 'available' ? 'maintenance' : 'available';
        await adminService.updateFacility(id, { ...facility, status: newStatus });
        toast.success(`Facility status updated to ${newStatus}`);
        await loadData();
      }
    } catch (err) {
      console.error('Error updating facility status:', err);
      toast.error(err.response?.data?.message || 'Failed to update facility status');
    }
  };

  // Booking Functions
  const handleApproveBooking = async (bookingId) => {
    if (window.confirm('Approve this booking request?')) {
      try {
        await adminService.approveBooking(bookingId);
        toast.success('Booking approved successfully!');
        await loadData();
      } catch (err) {
        console.error('Error approving booking:', err);
        toast.error(err.response?.data?.message || 'Failed to approve booking');
      }
    }
  };

  const handleRejectBooking = async (e) => {
    e.preventDefault();
    if (selectedBooking) {
      try {
        setSubmitting(true);
        await adminService.rejectBooking(selectedBooking.id, rejectionReason);
        toast.success('Booking rejected successfully');
        await loadData();
        setShowRejectModal(false);
        setSelectedBooking(null);
        setRejectionReason('');
      } catch (err) {
        console.error('Error rejecting booking:', err);
        toast.error(err.response?.data?.message || 'Failed to reject booking');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  // Filters
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          facility.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFacility = facilityFilter === 'all' || booking.facilityId === parseInt(facilityFilter);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesFacility && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'green';
      case 'maintenance': return 'amber';
      case 'approved': return 'green';
      case 'pending': return 'amber';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading sports management data..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadData} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Sports Management</h1>
        <p className="text-indigo-100">Manage sports facilities and booking requests</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Facilities</p>
              <p className="text-3xl font-bold text-gray-900">{facilities.length}</p>
              <p className="text-xs text-gray-500 mt-1">{facilities.filter(f => f.status === 'available').length} available</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Trophy className="w-6 h-6 text-indigo-600" />
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
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{totalBookings}</p>
              <p className="text-xs text-green-600 mt-1">This month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">This month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900">{pendingApprovals}</p>
              <p className="text-xs text-amber-600 mt-1">Requires action</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('facilities')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'facilities'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Trophy className="w-4 h-4 mr-2" />
            Facilities
          </button>
          <button
            onClick={() => setActiveView('bookings')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'bookings'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Bookings
            {pendingApprovals > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {pendingApprovals}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Facilities View */}
      {activeView === 'facilities' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Search and Add */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFacilityModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Facility
              </button>
            </div>
          </div>

          {/* Facilities Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facility</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Capacity</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Price/Hour</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFacilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Activity className="w-5 h-5 text-indigo-600" />
                          </div>
                          <span className="font-medium text-gray-900">{facility.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {facility.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          facility.type === 'indoor' ? 'bg-purple-100 text-purple-700' : 'bg-cyan-100 text-cyan-700'
                        } capitalize`}>
                          {facility.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {facility.capacity}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-900">₹{facility.pricePerHour}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleFacilityStatus(facility.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(facility.status)}-100 text-${getStatusColor(facility.status)}-700 capitalize cursor-pointer hover:opacity-80`}
                        >
                          {facility.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditFacility(facility)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteFacility(facility.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bookings View */}
      {activeView === 'bookings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by student or facility..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={facilityFilter}
                  onChange={(e) => setFacilityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Facilities</option>
                  {facilities.map(facility => (
                    <option key={facility.id} value={facility.id}>{facility.name}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facility</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.studentName}</p>
                          <p className="text-xs text-gray-500">{booking.studentId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{booking.facilityName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center text-sm text-gray-600">
                          <Timer className="w-4 h-4 mr-1 text-gray-400" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{booking.duration}h</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-900">₹{booking.amount}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(booking.status)}-100 text-${getStatusColor(booking.status)}-700 capitalize`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveBooking(booking.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openRejectModal(booking)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {booking.status === 'rejected' && booking.rejectionReason && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowBookingModal(true);
                              }}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="View Reason"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {booking.status === 'approved' && (
                            <span className="text-xs text-gray-400">Confirmed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredBookings.length === 0 && (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-500">No booking requests match your filters.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Add/Edit Facility Modal */}
      <AnimatePresence>
        {showFacilityModal && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {editingFacility ? 'Edit Facility' : 'Add New Facility'}
                  </h2>
                  <button onClick={() => {
                    setShowFacilityModal(false);
                    setEditingFacility(null);
                    setFacilityForm({ name: '', location: '', capacity: '', pricePerHour: '', status: 'available', type: 'indoor' });
                  }} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddFacility} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Indoor Badminton Court"
                    value={facilityForm.name}
                    onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sports Complex - Block A"
                    value={facilityForm.location}
                    onChange={(e) => setFacilityForm({ ...facilityForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      required
                      value={facilityForm.type}
                      onChange={(e) => setFacilityForm({ ...facilityForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Max people"
                      value={facilityForm.capacity}
                      onChange={(e) => setFacilityForm({ ...facilityForm, capacity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Amount"
                      value={facilityForm.pricePerHour}
                      onChange={(e) => setFacilityForm({ ...facilityForm, pricePerHour: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      required
                      value={facilityForm.status}
                      onChange={(e) => setFacilityForm({ ...facilityForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFacilityModal(false);
                      setEditingFacility(null);
                      setFacilityForm({ name: '', location: '', capacity: '', pricePerHour: '', status: 'available', type: 'indoor' });
                    }}
                    disabled={submitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : (editingFacility ? 'Save Changes' : 'Add Facility')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Booking Modal */}
      <AnimatePresence>
        {showRejectModal && selectedBooking && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Reject Booking</h2>
                  <button onClick={() => {
                    setShowRejectModal(false);
                    setSelectedBooking(null);
                    setRejectionReason('');
                  }} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleRejectBooking} className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Student:</strong> {selectedBooking.studentName} ({selectedBooking.studentId})
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Facility:</strong> {selectedBooking.facilityName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()} ({selectedBooking.startTime} - {selectedBooking.endTime})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Please provide a reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false);
                      setSelectedBooking(null);
                      setRejectionReason('');
                    }}
                    disabled={submitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Rejecting...' : 'Reject Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Rejection Reason Modal */}
      <AnimatePresence>
        {showBookingModal && selectedBooking && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Rejection Details</h2>
                  <button onClick={() => {
                    setShowBookingModal(false);
                    setSelectedBooking(null);
                  }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-700 mb-2">Reason for Rejection:</p>
                  <p className="text-sm text-red-600">{selectedBooking.rejectionReason}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedBooking(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SportsManagement;
