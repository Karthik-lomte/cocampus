import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Calendar, CheckCircle, XCircle, Clock, Upload, Briefcase } from 'lucide-react';
import { leaveData } from '../faculty-data/leaveData';
import { facultyData } from '../faculty-data/facultyData';

function LeaveManagement() {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    substituteTeacher: '',
    document: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Leave application submitted successfully!');
    setShowApplyForm(false);
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      substituteTeacher: '',
      document: null
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle
    };
    const Icon = icons[status];

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${styles[status]}`}>
        <Icon size={14} />
        {status.toUpperCase()}
      </span>
    );
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  // Calculate total available leaves
  const totalAvailableLeaves = Object.values(leaveData.balance).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Leave Summary */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase size={32} />
              <h1 className="text-3xl font-bold">Leave Management</h1>
            </div>
            <p className="text-green-100 mb-4">Manage your leave applications and track balance</p>

            {/* Total Leave Summary */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block">
              <p className="text-green-100 text-sm mb-1">Total Leave Balance</p>
              <p className="text-4xl font-bold">{totalAvailableLeaves} <span className="text-2xl">Days</span></p>
            </div>
          </div>

          <button
            onClick={() => setShowApplyForm(!showApplyForm)}
            className="flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-xl hover:shadow-2xl transition-all font-semibold"
          >
            <Plus size={22} />
            Apply for Leave
          </button>
        </div>
      </motion.div>

      {/* Leave Balance Cards - Enhanced Design */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {leaveData.leaveTypes.map((type, index) => {
          const availableDays = leaveData.balance[type.type];
          const percentage = (availableDays / 12) * 100; // Assuming 12 is max for each type

          return (
            <motion.div
              key={type.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${type.color}`}></div>

              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <Calendar className="text-white" size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm">{type.name}</h3>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-4xl font-bold text-gray-900">{availableDays}</p>
                <p className="text-sm text-gray-600">Days Available</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${type.color}`}
                  style={{ width: `${percentage}%`, opacity: 0.7 }}
                ></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Apply Leave Form */}
      {showApplyForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">New Leave Application</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
                <select
                  required
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Leave Type</option>
                  {leaveData.leaveTypes.map(type => (
                    <option key={type.type} value={type.type}>
                      {type.name} ({leaveData.balance[type.type]} days available)
                    </option>
                  ))}
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {formData.startDate && formData.endDate && (
                <div className="flex items-end">
                  <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl w-full">
                    <p className="text-sm text-gray-600 mb-1">Total Duration</p>
                    <p className="text-3xl font-bold text-green-600">{calculateDays()} Days</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Substitute Faculty</label>
                <select
                  value={formData.substituteTeacher}
                  onChange={(e) => setFormData({ ...formData, substituteTeacher: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Substitute (Optional)</option>
                  <option>Dr. Priya Sharma</option>
                  <option>Prof. Anil Verma</option>
                  <option>Dr. Sanjay Gupta</option>
                  <option>Prof. Meera Patel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Document</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, document: e.target.files[0] })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload medical certificate or relevant document (PDF, JPG, PNG)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave *</label>
              <textarea
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
                placeholder="Enter the reason for your leave application"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-shadow font-medium"
              >
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Leave History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-green-600" size={24} />
            Leave History
          </h2>
          <p className="text-sm text-gray-600 mt-1">Track your leave applications and status</p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveData.leaveHistory.map((leave, index) => (
                <motion.tr
                  key={leave.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="text-green-600 mr-2" size={18} />
                      <span className="font-medium text-gray-900">{leave.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {leave.days} days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {leave.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(leave.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(leave.status)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {leaveData.leaveHistory.map((leave, index) => (
            <motion.div
              key={leave.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="text-green-600" size={18} />
                  <span className="font-bold text-gray-900">{leave.type}</span>
                </div>
                {getStatusBadge(leave.status)}
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Duration:</span> {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Days:</span> <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{leave.days}</span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Reason:</span> {leave.reason}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Applied:</span> {new Date(leave.appliedDate).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LeaveManagement;
