import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, Clock, User, Calendar, Phone,
  AlertCircle, X, FileText, TrendingUp
} from 'lucide-react';
import { hodData } from '../hod-data/hodData';

function GatePassApproval() {
  const [selectedPass, setSelectedPass] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [filter, setFilter] = useState('pending');

  const gatePassRequests = hodData.gatePassRequests;

  const filteredRequests = gatePassRequests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const handleApprove = (pass) => {
    setSelectedPass(pass);
    setApprovalAction('approve');
    setShowApprovalModal(true);
  };

  const handleReject = (pass) => {
    setSelectedPass(pass);
    setApprovalAction('reject');
    setShowApprovalModal(true);
  };

  const handleSubmitDecision = (e) => {
    e.preventDefault();
    if (approvalAction === 'reject' && !remarks) {
      alert('Please provide remarks for rejection');
      return;
    }
    alert(`Gate pass ${approvalAction}d successfully!`);
    setShowApprovalModal(false);
    setRemarks('');
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 75) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
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
          <h1 className="text-3xl font-bold text-gray-900">Gate Pass Approvals</h1>
          <p className="text-gray-600 mt-1">
            Review and approve student gate pass requests
          </p>
        </div>
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
                {gatePassRequests.filter(r => r.status === 'pending').length}
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
              <p className="text-green-100 text-sm">Approved Today</p>
              <p className="text-4xl font-bold mt-2">12</p>
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
              <p className="text-4xl font-bold mt-2">{gatePassRequests.length}</p>
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

      {/* Gate Pass Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="divide-y divide-gray-200">
          {filteredRequests.map((pass, index) => (
            <motion.div
              key={pass.id}
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
                        <h3 className="font-bold text-gray-900 text-lg">{pass.studentName}</h3>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {pass.class}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAttendanceColor(pass.attendancePercentage)}`}>
                          {pass.attendancePercentage}% Attendance
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{pass.rollNo} • {pass.studentId}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Reason</p>
                          <p className="font-semibold text-gray-900">{pass.reason}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date & Time</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(pass.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-green-600">
                            {pass.time} - {pass.returnTime}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <p className="text-gray-500">Student Contact</p>
                          <p className="font-medium text-gray-900">{pass.contactNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Parent Contact</p>
                          <p className="font-medium text-gray-900">{pass.parentContact}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(pass)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(pass)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Applied on {new Date(pass.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{pass.studentName}</h3>
                    <p className="text-sm text-gray-600">{pass.rollNo}</p>
                    <p className="text-sm text-gray-600">{pass.class}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(pass.attendancePercentage)}`}>
                    {pass.attendancePercentage}%
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500">Reason</p>
                    <p className="font-semibold text-gray-900">{pass.reason}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date & Time</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(pass.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-green-600">
                      {pass.time} - {pass.returnTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contact</p>
                    <p className="font-medium text-gray-900">{pass.contactNumber}</p>
                    <p className="text-xs text-gray-600">Parent: {pass.parentContact}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(pass)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="inline mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(pass)}
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
              <p className="text-gray-600">No gate pass requests found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && selectedPass && (
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
                      {approvalAction === 'approve' ? 'Approve' : 'Reject'} Gate Pass
                    </h2>
                    <p className="text-sm opacity-90 mt-1">{selectedPass.studentName}</p>
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
                    <p className="text-sm text-gray-600 mb-2">Student Details</p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Name:</span>{' '}
                        <span className="font-semibold">{selectedPass.studentName}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Class:</span>{' '}
                        <span className="font-semibold">{selectedPass.class}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Reason:</span>{' '}
                        <span className="font-semibold">{selectedPass.reason}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Time:</span>{' '}
                        <span className="font-semibold">
                          {selectedPass.time} - {selectedPass.returnTime}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Attendance:</span>{' '}
                        <span className={`font-semibold ${selectedPass.attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedPass.attendancePercentage}%
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
    </div>
  );
}

export default GatePassApproval;
