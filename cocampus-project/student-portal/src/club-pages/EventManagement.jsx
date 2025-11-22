import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Users, Eye, Download, Upload, X, FileText, Clock, CheckCircle, ImageIcon } from 'lucide-react';
import { clubService } from '../services/clubService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function EventManagement() {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    // Basic Activity Details
    academicYear: '',
    quarter: '',
    programType: '',
    programTheme: '',
    activityName: '',
    drivenBy: '',
    otherProgramType: '',
    duration: '',
    startDate: '',
    endDate: '',
    studentParticipants: '',
    facultyParticipants: '',
    externalParticipants: '',
    expenditure: '',
    remark: '',
    modeOfDelivery: '',
    activityLedBy: '',
    // Overview
    objective: '',
    benefit: '',
    // Attachments
    videoUrl: '',
    photograph1: null,
    photograph2: null,
    reportPdf: null,
    additionalDoc: null
  });

  // Load Events
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clubService.getEvents();
      setEvents(data.events || data || []);
    } catch (err) {
      console.error('Error loading events:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await clubService.createEvent(formData);
      toast.success('Event request submitted successfully to Principal!');
      setShowCreateForm(false);
      setFormData({
        academicYear: '', quarter: '', programType: '', programTheme: '',
        activityName: '', drivenBy: '', otherProgramType: '', duration: '',
        startDate: '', endDate: '', studentParticipants: '', facultyParticipants: '',
        externalParticipants: '', expenditure: '', remark: '', modeOfDelivery: '',
        activityLedBy: '', objective: '', benefit: '', videoUrl: '',
        photograph1: null, photograph2: null, reportPdf: null, additionalDoc: null
      });
      await loadEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewParticipants = (event) => {
    setSelectedEvent(event);
    setShowParticipants(true);
  };

  const handleDownloadCSV = () => {
    if (!selectedEvent || !clubData.eventParticipants[selectedEvent.id]) {
      alert('No participants data available');
      return;
    }

    const participants = clubData.eventParticipants[selectedEvent.id];

    // Prepare CSV content
    let csvContent = 'Registration ID,Type,Name,Roll Number,Department,Year,Email,Mobile,Gender,Accommodation,Payment Status,Amount,Registered Date\n';

    participants.forEach(p => {
      if (p.registrationType === 'Single') {
        csvContent += `${p.registrationId},Single,${p.fullName},${p.rollNumber},${p.department},${p.year},${p.email},${p.mobile},${p.gender || 'N/A'},${p.accommodation ? 'Yes' : 'No'},${p.paymentStatus},${p.amount},${p.registeredDate}\n`;
      } else {
        csvContent += `${p.registrationId},Team,${p.teamName},${p.teamLeaderRoll},${p.institution},-,${p.teamLeaderEmail},${p.teamLeaderPhone},-,-,${p.paymentStatus},${p.amount},${p.registeredDate}\n`;
      }
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedEvent.activityName}_Participants_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.toUpperCase()}
    </span>;
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading events..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadEvents} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Request events and manage participants</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          Request New Event
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Events</p>
              <p className="text-4xl font-bold mt-2">{eventRequests.length}</p>
            </div>
            <Calendar size={48} className="text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Approved</p>
              <p className="text-4xl font-bold mt-2">
                {eventRequests.filter(e => e.status === 'approved').length}
              </p>
            </div>
            <CheckCircle size={48} className="text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-4xl font-bold mt-2">
                {eventRequests.filter(e => e.status === 'pending').length}
              </p>
            </div>
            <Clock size={48} className="text-yellow-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Participants</p>
              <p className="text-4xl font-bold mt-2">
                {eventRequests.reduce((sum, e) => sum + (e.registeredCount || 0), 0)}
              </p>
            </div>
            <Users size={48} className="text-blue-200" />
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-2 flex gap-2 overflow-x-auto"
      >
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Create Event Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Request New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Activity Details */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📌 Basic Activity Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
                  <select
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Year</option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quarter *</label>
                  <select
                    required
                    value={formData.quarter}
                    onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Quarter</option>
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Type *</label>
                  <select
                    required
                    value={formData.programType}
                    onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Type</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Conference">Conference</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Theme *</label>
                  <input
                    type="text"
                    required
                    value={formData.programTheme}
                    onChange={(e) => setFormData({ ...formData, programTheme: e.target.value })}
                    placeholder="e.g., Technical Skills"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.activityName}
                    onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                    placeholder="Enter event name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours) *</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode of Delivery *</label>
                  <select
                    required
                    value={formData.modeOfDelivery}
                    onChange={(e) => setFormData({ ...formData, modeOfDelivery: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Mode</option>
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Participants * (min 40)</label>
                  <input
                    type="number"
                    required
                    value={formData.studentParticipants}
                    onChange={(e) => setFormData({ ...formData, studentParticipants: e.target.value })}
                    min="40"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faculty Participants *</label>
                  <input
                    type="number"
                    required
                    value={formData.facultyParticipants}
                    onChange={(e) => setFormData({ ...formData, facultyParticipants: e.target.value })}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">External Participants</label>
                  <input
                    type="number"
                    value={formData.externalParticipants}
                    onChange={(e) => setFormData({ ...formData, externalParticipants: e.target.value })}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expenditure (₹)</label>
                  <input
                    type="number"
                    value={formData.expenditure}
                    onChange={(e) => setFormData({ ...formData, expenditure: e.target.value })}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity Led By *</label>
                  <select
                    required
                    value={formData.activityLedBy}
                    onChange={(e) => setFormData({ ...formData, activityLedBy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select</option>
                    <option value="Student Committee">Student Committee</option>
                    <option value="Faculty Coordinator">Faculty Coordinator</option>
                    <option value="Joint Committee">Joint Committee</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                  <textarea
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    rows={2}
                    maxLength={300}
                    placeholder="Additional remarks or special requirements"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📌 Overview</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objective * (max 300 chars)</label>
                  <textarea
                    required
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    rows={3}
                    maxLength={300}
                    placeholder="State the main objective of the event"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">{formData.objective.length}/300 characters</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefit/Outcome * (max 300 chars)</label>
                  <textarea
                    required
                    value={formData.benefit}
                    onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
                    rows={3}
                    maxLength={300}
                    placeholder="Describe the expected benefits and outcomes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">{formData.benefit.length}/300 characters</div>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📌 Attachments / Uploads</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photograph 1 * (Logo/Poster - max 2MB)</label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, photograph1: e.target.files[0] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photograph 2 * (Banner - max 2MB)</label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, photograph2: e.target.files[0] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Report * (PDF - max 2MB)</label>
                    <input
                      type="file"
                      required
                      accept=".pdf"
                      onChange={(e) => setFormData({ ...formData, reportPdf: e.target.files[0] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Document (Optional)</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFormData({ ...formData, additionalDoc: e.target.files[0] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                Submit Request
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Event Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Event Requests</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <Calendar className="text-purple-600 mt-1" size={20} />
                    <div>
                      <h3 className="font-bold text-gray-900">{event.activityName}</h3>
                      <p className="text-sm text-gray-600">{event.programType} • {event.programTheme}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                    <div>
                      <span className="text-gray-500">Date:</span>{' '}
                      <span className="font-medium">{new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>{' '}
                      <span className="font-medium">{event.duration}h</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Participants:</span>{' '}
                      <span className="font-medium">{event.studentParticipants}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Registered:</span>{' '}
                      <span className="font-medium text-green-600">{event.registeredCount || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(event.status)}
                  {event.status === 'approved' && (
                    <button
                      onClick={() => handleViewParticipants(event)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Users size={16} />
                      View Participants
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="p-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No event requests found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Participants Modal */}
      <AnimatePresence>
        {showParticipants && selectedEvent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowParticipants(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEvent.activityName}</h2>
                    <p className="text-purple-100 text-sm mt-1">
                      Registered Participants: {clubData.eventParticipants[selectedEvent.id]?.length || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownloadCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download size={20} />
                      Download CSV
                    </button>
                    <button
                      onClick={() => setShowParticipants(false)}
                      className="p-2 hover:bg-white/20 rounded-lg"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {clubData.eventParticipants[selectedEvent.id] ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {clubData.eventParticipants[selectedEvent.id].map((participant, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{participant.registrationId}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  participant.registrationType === 'Single' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {participant.registrationType}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {participant.registrationType === 'Single' ? participant.fullName : participant.teamName}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {participant.registrationType === 'Single' ? participant.rollNumber : participant.teamLeaderRoll}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {participant.registrationType === 'Single' ? participant.mobile : participant.teamLeaderPhone}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  participant.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  ₹{participant.amount}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(participant.registeredDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No participants registered yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EventManagement;
