import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Users, CheckCircle, Clock, XCircle, X, User, Search } from 'lucide-react';
import { clubData } from '../club-data/clubData';

function AttendanceManagement() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [requestFormData, setRequestFormData] = useState({
    eventName: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [filter, setFilter] = useState('all');

  // Sample student data for selection
  const availableStudents = [
    { rollNo: 'CSE2022020', name: 'Amit Patel', department: 'CSE', year: '2nd Year' },
    { rollNo: 'ECE2022015', name: 'Neha Gupta', department: 'ECE', year: '2nd Year' },
    { rollNo: 'CSE2021025', name: 'Rajesh Kumar', department: 'CSE', year: '3rd Year' },
    { rollNo: 'ME2022010', name: 'Priya Singh', department: 'ME', year: '2nd Year' },
    { rollNo: 'EEE2021018', name: 'Karan Sharma', department: 'EEE', year: '3rd Year' },
    { rollNo: 'CSE2022030', name: 'Sneha Reddy', department: 'CSE', year: '2nd Year' },
    { rollNo: 'IT2022012', name: 'Vikram Singh', department: 'IT', year: '2nd Year' },
    { rollNo: 'CSE2021030', name: 'Ananya Mishra', department: 'CSE', year: '3rd Year' },
    { rollNo: 'ECE2021022', name: 'Rohan Verma', department: 'ECE', year: '3rd Year' },
    { rollNo: 'ME2021015', name: 'Divya Sharma', department: 'ME', year: '3rd Year' }
  ];

  // Filter students based on search and department
  const filteredStudents = availableStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [...new Set(availableStudents.map(s => s.department))];

  const attendanceRequests = clubData.attendanceRequests;

  const filteredRequests = attendanceRequests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const handleToggleStudent = (student) => {
    const isSelected = selectedStudents.find(s => s.rollNo === student.rollNo);
    if (isSelected) {
      setSelectedStudents(selectedStudents.filter(s => s.rollNo !== student.rollNo));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }
    if (requestFormData.endDate && requestFormData.startDate > requestFormData.endDate) {
      alert('End date must be after start date');
      return;
    }
    const dateRange = requestFormData.endDate
      ? `${new Date(requestFormData.startDate).toLocaleDateString()} to ${new Date(requestFormData.endDate).toLocaleDateString()}`
      : new Date(requestFormData.startDate).toLocaleDateString();
    alert(`Attendance request submitted for ${selectedStudents.length} students (${dateRange}) to Principal!`);
    setShowRequestModal(false);
    setSelectedStudents([]);
    setSearchTerm('');
    setDepartmentFilter('all');
    setRequestFormData({ eventName: '', startDate: '', endDate: '', reason: '' });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents([...filteredStudents]);
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Request attendance for students participating in club events</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          Request Attendance
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Requests</p>
              <p className="text-4xl font-bold mt-2">
                {attendanceRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock size={48} className="text-yellow-200" />
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
                {attendanceRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <CheckCircle size={48} className="text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Requests</p>
              <p className="text-4xl font-bold mt-2">{attendanceRequests.length}</p>
            </div>
            <Calendar size={48} className="text-blue-200" />
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-2 flex gap-2 overflow-x-auto"
      >
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Attendance Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Attendance Requests</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <Calendar className="text-green-600 mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{request.eventName}</h3>
                      <p className="text-sm text-gray-600">Event Date: {new Date(request.eventDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600 mt-1">Submitted by: {request.submittedBy}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Reason for Attendance Request:</h4>
                    <p className="text-sm text-gray-700">{request.reason}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users size={18} />
                      Selected Students ({request.totalStudents})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {request.selectedStudents.map((student, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-gray-200">
                          <User size={16} className="text-green-600" />
                          <div>
                            <span className="font-medium">{student.name}</span>
                            <span className="text-gray-500 ml-2">({student.rollNo})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {request.status === 'approved' && request.remarks && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-3">
                      <h4 className="font-semibold text-green-900 mb-1">Principal's Remarks:</h4>
                      <p className="text-sm text-green-700">{request.remarks}</p>
                      <p className="text-xs text-green-600 mt-2">Approved on: {new Date(request.approvedDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  {request.status === 'rejected' && request.remarks && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200 mt-3">
                      <h4 className="font-semibold text-red-900 mb-1">Rejection Reason:</h4>
                      <p className="text-sm text-red-700">{request.remarks}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(request.status)}
                  <div className="text-xs text-gray-500 text-right">
                    {new Date(request.requestDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredRequests.length === 0 && (
            <div className="p-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No attendance requests found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Request Attendance Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8"
              >
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Request Attendance</h2>
                    <p className="text-green-100 text-sm mt-1">Select students and provide reason</p>
                  </div>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitRequest} className="p-6 space-y-6">
                  {/* Event Details */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
                        <input
                          type="text"
                          required
                          value={requestFormData.eventName}
                          onChange={(e) => setRequestFormData({ ...requestFormData, eventName: e.target.value })}
                          placeholder="e.g., Web Development Workshop"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                        <input
                          type="date"
                          required
                          value={requestFormData.startDate}
                          onChange={(e) => setRequestFormData({ ...requestFormData, startDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                        <input
                          type="date"
                          value={requestFormData.endDate}
                          onChange={(e) => setRequestFormData({ ...requestFormData, endDate: e.target.value })}
                          min={requestFormData.startDate}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty for single day event</p>
                      </div>

                      <div className="flex items-end">
                        {requestFormData.startDate && (
                          <div className="w-full bg-green-100 border border-green-300 rounded-lg p-3">
                            <p className="text-sm font-medium text-green-800">
                              {requestFormData.endDate
                                ? `${Math.ceil((new Date(requestFormData.endDate) - new Date(requestFormData.startDate)) / (1000 * 60 * 60 * 24)) + 1} day(s)`
                                : '1 day'
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Select Students */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Select Students</h3>
                      <span className="text-sm text-purple-600 font-medium">
                        {selectedStudents.length} of {filteredStudents.length} student(s) selected
                      </span>
                    </div>

                    {/* Search and Filter */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Search by name or roll number..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        />
                      </div>
                      <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                      >
                        <option value="all">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    {/* Select All Button */}
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium underline"
                      >
                        {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0
                          ? 'Deselect All'
                          : `Select All (${filteredStudents.length})`
                        }
                      </button>
                      {selectedStudents.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedStudents([])}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    {/* Student Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => {
                          const isSelected = selectedStudents.find(s => s.rollNo === student.rollNo);
                          return (
                            <div
                              key={student.rollNo}
                              onClick={() => handleToggleStudent(student)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 bg-white hover:border-green-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  isSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'
                                }`}>
                                  {isSelected && <CheckCircle size={16} className="text-white" />}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">{student.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {student.rollNo} • {student.department} • {student.year}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                          <Search size={32} className="mx-auto mb-2 text-gray-400" />
                          <p>No students found matching your search</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Reason for Attendance Request *</h3>
                    <textarea
                      required
                      value={requestFormData.reason}
                      onChange={(e) => setRequestFormData({ ...requestFormData, reason: e.target.value })}
                      rows={4}
                      maxLength={500}
                      placeholder="Provide a detailed reason for requesting attendance for these students..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {requestFormData.reason.length}/500 characters
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg font-medium"
                    >
                      Submit Request
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
}

export default AttendanceManagement;
