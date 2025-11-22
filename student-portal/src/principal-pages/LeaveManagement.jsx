import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Calendar, User, Plus, X, Upload } from 'lucide-react';
import { principalData } from '../principal-data/principalData';

function LeaveManagement() {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveApplication, setLeaveApplication] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    document: null
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

  const handleSubmitDecision = (e) => {
    e.preventDefault();
    if (approvalAction === 'reject' && !remarks) {
      alert('Please provide remarks for rejection');
      return;
    }
    alert('Leave ' + approvalAction + 'd successfully for ' + selectedLeave.hodName + '!');
    setShowApprovalModal(false);
    setRemarks('');
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    alert('Leave application submitted to Admin successfully!');
    setShowApplyModal(false);
    setLeaveApplication({ leaveType: '', startDate: '', endDate: '', reason: '', document: null });
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      'Casual Leave': 'bg-blue-100 text-blue-700 border-blue-200',
      'Medical Leave': 'bg-red-100 text-red-700 border-red-200',
      'Conference Leave': 'bg-purple-100 text-purple-700 border-purple-200',
      'Sick Leave': 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage HOD leave requests and apply for leave</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Apply for Leave
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-orange-100 text-sm">Pending Requests</p>
          <p className="text-4xl font-bold mt-2">{principalData.hodLeaveRequests.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-green-100 text-sm">Approved This Month</p>
          <p className="text-4xl font-bold mt-2">8</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-blue-100 text-sm">Total Requests</p>
          <p className="text-4xl font-bold mt-2">24</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">HOD Leave Requests</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {principalData.hodLeaveRequests.map((leave, index) => (
            <motion.div
              key={leave.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-lg">{leave.hodName}</h3>
                      <span className={'px-3 py-1 rounded-full text-xs font-medium border ' + getLeaveTypeColor(leave.leaveType)}>
                        {leave.leaveType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{leave.department} Department</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="text-purple-600 font-medium">{leave.days} days</div>
                    </div>
                    <p className="text-sm text-gray-700"><strong>Reason:</strong> {leave.reason}</p>
                    <p className="text-xs text-gray-500 mt-2">Applied on {new Date(leave.appliedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(leave)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(leave)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
                <div className={(approvalAction === 'approve' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600') + ' text-white p-6 flex justify-between items-center'}>
                  <h2 className="text-2xl font-bold">
                    {approvalAction === 'approve' ? 'Approve' : 'Reject'} Leave Request
                  </h2>
                  <button onClick={() => setShowApprovalModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmitDecision} className="p-6 space-y-4">
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">HOD:</span> <span className="font-semibold">{selectedLeave.hodName}</span></p>
                    <p><span className="text-gray-600">Department:</span> <span className="font-semibold">{selectedLeave.department}</span></p>
                    <p><span className="text-gray-600">Leave Type:</span> <span className="font-semibold">{selectedLeave.leaveType}</span></p>
                    <p><span className="text-gray-600">Duration:</span> <span className="font-semibold">{selectedLeave.days} days</span></p>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      className={'flex-1 px-4 py-3 ' + (approvalAction === 'approve' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600') + ' text-white rounded-lg hover:shadow-lg font-medium'}
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

      <AnimatePresence>
        {showApplyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Apply for Leave</h2>
                  <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
                  <p className="text-sm text-purple-600 bg-purple-50 p-3 rounded-lg">
                    Your leave application will be sent to Admin for approval
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                      <select
                        value={leaveApplication.leaveType}
                        onChange={(e) => setLeaveApplication({...leaveApplication, leaveType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Medical Leave">Medical Leave</option>
                        <option value="Conference Leave">Conference Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                      <input
                        type="date"
                        value={leaveApplication.startDate}
                        onChange={(e) => setLeaveApplication({...leaveApplication, startDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={leaveApplication.endDate}
                      onChange={(e) => setLeaveApplication({...leaveApplication, endDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                    <textarea
                      value={leaveApplication.reason}
                      onChange={(e) => setLeaveApplication({...leaveApplication, reason: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Provide reason for leave..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document (Optional)</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setLeaveApplication({...leaveApplication, document: e.target.files[0]})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-medium"
                    >
                      Submit to Admin
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

export default LeaveManagement;
