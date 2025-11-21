import React, { useState } from 'react';
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
  Check
} from 'lucide-react';

const ApprovalManagement = () => {
  const [activeTab, setActiveTab] = useState('leave');
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('');

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'Dr. Priya Sharma', designation: 'Professor', department: 'Computer Science', leaveType: 'Casual Leave', fromDate: '2024-01-15', toDate: '2024-01-17', days: 3, reason: 'Personal work', status: 'pending', appliedOn: '2024-01-10' },
    { id: 2, name: 'Dr. Amit Kumar', designation: 'Associate Professor', department: 'Electronics', leaveType: 'Medical Leave', fromDate: '2024-01-20', toDate: '2024-01-25', days: 6, reason: 'Medical treatment', status: 'pending', appliedOn: '2024-01-12' },
    { id: 3, name: 'Prof. Neha Gupta', designation: 'Assistant Professor', department: 'Mechanical', leaveType: 'Earned Leave', fromDate: '2024-01-22', toDate: '2024-01-26', days: 5, reason: 'Family function', status: 'approved', appliedOn: '2024-01-08', remarks: 'Approved as requested' },
    { id: 4, name: 'Dr. Rajesh Verma', designation: 'Professor', department: 'Civil', leaveType: 'Casual Leave', fromDate: '2024-01-18', toDate: '2024-01-19', days: 2, reason: 'Emergency work', status: 'pending', appliedOn: '2024-01-14' }
  ]);

  const [certificateRequests, setCertificateRequests] = useState([
    { id: 1, studentName: 'Rahul Sharma', studentId: 'STU2022001', department: 'Computer Science', certificateType: 'Bonafide Certificate', purpose: 'Bank loan application', status: 'pending', appliedOn: '2024-01-10', priority: 'high' },
    { id: 2, studentName: 'Priya Patel', studentId: 'STU2022045', department: 'Electronics', certificateType: 'Character Certificate', purpose: 'Job application', status: 'pending', appliedOn: '2024-01-11', priority: 'medium' },
    { id: 3, studentName: 'Amit Singh', studentId: 'STU2021089', department: 'Mechanical', certificateType: 'Course Completion', purpose: 'Higher studies', status: 'processing', appliedOn: '2024-01-08', priority: 'high' },
    { id: 4, studentName: 'Neha Gupta', studentId: 'STU2022112', department: 'Civil', certificateType: 'Bonafide Certificate', purpose: 'Passport application', status: 'completed', appliedOn: '2024-01-05', priority: 'low' },
    { id: 5, studentName: 'Vikram Kumar', studentId: 'STU2023034', department: 'IT', certificateType: 'Migration Certificate', purpose: 'University transfer', status: 'pending', appliedOn: '2024-01-12', priority: 'high' }
  ]);

  const [sportsBookings, setSportsBookings] = useState([
    { id: 1, guestName: 'Mr. Rajesh Kumar', phone: '+91 9876543210', facility: 'Tennis Court', date: '2024-01-20', timeSlot: '6:00 AM - 8:00 AM', guests: 4, purpose: 'Morning practice', status: 'pending', appliedOn: '2024-01-14' },
    { id: 2, guestName: 'Mrs. Sunita Devi', phone: '+91 9876543211', facility: 'Swimming Pool', date: '2024-01-21', timeSlot: '7:00 AM - 9:00 AM', guests: 2, purpose: 'Swimming lessons', status: 'pending', appliedOn: '2024-01-13' },
    { id: 3, guestName: 'Dr. Arun Sharma', phone: '+91 9876543212', facility: 'Basketball Court', date: '2024-01-19', timeSlot: '5:00 PM - 7:00 PM', guests: 10, purpose: 'Friendly match', status: 'approved', appliedOn: '2024-01-10', remarks: 'Approved for weekend use' },
    { id: 4, guestName: 'Mr. Vijay Singh', phone: '+91 9876543213', facility: 'Badminton Court', date: '2024-01-22', timeSlot: '6:00 PM - 8:00 PM', guests: 4, purpose: 'Practice session', status: 'pending', appliedOn: '2024-01-15' }
  ]);

  const tabs = [
    { id: 'leave', label: 'Leave Requests', icon: FileText, color: 'blue' },
    { id: 'certificate', label: 'Certificate Requests', icon: Award, color: 'purple' },
    { id: 'sports', label: 'Sports Bookings', icon: Trophy, color: 'green' }
  ];

  const pendingLeave = leaveRequests.filter(r => r.status === 'pending').length;
  const pendingCertificates = certificateRequests.filter(r => r.status === 'pending').length;
  const pendingSports = sportsBookings.filter(r => r.status === 'pending').length;

  const openRemarksModal = (item, action) => {
    setSelectedItem(item);
    setActionType(action);
    setRemarks('');
    setShowRemarksModal(true);
  };

  const handleLeaveAction = () => {
    setLeaveRequests(leaveRequests.map(request =>
      request.id === selectedItem.id
        ? { ...request, status: actionType === 'approve' ? 'approved' : 'rejected', remarks }
        : request
    ));
    setShowRemarksModal(false);
    setSelectedItem(null);
    alert(`Leave request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`);
  };

  const handleCertificateAction = (id, action) => {
    setCertificateRequests(certificateRequests.map(request =>
      request.id === id
        ? { ...request, status: action === 'process' ? 'processing' : action === 'complete' ? 'completed' : 'rejected' }
        : request
    ));
    alert(`Certificate request ${action === 'process' ? 'marked as processing' : action === 'complete' ? 'completed' : 'rejected'}!`);
  };

  const handleSportsAction = () => {
    setSportsBookings(sportsBookings.map(booking =>
      booking.id === selectedItem.id
        ? { ...booking, status: actionType === 'approve' ? 'approved' : 'rejected', remarks }
        : booking
    ));
    setShowRemarksModal(false);
    setSelectedItem(null);
    alert(`Sports booking ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Approval Management</h1>
        <p className="text-indigo-100">Review and manage pending approval requests</p>
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
              <p className="text-3xl font-bold text-gray-900">{pendingLeave}</p>
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
              <p className="text-3xl font-bold text-gray-900">{pendingCertificates}</p>
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
              <p className="text-3xl font-bold text-gray-900">{pendingSports}</p>
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
              const pendingCount = tab.id === 'leave' ? pendingLeave : tab.id === 'certificate' ? pendingCertificates : pendingSports;
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
                  {pendingCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Leave Requests Tab */}
        {activeTab === 'leave' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaveRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{request.name}</p>
                            <p className="text-sm text-gray-500">{request.designation}</p>
                            <p className="text-xs text-gray-400">{request.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{request.leaveType}</p>
                        <p className="text-xs text-gray-500">Applied: {request.appliedOn}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{request.fromDate} to {request.toDate}</p>
                        <p className="text-xs text-gray-500">{request.days} days</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700 max-w-xs truncate">{request.reason}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {request.status === 'pending' ? (
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => openRemarksModal(request, 'approve')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openRemarksModal(request, 'reject')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 text-center">{request.remarks || 'No remarks'}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Certificate Requests Tab */}
        {activeTab === 'certificate' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {certificateRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{request.studentName}</p>
                            <p className="text-sm text-gray-500">{request.studentId}</p>
                            <p className="text-xs text-gray-400">{request.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{request.certificateType}</p>
                        <p className="text-xs text-gray-500">Applied: {request.appliedOn}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700">{request.purpose}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityBadge(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleCertificateAction(request.id, 'process')}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Start Processing"
                              >
                                <Clock className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleCertificateAction(request.id, 'reject')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {request.status === 'processing' && (
                            <button
                              onClick={() => handleCertificateAction(request.id, 'complete')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark Complete"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          {(request.status === 'completed' || request.status === 'rejected') && (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sports Bookings Tab */}
        {activeTab === 'sports' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facility</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sportsBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg mr-3">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{booking.guestName}</p>
                            <p className="text-sm text-gray-500">{booking.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{booking.facility}</p>
                        <p className="text-xs text-gray-500">Applied: {booking.appliedOn}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {booking.date}
                        </div>
                        <p className="text-xs text-gray-500">{booking.timeSlot}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{booking.guests} guests</p>
                        <p className="text-xs text-gray-500">{booking.purpose}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {booking.status === 'pending' ? (
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => openRemarksModal(booking, 'approve')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openRemarksModal(booking, 'reject')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 text-center">{booking.remarks || 'No remarks'}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
                    {activeTab === 'leave' ? (
                      <>Request from <strong>{selectedItem.name}</strong> for {selectedItem.days} days {selectedItem.leaveType}</>
                    ) : (
                      <>Booking by <strong>{selectedItem.guestName}</strong> for {selectedItem.facility}</>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Remarks (Optional)
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
                    onClick={activeTab === 'leave' ? handleLeaveAction : handleSportsAction}
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
