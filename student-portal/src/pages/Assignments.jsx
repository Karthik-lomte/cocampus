import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, Clock, FileText, Upload, CheckCircle, AlertCircle, Download, X } from 'lucide-react';
import { assignments } from '../data/assignmentsData';

const Assignments = () => {
  const [filter, setFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionComments, setSubmissionComments] = useState('');

  const filteredAssignments = assignments.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'pending') return a.status === 'pending';
    if (filter === 'submitted') return a.status === 'submitted';
    if (filter === 'graded') return a.status === 'graded';
    return true;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      submitted: 'bg-blue-100 text-blue-700',
      graded: 'bg-green-100 text-green-700'
    };
    return styles[status] || styles.pending;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-blue-100 text-blue-700'
    };
    return styles[priority] || styles.low;
  };

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!submissionFile) {
      alert('Please upload a file');
      return;
    }
    alert(`Assignment "${selectedAssignment.title}" submitted successfully!`);
    setShowSubmitModal(false);
    setSubmissionFile(null);
    setSubmissionComments('');
    setSelectedAssignment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">View and submit your assignments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'submitted', 'graded'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === f
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-2 text-sm">
              ({assignments.filter(a => f === 'all' ? true : a.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(assignment.priority)}`}>
                      {assignment.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(assignment.status)}`}>
                      {assignment.status}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      {assignment.subjectCode}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <BookOpen size={16} className="mr-1" />
                      {assignment.subject}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <FileText size={16} className="mr-1" />
                      Max Marks: {assignment.maxMarks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status-specific content */}
              {assignment.status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center text-yellow-700">
                      <AlertCircle size={20} className="mr-2" />
                      <span className="font-medium">Submission pending</span>
                    </div>
                    <button
                      onClick={() => handleSubmitAssignment(assignment)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Upload size={16} className="mr-2" />
                      Submit Assignment
                    </button>
                  </div>
                </div>
              )}

              {assignment.status === 'submitted' && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center text-blue-700 mb-1">
                        <CheckCircle size={20} className="mr-2" />
                        <span className="font-medium">Submitted successfully</span>
                      </div>
                      <p className="text-sm text-blue-600">
                        Submitted on: {new Date(assignment.submittedDate).toLocaleString()}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                      <Download size={16} className="mr-2" />
                      View Submission
                    </button>
                  </div>
                </div>
              )}

              {assignment.status === 'graded' && assignment.marksObtained !== null && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-green-700">
                      <CheckCircle size={20} className="mr-2" />
                      <span className="font-medium">Graded</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-700">
                        {assignment.marksObtained}/{assignment.maxMarks}
                      </p>
                      <p className="text-sm text-green-600">
                        {((assignment.marksObtained / assignment.maxMarks) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  {assignment.feedback && (
                    <div className="mt-3 p-3 bg-white rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Faculty Feedback:</p>
                      <p className="text-sm text-gray-600">{assignment.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Submit Assignment Modal */}
      <AnimatePresence>
        {showSubmitModal && selectedAssignment && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Submit Assignment</h2>
                  <p className="text-blue-100 text-sm mt-1">{selectedAssignment.title}</p>
                </div>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmitForm} className="space-y-6">
                  {/* Assignment Details */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subject:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedAssignment.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Due Date:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Marks:</span>
                      <span className="text-sm font-semibold text-gray-900">{selectedAssignment.maxMarks}</span>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Assignment File *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        required
                        accept=".pdf,.doc,.docx,.zip,.rar"
                        onChange={(e) => setSubmissionFile(e.target.files[0])}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: PDF, DOC, DOCX, ZIP, RAR (Max 10MB)
                      </p>
                      {submissionFile && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                          <div className="flex items-center text-blue-700">
                            <FileText size={18} className="mr-2" />
                            <span className="text-sm font-medium">{submissionFile.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSubmissionFile(null)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={submissionComments}
                      onChange={(e) => setSubmissionComments(e.target.value)}
                      rows={4}
                      placeholder="Add any additional comments for your submission..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                    >
                      Submit Assignment
                    </button>
                  </div>
                </form>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assignments;
