import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Eye, X, User, Calendar, Phone, FileText, Search } from 'lucide-react';

function GatePassManagement() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Gate pass requests data
  const [gatePassRequests, setGatePassRequests] = useState([
    {
      id: 1,
      studentName: 'Rahul Sharma',
      rollNo: 'CSE2022015',
      roomNo: 'A-205',
      hostelBlock: 'Block A',
      passType: 'Medical',
      reason: 'Need to visit hospital for regular checkup and collect medical reports',
      date: '2024-11-20',
      outTime: '09:00',
      expectedReturn: '14:00',
      parentContact: '+91 9876543210',
      supportingDocs: 'medical_appointment.pdf',
      status: 'pending',
      requestDate: '2024-11-18'
    },
    {
      id: 2,
      studentName: 'Priya Patel',
      rollNo: 'ECE2021018',
      roomNo: 'B-312',
      hostelBlock: 'Block B',
      passType: 'Family Function',
      reason: 'Sister wedding ceremony at hometown',
      date: '2024-11-22',
      outTime: '06:00',
      expectedReturn: '21:00',
      parentContact: '+91 9876543211',
      supportingDocs: null,
      status: 'pending',
      requestDate: '2024-11-17'
    },
    {
      id: 3,
      studentName: 'Amit Kumar',
      rollNo: 'ME2022020',
      roomNo: 'A-108',
      hostelBlock: 'Block A',
      passType: 'Personal Work',
      reason: 'Need to collect passport from passport office',
      date: '2024-11-19',
      outTime: '10:00',
      expectedReturn: '16:00',
      parentContact: '+91 9876543212',
      supportingDocs: 'passport_receipt.pdf',
      status: 'approved',
      requestDate: '2024-11-16',
      approvedBy: 'Mr. Sharma (Warden)',
      approvedDate: '2024-11-17',
      remarks: 'Approved. Return before 4 PM.'
    },
    {
      id: 4,
      studentName: 'Sneha Reddy',
      rollNo: 'CSE2022030',
      roomNo: 'C-215',
      hostelBlock: 'Block C',
      passType: 'Medical',
      reason: 'Dental appointment',
      date: '2024-11-18',
      outTime: '11:00',
      expectedReturn: '13:00',
      parentContact: '+91 9876543213',
      supportingDocs: null,
      status: 'rejected',
      requestDate: '2024-11-15',
      rejectedBy: 'Mr. Sharma (Warden)',
      rejectedDate: '2024-11-16',
      remarks: 'Please provide dental clinic appointment slip.'
    }
  ]);

  const filteredRequests = gatePassRequests.filter(req => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesSearch = req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.roomNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
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

  const handleSubmitDecision = (e) => {
    e.preventDefault();
    if (approvalAction === 'reject' && !remarks) {
      alert('Please provide remarks for rejection');
      return;
    }

    // Update the request status
    setGatePassRequests(gatePassRequests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: approvalAction === 'approve' ? 'approved' : 'rejected',
          remarks: remarks,
          [`${approvalAction}dBy`]: 'Mr. Sharma (Warden)',
          [`${approvalAction}dDate`]: new Date().toISOString().split('T')[0]
        };
      }
      return req;
    }));

    alert(`Gate pass ${approvalAction}d successfully!`);
    setShowApprovalModal(false);
    setRemarks('');
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700'
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
          <h1 className="text-3xl font-bold text-gray-900">Gate Pass Management</h1>
          <p className="text-gray-600 mt-1">Review and manage student gate pass requests</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-4xl font-bold mt-2">
                {gatePassRequests.filter(r => r.status === 'pending').length}
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
                {gatePassRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <CheckCircle size={48} className="text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Rejected</p>
              <p className="text-4xl font-bold mt-2">
                {gatePassRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <XCircle size={48} className="text-red-200" />
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
              <p className="text-blue-100 text-sm">Total</p>
              <p className="text-4xl font-bold mt-2">{gatePassRequests.length}</p>
            </div>
            <Calendar size={48} className="text-blue-200" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, roll number, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['pending', 'approved', 'rejected', 'all'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === status
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Gate Pass Requests ({filteredRequests.length})</h2>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request, index) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{request.studentName}</div>
                      <div className="text-sm text-gray-500">{request.rollNo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{request.roomNo}</div>
                    <div className="text-xs text-gray-500">{request.hostelBlock}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.passType}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{new Date(request.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{request.outTime} - {request.expectedReturn}</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{request.studentName}</h3>
                  <p className="text-sm text-gray-600">{request.rollNo} • {request.roomNo}</p>
                </div>
                {getStatusBadge(request.status)}
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div><span className="text-gray-500">Type:</span> <span className="font-medium">{request.passType}</span></div>
                <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(request.date).toLocaleDateString()}</span></div>
                <div><span className="text-gray-500">Time:</span> <span className="font-medium">{request.outTime} - {request.expectedReturn}</span></div>
              </div>
              <button
                onClick={() => handleViewDetails(request)}
                className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No gate pass requests found</p>
          </div>
        )}
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
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Gate Pass Request</h2>
                    <p className="text-orange-100 text-sm mt-1">#{selectedRequest.id.toString().padStart(3, '0')}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Student Info */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <User size={20} className="text-blue-600" />
                      Student Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><strong>Name:</strong> {selectedRequest.studentName}</div>
                      <div><strong>Roll No:</strong> {selectedRequest.rollNo}</div>
                      <div><strong>Room:</strong> {selectedRequest.roomNo}</div>
                      <div><strong>Block:</strong> {selectedRequest.hostelBlock}</div>
                    </div>
                  </div>

                  {/* Pass Details */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar size={20} className="text-orange-600" />
                      Pass Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> {selectedRequest.passType}</div>
                      <div><strong>Date:</strong> {new Date(selectedRequest.date).toLocaleDateString()}</div>
                      <div><strong>Out Time:</strong> {selectedRequest.outTime}</div>
                      <div><strong>Expected Return:</strong> {selectedRequest.expectedReturn}</div>
                      <div><strong>Request Date:</strong> {new Date(selectedRequest.requestDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText size={20} className="text-yellow-600" />
                      Reason
                    </h3>
                    <p className="text-gray-700">{selectedRequest.reason}</p>
                  </div>

                  {/* Parent Contact */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Phone size={20} className="text-green-600" />
                      Parent Contact
                    </h3>
                    <p className="text-gray-700 font-medium">{selectedRequest.parentContact}</p>
                  </div>

                  {/* Supporting Docs */}
                  {selectedRequest.supportingDocs && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-2">Supporting Documents</h3>
                      <p className="text-purple-700">{selectedRequest.supportingDocs}</p>
                    </div>
                  )}

                  {/* Status Info */}
                  {selectedRequest.status === 'approved' && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-bold text-green-900 mb-2">✅ Approved</h3>
                      <p className="text-sm text-green-700">By: {selectedRequest.approvedBy}</p>
                      <p className="text-sm text-green-700">Date: {new Date(selectedRequest.approvedDate).toLocaleDateString()}</p>
                      {selectedRequest.remarks && <p className="text-sm text-green-700 mt-2"><strong>Remarks:</strong> {selectedRequest.remarks}</p>}
                    </div>
                  )}

                  {selectedRequest.status === 'rejected' && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h3 className="font-bold text-red-900 mb-2">❌ Rejected</h3>
                      <p className="text-sm text-red-700">By: {selectedRequest.rejectedBy}</p>
                      <p className="text-sm text-red-700">Date: {new Date(selectedRequest.rejectedDate).toLocaleDateString()}</p>
                      {selectedRequest.remarks && <p className="text-sm text-red-700 mt-2"><strong>Reason:</strong> {selectedRequest.remarks}</p>}
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
                <div className={`${approvalAction === 'approve' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600'} text-white p-6`}>
                  <h2 className="text-2xl font-bold">
                    {approvalAction === 'approve' ? 'Approve' : 'Reject'} Request
                  </h2>
                  <p className="text-sm opacity-90 mt-1">{selectedRequest.studentName} - {selectedRequest.rollNo}</p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      className={`flex-1 px-4 py-3 ${approvalAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg font-medium`}
                    >
                      Confirm
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

export default GatePassManagement;
