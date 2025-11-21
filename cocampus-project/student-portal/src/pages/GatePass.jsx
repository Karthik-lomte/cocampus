import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, Heart, Users, Briefcase, UserCheck, Home } from 'lucide-react';
import { studentService } from '../services/studentService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function GatePass() {
  const toast = useToast();
  const [gatePassData, setGatePassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    passType: '',
    sendTo: '',
    reason: '',
    date: '',
    outTime: '',
    expectedReturn: '',
    parentContact: '',
    supportingDocs: null
  });

  useEffect(() => {
    loadGatePasses();
  }, []);

  const loadGatePasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getGatePasses();
      setGatePassData(data);
    } catch (err) {
      console.error('Gate pass error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) submitData.append(key, formData[key]);
      });

      await studentService.createGatePass(submitData);
      const approverText = formData.sendTo === 'hod' ? 'Head of Department' : 'Hostel Warden';
      toast.success(`Gate pass request submitted successfully! Your request has been sent to: ${approverText}`);

      setShowRequestForm(false);
      setFormData({
        passType: '',
        sendTo: '',
        reason: '',
        date: '',
        outTime: '',
        expectedReturn: '',
        parentContact: '',
        supportingDocs: null
      });

      await loadGatePasses();
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit gate pass request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading gate passes..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadGatePasses} fullScreen />;

  const passTypes = [
    { value: 'medical', label: 'Medical Emergency', icon: 'Heart' },
    { value: 'family', label: 'Family Function', icon: 'Users' },
    { value: 'personal', label: 'Personal Work', icon: 'Briefcase' },
    { value: 'other', label: 'Other', icon: 'Clock' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-blue-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getPassTypeIcon = (iconName) => {
    const icons = {
      Heart: Heart,
      Users: Users,
      Briefcase: Briefcase,
      Clock: Clock
    };
    const Icon = icons[iconName] || AlertCircle;
    return <Icon size={20} />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gate Pass Request</h1>
            <p className="text-gray-600">Request gate passes for day scholars</p>
          </div>
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Request Gate Pass
          </button>
        </div>
      </motion.div>

      {/* Request Form */}
      {showRequestForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">New Gate Pass Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Leave *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {passTypes.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="passType"
                      value={type.value}
                      checked={formData.passType === type.value}
                      onChange={(e) => setFormData({ ...formData, passType: e.target.value })}
                      className="mt-1"
                      required
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        {getPassTypeIcon(type.icon)}
                        {type.label}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send Request To *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    formData.sendTo === 'hod' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="sendTo"
                    value="hod"
                    checked={formData.sendTo === 'hod'}
                    onChange={(e) => setFormData({ ...formData, sendTo: e.target.value })}
                    className="hidden"
                    required
                  />
                  <div className={`p-2 rounded-lg ${formData.sendTo === 'hod' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <UserCheck size={20} className={formData.sendTo === 'hod' ? 'text-blue-600' : 'text-gray-600'} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Head of Department</div>
                    <div className="text-xs text-gray-500">For academic-related leaves</div>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    formData.sendTo === 'warden' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="sendTo"
                    value="warden"
                    checked={formData.sendTo === 'warden'}
                    onChange={(e) => setFormData({ ...formData, sendTo: e.target.value })}
                    className="hidden"
                    required
                  />
                  <div className={`p-2 rounded-lg ${formData.sendTo === 'warden' ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    <Home size={20} className={formData.sendTo === 'warden' ? 'text-orange-600' : 'text-gray-600'} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Hostel Warden</div>
                    <div className="text-xs text-gray-500">For hostel students</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Reason *
              </label>
              <textarea
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                placeholder="Enter detailed reason for gate pass"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Out Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.outTime}
                  onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Return Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.expectedReturn}
                  onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.parentContact}
                  onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                  pattern="[+]?[0-9]{10,13}"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {formData.passType === 'medical' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documents (Medical Certificate)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFormData({ ...formData, supportingDocs: e.target.files[0] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                disabled={submitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Request History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Request History</h2>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gatePassData?.requestHistory?.map((request) => (
                <tr key={request._id || request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">#{(request.id || request._id).toString().slice(-3)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">{request.passType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{request.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{new Date(request.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{request.outTime} - {request.expectedReturn}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.parentContact}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      {getStatusBadge(request.status)}
                    </div>
                    {request.approvedBy && (
                      <div className="text-xs text-gray-500 mt-1">{request.approvedBy}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {gatePassData?.requestHistory?.map((request) => (
            <motion.div
              key={request._id || request.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Request #{(request.id || request._id).toString().slice(-3)}</div>
                  <div className="font-semibold text-gray-900 capitalize">{request.passType}</div>
                </div>
                {getStatusBadge(request.status)}
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">{request.reason}</div>
                <div className="flex justify-between text-gray-500">
                  <span>{new Date(request.date).toLocaleDateString()}</span>
                  <span>{request.outTime} - {request.expectedReturn}</span>
                </div>
                {request.approvedBy && (
                  <div className="text-xs text-gray-500">{request.approvedBy}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default GatePass;
