import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle, XCircle, Clock, User, Calendar,
  Mail, Phone, FileCheck, AlertCircle, X, MessageSquare, Plus, Upload
} from 'lucide-react';
import hodService from '../api/hodService';
import { useAuth } from '../context/AuthContext';

function LeaveApproval() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [filter, setFilter] = useState('pending');
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [leaveFormData, setLeaveFormData] = useState({
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    substituteArranged: '',
    documents: null
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await hodService.getLeaves({ department: user?.department });

      if (response.success && response.data) {
        setLeaveRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = leaveRequests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const handleApprove = (leave) => {
    setSelectedLeave(leave);
    setApprovalAction('approve');
    setShowApprovalModal(true);
  };

  const handleReject = (leave) => {
    setSelectedLeave(leave);
    setApprovalAction('reject');
    setShowApprovalModal(true);
  };

  const handleSubmitDecision = async (e) => {
    e.preventDefault();
    if (approvalAction === 'reject' && !remarks) {
      alert('Please provide remarks for rejection');
      return;
    }

    try {
      setLoading(true);
      const leaveId = selectedLeave._id || selectedLeave.id;

      if (approvalAction === 'approve') {
        const response = await hodService.approveLeave(leaveId, remarks);
        if (response.success) {
          alert('Leave request approved successfully!');
          await fetchLeaveRequests();
        } else {
          alert('Failed to approve leave: ' + (response.message || 'Unknown error'));
        }
      } else if (approvalAction === 'reject') {
        const response = await hodService.rejectLeave(leaveId, remarks);
        if (response.success) {
          alert('Leave request rejected successfully!');
          await fetchLeaveRequests();
        } else {
          alert('Failed to reject leave: ' + (response.message || 'Unknown error'));
        }
      }

      setShowApprovalModal(false);
      setRemarks('');
    } catch (error) {
      console.error('Error submitting decision:', error);
      alert('An error occurred while processing the request');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    // Calculate number of days
    const fromDate = new Date(leaveFormData.fromDate);
    const toDate = new Date(leaveFormData.toDate);
    const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    try {
      setLoading(true);
      // Create leave request (HOD applies to Principal)
      const response = await hodService.createLeave({
        ...leaveFormData,
        days,
        appliedBy: user?._id,
        department: user?.department
      });

      if (response.success) {
        alert(`Leave application submitted to Principal successfully!\nDuration: ${days} days`);
        setShowApplyLeaveModal(false);
        setLeaveFormData({
          leaveType: '',
          fromDate: '',
          toDate: '',
          reason: '',
          substituteArranged: '',
          documents: null
        });
      } else {
        alert('Failed to submit leave: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error applying for leave:', error);
      alert('An error occurred while submitting leave');
    } finally {
      setLoading(false);
    }
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      'Medical Leave': 'bg-red-50 text-red-700 border-red-200',
      'Casual Leave': 'bg-blue-50 text-blue-700 border-blue-200',
      'Conference Leave': 'bg-teal-50 text-teal-700 border-teal-200',
      'Emergency Leave': 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  if (loading && leaveRequests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-1">
            Apply for leave and review faculty leave requests
          </p>
        </div>
        <button
          onClick={() => setShowApplyLeaveModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          Apply for Leave
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Pending Requests</p>
              <p className="text-4xl font-bold mt-2">
                {leaveRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock size={48} className="text-orange-200" />
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
              <p className="text-green-100 text-sm">Approved This Month</p>
              <p className="text-4xl font-bold mt-2">8</p>
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
              <p className="text-4xl font-bold mt-2">{leaveRequests.length}</p>
            </div>
            <FileText size={48} className="text-blue-200" />
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
        {['pending', 'approved', 'rejected', 'all'].map((status) => (
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

      {/* Leave Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="divide-y divide-gray-200">
          {filteredRequests.map((leave, index) => (
            <motion.div
              key={leave.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              {/* Desktop View */}
              <div className="hidden md:block">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={24} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{leave.facultyName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLeaveTypeColor(leave.leaveType)}`}>
                          {leave.leaveType}
                        </span>
                        {leave.documents && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <FileCheck size={14} />
                            Documents Attached
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{leave.facultyId}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                          </p>
                          <p className="text-green-600 font-medium">{leave.days} days</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Reason</p>
                          <p className="font-medium text-gray-900">{leave.reason}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Substitute Faculty</p>
                          <p className="font-medium text-gray-900">{leave.substituteArranged}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {leave.documents && (
                      <button
                        onClick={() => alert(`Viewing documents for ${leave.facultyName}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileCheck size={16} />
                        View Documents
                      </button>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(leave)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(leave)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Applied on {new Date(leave.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{leave.facultyName}</h3>
                    <p className="text-sm text-gray-600">{leave.facultyId}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLeaveTypeColor(leave.leaveType)}`}>
                    {leave.leaveType}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </p>
                    <p className="text-green-600 font-medium">{leave.days} days</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reason</p>
                    <p className="font-medium text-gray-900">{leave.reason}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Substitute</p>
                    <p className="font-medium text-gray-900">{leave.substituteArranged}</p>
                  </div>
                </div>
                {leave.documents && (
                  <button
                    onClick={() => alert(`Viewing documents for ${leave.facultyName}`)}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <FileCheck size={16} className="inline mr-1" />
                    View Documents
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(leave)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="inline mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(leave)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    <XCircle size={16} className="inline mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredRequests.length === 0 && (
            <div className="p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No leave requests found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && selectedLeave && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApprovalModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className={`${approvalAction === 'approve' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600'} text-white p-6 flex justify-between items-center`}>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {approvalAction === 'approve' ? 'Approve' : 'Reject'} Leave
                    </h2>
                    <p className="text-sm opacity-90 mt-1">{selectedLeave.facultyName}</p>
                  </div>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmitDecision} className="p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Leave Details</p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Type:</span>{' '}
                        <span className="font-semibold">{selectedLeave.leaveType}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Duration:</span>{' '}
                        <span className="font-semibold">{selectedLeave.days} days</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Dates:</span>{' '}
                        <span className="font-semibold">
                          {new Date(selectedLeave.fromDate).toLocaleDateString()} - {new Date(selectedLeave.toDate).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks {approvalAction === 'reject' && <span className="text-red-600">*</span>}
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={4}
                      required={approvalAction === 'reject'}
                      placeholder={approvalAction === 'approve' ? 'Add optional remarks...' : 'Provide reason for rejection...'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApprovalModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 px-4 py-3 ${approvalAction === 'approve' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600'} text-white rounded-lg hover:shadow-lg font-medium`}
                    >
                      Confirm {approvalAction === 'approve' ? 'Approval' : 'Rejection'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showApplyLeaveModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyLeaveModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Apply for Leave</h2>
                    <p className="text-purple-100 text-sm mt-1">Submit leave request to Principal</p>
                  </div>
                  <button
                    onClick={() => setShowApplyLeaveModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Leave Type *
                      </label>
                      <select
                        required
                        value={leaveFormData.leaveType}
                        onChange={(e) => setLeaveFormData({ ...leaveFormData, leaveType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select leave type</option>
                        <option value="Medical Leave">Medical Leave</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Conference Leave">Conference Leave</option>
                        <option value="Emergency Leave">Emergency Leave</option>
                        <option value="Earned Leave">Earned Leave</option>
                        <option value="Academic Leave">Academic Leave</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={leaveFormData.fromDate}
                        onChange={(e) => setLeaveFormData({ ...leaveFormData, fromDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={leaveFormData.toDate}
                        onChange={(e) => setLeaveFormData({ ...leaveFormData, toDate: e.target.value })}
                        min={leaveFormData.fromDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason *
                      </label>
                      <textarea
                        required
                        value={leaveFormData.reason}
                        onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                        rows={3}
                        placeholder="Enter the reason for leave"
                        maxLength={300}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {leaveFormData.reason.length}/300 characters
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Substitute Arrangement *
                      </label>
                      <input
                        type="text"
                        required
                        value={leaveFormData.substituteArranged}
                        onChange={(e) => setLeaveFormData({ ...leaveFormData, substituteArranged: e.target.value })}
                        placeholder="Name of substitute faculty for your classes"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supporting Documents (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Upload size={20} />
                            <span className="text-sm">
                              {leaveFormData.documents ? leaveFormData.documents.name : 'Upload medical certificate or other documents'}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setLeaveFormData({ ...leaveFormData, documents: e.target.files[0] })}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowApplyLeaveModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-medium"
                    >
                      Submit Leave Request
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

export default LeaveApproval;
