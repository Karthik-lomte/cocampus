import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Award,
  Trophy,
  X,
  MessageSquare,
  Calendar,
  User,
  Building2,
  AlertTriangle,
  Check,
  RefreshCw
} from 'lucide-react';
import adminService from '../api/adminService';

const ApprovalManagement = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Leave');
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('');

  const tabs = [
    { id: 'Leave', label: 'Leave Requests', icon: FileText, color: 'blue' },
    { id: 'Certificate', label: 'Certificate Requests', icon: Award, color: 'purple' },
    { id: 'SportsBooking', label: 'Sports Bookings', icon: Trophy, color: 'green' }
  ];

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const response = await adminService.getApprovals();
      if (response.success) {
        setApprovals(response.data);
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
      alert('Error loading approvals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredApprovals = approvals.filter(approval => approval.type === activeTab);
  const pendingCount = (type) => approvals.filter(a => a.type === type && a.status === 'Pending').length;

  const openRemarksModal = (item, action) => {
    setSelectedItem(item);
    setActionType(action);
    setRemarks('');
    setShowRemarksModal(true);
  };

  const handleApprove = async () => {
    try {
      const response = await adminService.approveRequest(selectedItem._id);
      if (response.success) {
        alert(`Request approved successfully!`);
        setShowRemarksModal(false);
        setSelectedItem(null);
        fetchApprovals();
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert(error.response?.data?.message || 'Error approving request. Please try again.');
    }
  };

  const handleReject = async () => {
    try {
      const response = await adminService.rejectRequest(selectedItem._id, remarks);
      if (response.success) {
        alert(`Request rejected successfully!`);
        setShowRemarksModal(false);
        setSelectedItem(null);
        fetchApprovals();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(error.response?.data?.message || 'Error rejecting request. Please try again.');
    }
  };

  const handleAction = () => {
    if (actionType === 'approve') {
      handleApprove();
    } else {
      handleReject();
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Approved: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Approval Management</h1>
            <p className="text-indigo-100">Review and manage pending approval requests</p>
          </div>
          <button
            onClick={fetchApprovals}
            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Leave</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount('Leave')}</p>
              <p className="text-xs text-blue-600 mt-1">Awaiting approval</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Pending Certificates</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount('Certificate')}</p>
              <p className="text-xs text-purple-600 mt-1">Need processing</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm text-gray-600">Pending Sports</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount('SportsBooking')}</p>
              <p className="text-xs text-green-600 mt-1">Booking requests</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const pending = pendingCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  {pending > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      {pending}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Approvals Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApprovals.map((approval) => (
                  <tr key={approval._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {approval.requestedBy?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {approval.requestedBy?.role || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{approval.type}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(approval.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700 max-w-xs truncate">
                        {approval.details || approval.reason || 'No details'}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">
                        {formatDate(approval.startDate || approval.date)}
                      </p>
                      {approval.endDate && (
                        <p className="text-xs text-gray-500">
                          to {formatDate(approval.endDate)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(approval.status)}`}>
                        {approval.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {approval.status === 'Pending' ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openRemarksModal(approval, 'approve')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openRemarksModal(approval, 'reject')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-xs text-gray-500">
                            {approval.approvedBy?.name || 'System'}
                          </p>
                          {approval.remarks && (
                            <p className="text-xs text-gray-400 truncate max-w-xs">
                              {approval.remarks}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredApprovals.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No {activeTab.toLowerCase()} requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* Remarks Modal */}
      <AnimatePresence>
        {showRemarksModal && selectedItem && (
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
              <div className={`p-6 border-b border-gray-100 rounded-t-xl ${
                actionType === 'approve'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                  : 'bg-gradient-to-r from-red-600 to-rose-600'
              } text-white`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center">
                    {actionType === 'approve' ? (
                      <><CheckCircle className="w-5 h-5 mr-2" /> Approve Request</>
                    ) : (
                      <><XCircle className="w-5 h-5 mr-2" /> Reject Request</>
                    )}
                  </h2>
                  <button onClick={() => setShowRemarksModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>{selectedItem.type}</strong> request from{' '}
                    <strong>{selectedItem.requestedBy?.name || 'Unknown'}</strong>
                  </p>
                  {selectedItem.details && (
                    <p className="text-xs text-gray-500 mt-1">{selectedItem.details}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Remarks {actionType === 'reject' && <span className="text-red-600">*</span>}
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add any remarks or comments..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowRemarksModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    className={`px-4 py-2 text-white rounded-lg transition-colors ${
                      actionType === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {actionType === 'approve' ? 'Approve' : 'Reject'}
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

export default ApprovalManagement;
