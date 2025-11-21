import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Download, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { studentService } from '../services/studentService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function Certificates() {
  const toast = useToast();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    certificateType: '',
    purpose: '',
    copies: 1,
    priority: 'normal'
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getMyCertificates();
      setCertificateData(data);
    } catch (err) {
      console.error('Certificates error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await studentService.requestCertificate(formData);
      toast.success('Certificate request submitted successfully!');
      setShowRequestForm(false);
      setFormData({
        certificateType: '',
        purpose: '',
        copies: 1,
        priority: 'normal'
      });
      await loadCertificates();
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit certificate request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading certificates..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadCertificates} fullScreen />;

  const certificateTypes = certificateData?.certificateTypes || [
    'Bonafide Certificate',
    'Transfer Certificate',
    'Character Certificate',
    'Course Completion Certificate',
    'Migration Certificate'
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'in_progress':
        return <Clock className="text-yellow-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      approved: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
      pending: 'bg-gray-100 text-gray-700'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {(status || 'pending').replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificates</h1>
            <p className="text-gray-600">Request and download your certificates</p>
          </div>
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Request Certificate
          </button>
        </div>
      </motion.div>

      {showRequestForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">New Certificate Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Type *</label>
              <select
                required
                value={formData.certificateType}
                onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select certificate type</option>
                {certificateTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
              <textarea
                required
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                rows={3}
                maxLength={200}
                placeholder="Enter the purpose for requesting this certificate"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">{formData.purpose.length}/200 characters</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Copies *</label>
              <input
                type="number"
                required
                min="1"
                max="5"
                value={formData.copies}
                onChange={(e) => setFormData({ ...formData, copies: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Processing Priority *</label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="priority"
                    value="normal"
                    checked={formData.priority === 'normal'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Normal</div>
                    <div className="text-sm text-gray-600">Standard processing time (5-7 days)</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="priority"
                    value="urgent"
                    checked={formData.priority === 'urgent'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Urgent</div>
                    <div className="text-sm text-gray-600">50% faster processing (Additional ₹100)</div>
                  </div>
                </label>
              </div>
            </div>

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Request History</h2>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Copies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {certificateData?.requestHistory?.map((request) => (
                <tr key={request._id || request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">#{(request.id || request._id).toString().slice(-3)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{request.type || request.certificateType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{request.purpose}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{request.copies}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(request.requestDate || request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      {getStatusBadge(request.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(request.status === 'completed' || request.status === 'approved') && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        <Download size={16} />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-200">
          {certificateData?.requestHistory?.map((request) => (
            <motion.div
              key={request._id || request.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Request #{(request.id || request._id).toString().slice(-3)}</div>
                  <div className="font-semibold text-gray-900">{request.type || request.certificateType}</div>
                </div>
                {getStatusBadge(request.status)}
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">{request.purpose}</div>
                <div className="flex justify-between text-gray-500">
                  <span>Copies: {request.copies}</span>
                  <span>{new Date(request.requestDate || request.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {(request.status === 'completed' || request.status === 'approved') && (
                <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  <Download size={16} />
                  Download Certificate
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Certificates;
