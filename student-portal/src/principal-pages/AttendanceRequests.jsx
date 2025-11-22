import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Calendar, Users, User, Eye, X, MessageSquare } from 'lucide-react';
import principalService from '../api/principalService';

function AttendanceRequests() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await principalService.getApprovals({});

      if (response.success && response.data) {
        // Transform approvals data to match attendance request format
        const transformedRequests = response.data.map(approval => ({
          _id: approval._id,
          id: approval._id,
          clubName: approval.clubName || 'Club',
          requestDate: approval.requestDate || approval.createdAt,
          eventName: approval.title || approval.eventName || 'Event',
          eventDate: approval.eventDate || approval.date,
          selectedStudents: approval.students || approval.selectedStudents || [],
          totalStudents: (approval.students || approval.selectedStudents || []).length,
          reason: approval.reason || approval.description || '',
          status: approval.status || 'pending',
          submittedBy: approval.submittedBy || approval.requestedBy || 'Unknown',
          approvedDate: approval.approvedDate,
          rejectedDate: approval.rejectedDate,
          remarks: approval.remarks || ''
        }));

        setRequests(transformedRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setApprovalAction('approve');
    setShowApprovalModal(true);
    setShowDetailsModal(false);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setApprovalAction('reject');
    setShowApprovalModal(true);
    setShowDetailsModal(false);
  };

  const handleSubmitDecision = async (e) => {
    e.preventDefault();
    if (approvalAction === 'reject' && !remarks) {
      alert('Please provide remarks for rejection');
      return;
    }

    try {
      setLoading(true);
      const approvalId = selectedRequest._id || selectedRequest.id;

      if (approvalAction === 'approve') {
        const response = await principalService.approveRequest(approvalId);
        if (response.success) {
          alert('Attendance request approved successfully!');
          await fetchRequests(); // Refresh the list
        } else {
          alert('Failed to approve request: ' + (response.message || 'Unknown error'));
        }
      } else if (approvalAction === 'reject') {
        const response = await principalService.rejectRequest(approvalId, remarks);
        if (response.success) {
          alert('Attendance request rejected successfully!');
          await fetchRequests(); // Refresh the list
        } else {
          alert('Failed to reject request: ' + (response.message || 'Unknown error'));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Club Attendance Requests</h1>
          <p className="text-gray-600 mt-1">Review and approve attendance requests from clubs</p>
        </div>
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
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-4xl font-bold mt-2">
                {requests.filter(r => r.status === 'pending').length}
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
                {requests.filter(r => r.status === 'approved').length}
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
              <p className="text-4xl font-bold mt-2">{requests.length}</p>
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
        {['pending', 'approved', 'rejected', 'all'].map((status) => (
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

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Attendance Requests ({filteredRequests.length})</h2>
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
                  <div className="flex items-start gap-3 mb-2">
                    <Calendar className="text-purple-600 mt-1" size={20} />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-900">{request.eventName}</h3>
                        <span className="text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          {request.clubName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Event Date: {new Date(request.eventDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Submitted by: {request.submittedBy}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                    <div>
                      <span className="text-gray-500">Students:</span>{' '}
                      <span className="font-medium">{request.totalStudents}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Request Date:</span>{' '}
                      <span className="font-medium">{new Date(request.requestDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(request.status)}
                  <button
                    onClick={() => handleViewDetails(request)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
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

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRequest.eventName}</h2>
                    <p className="text-purple-100 text-sm mt-1">{selectedRequest.clubName}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Event Info */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar size={20} className="text-blue-600" />
                      Event Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Event Date:</strong> {new Date(selectedRequest.eventDate).toLocaleDateString()}</div>
                      <div><strong>Request Date:</strong> {new Date(selectedRequest.requestDate).toLocaleDateString()}</div>
                      <div><strong>Submitted By:</strong> {selectedRequest.submittedBy}</div>
                      <div><strong>Total Students:</strong> {selectedRequest.totalStudents}</div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare size={20} className="text-yellow-600" />
                      Reason for Attendance Request
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{selectedRequest.reason}</p>
                  </div>

                  {/* Selected Students */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Users size={20} className="text-green-600" />
                      Selected Students ({selectedRequest.totalStudents})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedRequest.selectedStudents.map((student, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded border border-green-200">
                          <User size={18} className="text-green-600" />
                          <div>
                            <div className="font-semibold text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">
                              {student.rollNo} • {student.department} • {student.year}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Info */}
                  {selectedRequest.status === 'approved' && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-bold text-green-900 mb-2">✅ Approved</h3>
                      <p className="text-sm text-green-700">Approved on: {new Date(selectedRequest.approvedDate).toLocaleDateString()}</p>
                      {selectedRequest.remarks && (
                        <div className="mt-2">
                          <strong className="text-green-900">Remarks:</strong>
                          <p className="text-green-700">{selectedRequest.remarks}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedRequest.status === 'rejected' && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h3 className="font-bold text-red-900 mb-2">❌ Rejected</h3>
                      <p className="text-sm text-red-700">Rejected on: {new Date(selectedRequest.rejectedDate).toLocaleDateString()}</p>
                      {selectedRequest.remarks && (
                        <div className="mt-2">
                          <strong className="text-red-900">Reason:</strong>
                          <p className="text-red-700">{selectedRequest.remarks}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedRequest.status === 'pending' && (
                  <div className="p-6 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={() => handleReject(selectedRequest)}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedRequest)}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} />
                      Approve
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && selectedRequest && (
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
                      {approvalAction === 'approve' ? 'Approve' : 'Reject'} Request
                    </h2>
                    <p className="text-sm opacity-90 mt-1">{selectedRequest.eventName}</p>
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
    </div>
  );
}

export default AttendanceRequests;
