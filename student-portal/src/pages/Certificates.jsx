import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Download, Clock, CheckCircle, XCircle, AlertCircle, BookOpen, Filter } from 'lucide-react';
import { certificateData } from '../data/certificateData';

function Certificates() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    certificateType: '',
    purpose: '',
    copies: 1,
    priority: 'normal'
  });
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [showMemoResult, setShowMemoResult] = useState(false);

  // Sample semester memo data
  const semesterMemos = {
    '2023-2024': {
      'Semester 1': {
        fileName: 'Semester_1_Memo_2023-24.pdf',
        generatedDate: '2023-12-20',
        totalCredits: 24,
        sgpa: 8.5,
        totalMarks: 850,
        obtainedMarks: 723
      },
      'Semester 2': {
        fileName: 'Semester_2_Memo_2023-24.pdf',
        generatedDate: '2024-05-15',
        totalCredits: 24,
        sgpa: 8.7,
        totalMarks: 850,
        obtainedMarks: 739
      }
    },
    '2024-2025': {
      'Semester 1': {
        fileName: 'Semester_1_Memo_2024-25.pdf',
        generatedDate: '2024-12-18',
        totalCredits: 24,
        sgpa: 8.9,
        totalMarks: 850,
        obtainedMarks: 756
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Certificate request submitted successfully!');
    setShowRequestForm(false);
    setFormData({
      certificateType: '',
      purpose: '',
      copies: 1,
      priority: 'normal'
    });
  };

  const handleFetchMemo = () => {
    if (!selectedYear || !selectedSemester) {
      alert('Please select both year and semester');
      return;
    }
    if (semesterMemos[selectedYear] && semesterMemos[selectedYear][selectedSemester]) {
      setShowMemoResult(true);
    } else {
      alert('No memo available for the selected year and semester');
      setShowMemoResult(false);
    }
  };

  const handleDownloadMemo = () => {
    if (selectedYear && selectedSemester && semesterMemos[selectedYear]?.[selectedSemester]) {
      const memo = semesterMemos[selectedYear][selectedSemester];
      alert(`Downloading ${memo.fileName}...`);
      // In a real application, this would trigger the actual download
    }
  };

  const getAvailableSemesters = () => {
    if (!selectedYear || !semesterMemos[selectedYear]) return [];
    return Object.keys(semesterMemos[selectedYear]);
  };

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
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
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

      {/* Request Form */}
      {showRequestForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">New Certificate Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Type *
              </label>
              <select
                required
                value={formData.certificateType}
                onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select certificate type</option>
                {certificateData.certificateTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose *
              </label>
              <textarea
                required
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                rows={3}
                maxLength={200}
                placeholder="Enter the purpose for requesting this certificate"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.purpose.length}/200 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Copies *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Priority *
              </label>
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
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                Submit Request
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Semester Memo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Semester Memo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Academic Year *
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedSemester('');
                setShowMemoResult(false);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose Year</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Semester *
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setShowMemoResult(false);
              }}
              disabled={!selectedYear}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose Semester</option>
              {getAvailableSemesters().map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleFetchMemo}
              disabled={!selectedYear || !selectedSemester}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Filter size={20} />
              Fetch Memo
            </button>
          </div>
        </div>

        {/* Memo Result */}
        {showMemoResult && selectedYear && selectedSemester && semesterMemos[selectedYear]?.[selectedSemester] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="text-purple-600" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedYear} - {selectedSemester}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">SGPA</p>
                    <p className="font-bold text-purple-600 text-xl">
                      {semesterMemos[selectedYear][selectedSemester].sgpa}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Credits</p>
                    <p className="font-semibold text-gray-900">
                      {semesterMemos[selectedYear][selectedSemester].totalCredits}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Marks Obtained</p>
                    <p className="font-semibold text-gray-900">
                      {semesterMemos[selectedYear][selectedSemester].obtainedMarks}/{semesterMemos[selectedYear][selectedSemester].totalMarks}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Generated On</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(semesterMemos[selectedYear][selectedSemester].generatedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownloadMemo}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                <Download size={20} />
                Download Memo
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Request History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Copies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {certificateData.requestHistory.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">#{request.id.toString().padStart(3, '0')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{request.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{request.purpose}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{request.copies}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(request.requestDate).toLocaleDateString()}
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

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {certificateData.requestHistory.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Request #{request.id.toString().padStart(3, '0')}</div>
                  <div className="font-semibold text-gray-900">{request.type}</div>
                </div>
                {getStatusBadge(request.status)}
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">{request.purpose}</div>
                <div className="flex justify-between text-gray-500">
                  <span>Copies: {request.copies}</span>
                  <span>{new Date(request.requestDate).toLocaleDateString()}</span>
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
