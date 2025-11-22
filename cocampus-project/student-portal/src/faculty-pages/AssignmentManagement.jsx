import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload, Eye, CheckCircle, Clock, FileText, X, Download, User, Edit2, Lock, Unlock } from 'lucide-react';
import { facultyService } from '../services/facultyService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function AssignmentManagement() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [creating, setCreating] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [grading, setGrading] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [gradingData, setGradingData] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    description: '',
    dueDate: '',
    maxMarks: '',
    lateSubmission: false,
    file: null
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyService.getAssignments();
      setAssignments(data.assignments || data || []);
      setSubjects(data.subjects || []);
    } catch (err) {
      console.error('Assignments error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const assignmentData = new FormData();
      assignmentData.append('title', formData.title);
      assignmentData.append('subject', formData.subject);
      assignmentData.append('class', formData.class);
      assignmentData.append('description', formData.description);
      assignmentData.append('dueDate', formData.dueDate);
      assignmentData.append('maxMarks', formData.maxMarks);
      assignmentData.append('lateSubmission', formData.lateSubmission);
      if (formData.file) {
        assignmentData.append('file', formData.file);
      }

      await facultyService.createAssignment(assignmentData);
      toast.success('Assignment created successfully!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        subject: '',
        class: '',
        description: '',
        dueDate: '',
        maxMarks: '',
        lateSubmission: false,
        file: null
      });
      await loadAssignments();
    } catch (err) {
      console.error('Create assignment error:', err);
      toast.error(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  const handleViewSubmissions = async (assignment) => {
    try {
      setLoadingSubmissions(true);
      setSelectedAssignment(assignment);
      const data = await facultyService.getAssignmentSubmissions(assignment._id || assignment.id);
      setSubmissions(data.submissions || data || []);
      setShowSubmissions(true);
    } catch (err) {
      console.error('Load submissions error:', err);
      toast.error('Failed to load submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleGradeNow = async (assignment) => {
    try {
      setLoadingSubmissions(true);
      setSelectedEvaluation(assignment);
      const data = await facultyService.getAssignmentSubmissions(assignment._id || assignment.id);
      const pendingSubmissions = (data.submissions || data || []).filter(s => !s.marks && s.status === 'submitted');
      setSubmissions(pendingSubmissions);

      // Initialize grading data
      const initialGradingData = {};
      pendingSubmissions.forEach(submission => {
        initialGradingData[submission.studentRoll || submission.student?.rollNo] = {
          marks: '',
          feedback: ''
        };
      });
      setGradingData(initialGradingData);
      setShowGradingModal(true);
    } catch (err) {
      console.error('Load submissions error:', err);
      toast.error('Failed to load submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleSaveGrades = async () => {
    const gradedCount = Object.entries(gradingData).filter(([_, data]) => data.marks !== '').length;
    if (gradedCount === 0) {
      toast.error('Please grade at least one student before saving.');
      return;
    }

    try {
      setGrading(true);
      // Grade each submission
      const gradePromises = Object.entries(gradingData)
        .filter(([_, data]) => data.marks !== '')
        .map(([rollNo, data]) => {
          const submission = submissions.find(s => (s.studentRoll || s.student?.rollNo) === rollNo);
          if (submission) {
            return facultyService.gradeSubmission(submission._id || submission.id, {
              marks: parseFloat(data.marks),
              feedback: data.feedback
            });
          }
          return Promise.resolve();
        });

      await Promise.all(gradePromises);
      toast.success(`Successfully graded ${gradedCount} student(s)!`);
      setShowGradingModal(false);
      setSelectedEvaluation(null);
      setGradingData({});
      await loadAssignments();
    } catch (err) {
      console.error('Grade submissions error:', err);
      toast.error(err.response?.data?.message || 'Failed to save grades');
    } finally {
      setGrading(false);
    }
  };

  const updateGrading = (rollNo, field, value) => {
    setGradingData(prev => ({
      ...prev,
      [rollNo]: {
        ...prev[rollNo],
        [field]: value
      }
    }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      expired: 'bg-red-100 text-red-700',
      pending: 'bg-orange-100 text-orange-700'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.toUpperCase()}
    </span>;
  };

  if (loading) return <Loading fullScreen message="Loading assignments..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadAssignments} fullScreen />;

  const pendingEvaluations = assignments.filter(a => {
    const pending = (a.submittedCount || 0) - (a.evaluatedCount || 0);
    return pending > 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-gray-600 mt-1">Create and manage student assignments</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          Create Assignment
        </button>
      </motion.div>

      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">New Assignment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Implement Binary Search Tree"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id || subject.code} value={subject.code || subject.subjectCode}>
                      {subject.name || subject.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                <select
                  required
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Class</option>
                  <option>CSE-3A</option>
                  <option>CSE-3B</option>
                  <option>CSE-4A</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Marks *</label>
                <input
                  type="number"
                  required
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                  placeholder="20"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Questions</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Enter assignment description and instructions"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.lateSubmission}
                  onChange={(e) => setFormData({ ...formData, lateSubmission: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Allow Late Submission</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                disabled={creating}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Created Assignments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Created Assignments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {assignments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No assignments created yet</p>
            </div>
          ) : (
            assignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <FileText className="text-green-600 mt-1" size={20} />
                    <div>
                      <h3 className="font-bold text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.subject || assignment.subjectName} • {assignment.class || assignment.className}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    <span>Max Marks: {assignment.maxMarks}</span>
                    <span>Submitted: {assignment.submittedCount || 0}/{assignment.totalStudents || 0}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(assignment.status)}
                  <button
                    onClick={() => handleViewSubmissions(assignment)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={16} className="inline mr-1" />
                    View Submissions
                  </button>
                </div>
              </div>
            </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Pending Evaluations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Pending Evaluations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingEvaluations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No pending evaluations</p>
            </div>
          ) : (
            pendingEvaluations.map((item, index) => {
              const pendingCount = (item.submittedCount || 0) - (item.evaluatedCount || 0);
              return (
                <motion.div
                  key={item._id || item.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.class || item.className}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="text-green-600">Evaluated: {item.evaluatedCount || 0}</span>
                      <span className="text-orange-600">Pending: {pendingCount}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGradeNow(item)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Grade Now
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Submissions Modal */}
      <AnimatePresence>
        {showSubmissions && selectedAssignment && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmissions(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedAssignment.title}</h2>
                  <p className="text-green-100 text-sm mt-1">
                    {selectedAssignment.class} • {selectedAssignment.subject}
                  </p>
                </div>
                <button
                  onClick={() => setShowSubmissions(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedAssignment.totalStudents}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="text-2xl font-bold text-green-600">{selectedAssignment.submittedCount}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedAssignment.totalStudents - selectedAssignment.submittedCount}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Max Marks</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedAssignment.maxMarks}</p>
                  </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted On</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {loadingSubmissions ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center">
                              <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                              <p className="mt-2 text-gray-600">Loading submissions...</p>
                            </td>
                          </tr>
                        ) : submissions.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                              No submissions yet
                            </td>
                          </tr>
                        ) : (
                          submissions.map((submission, index) => {
                            const studentRoll = submission.studentRoll || submission.student?.rollNo;
                            const studentName = submission.studentName || submission.student?.name;
                            return (
                              <tr key={submission._id || submission.id || index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{studentRoll}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{studentName}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                  {submission.submittedDate ? new Date(submission.submittedDate).toLocaleString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                    submission.status === 'on_time' || submission.status === 'On Time'
                                      ? 'bg-green-100 text-green-700'
                                      : submission.status === 'late' || submission.status === 'Late'
                                      ? 'bg-orange-100 text-orange-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {submission.status || 'Submitted'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  {submission.marks !== undefined && submission.marks !== null ? (
                                    <span className="font-semibold text-green-600">
                                      {submission.marks}/{selectedAssignment.maxMarks}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">Not Graded</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  {submission.fileUrl && (
                                    <a
                                      href={submission.fileUrl}
                                      download
                                      className="text-green-600 hover:text-green-700 flex items-center gap-1"
                                    >
                                      <Download size={16} />
                                      <span className="text-sm">Download</span>
                                    </a>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden divide-y divide-gray-200">
                    {generateSubmissions(selectedAssignment).map((submission, index) => (
                      <div key={index} className="p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{submission.studentName}</h4>
                            <p className="text-sm text-gray-600">{submission.studentRoll}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm mb-3">
                          <p className="text-gray-600">
                            Submitted: {new Date(submission.submittedDate).toLocaleString()}
                          </p>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Submission Status</label>
                            <select
                              value={submissionStatuses[submission.studentRoll] || submission.status}
                              onChange={(e) => handleStatusChange(submission.studentRoll, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg text-sm font-medium border-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                (submissionStatuses[submission.studentRoll] || submission.status) === 'On Time'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : (submissionStatuses[submission.studentRoll] || submission.status) === 'Late'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : (submissionStatuses[submission.studentRoll] || submission.status) === 'Not Submitted'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              <option value="On Time">On Time</option>
                              <option value="Late">Late</option>
                              <option value="Not Submitted">Not Submitted</option>
                              <option value="Excused">Excused</option>
                              <option value="Resubmitted">Resubmitted</option>
                            </select>
                          </div>
                          <p className="text-gray-900">
                            Marks: {submission.marksObtained !== null ? (
                              <span className="font-semibold text-green-600">
                                {submission.marksObtained}/{selectedAssignment.maxMarks}
                              </span>
                            ) : (
                              <span className="text-gray-400">Not Graded</span>
                            )}
                          </p>
                        </div>
                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                          <Download size={16} />
                          Download Submission
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {showGradingModal && selectedEvaluation && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGradingModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Grade Assignments</h2>
                  <p className="text-orange-100 text-sm mt-1">
                    {selectedEvaluation.title} • {selectedEvaluation.class}
                  </p>
                </div>
                <button
                  onClick={() => setShowGradingModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Pending Evaluations</p>
                    <p className="text-2xl font-bold text-orange-600">{selectedEvaluation.pendingCount}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Already Evaluated</p>
                    <p className="text-2xl font-bold text-green-600">{selectedEvaluation.evaluatedCount}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 col-span-2 md:col-span-1">
                    <p className="text-sm text-gray-600">Assignment Title</p>
                    <p className="text-lg font-bold text-gray-900 truncate">{selectedEvaluation.title}</p>
                  </div>
                </div>

                {/* Desktop View - Grading Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted On</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissions.map((submission, index) => {
                        const studentRoll = submission.studentRoll || submission.student?.rollNo;
                        const studentName = submission.studentName || submission.student?.name;
                        return (
                          <tr key={submission._id || submission.id || index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{studentRoll}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{studentName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {submission.submittedDate ? new Date(submission.submittedDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                submission.status === 'on_time' || submission.status === 'On Time' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {submission.status || 'Submitted'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="Marks"
                                value={gradingData[studentRoll]?.marks || ''}
                                onChange={(e) => updateGrading(studentRoll, 'marks', e.target.value)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                placeholder="Feedback (optional)"
                                value={gradingData[studentRoll]?.feedback || ''}
                                onChange={(e) => updateGrading(studentRoll, 'feedback', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Grading Cards */}
                <div className="md:hidden space-y-4">
                  {submissions.map((submission, index) => {
                    const studentRoll = submission.studentRoll || submission.student?.rollNo;
                    const studentName = submission.studentName || submission.student?.name;
                    return (
                      <div key={submission._id || submission.id || index} className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{studentName}</h4>
                            <p className="text-sm text-gray-600">{studentRoll}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            submission.status === 'on_time' || submission.status === 'On Time' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {submission.status || 'Submitted'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Submitted:</span> {submission.submittedDate ? new Date(submission.submittedDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marks *</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Enter marks"
                              value={gradingData[studentRoll]?.marks || ''}
                              onChange={(e) => updateGrading(studentRoll, 'marks', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (Optional)</label>
                            <textarea
                              rows={2}
                              placeholder="Enter feedback"
                              value={gradingData[studentRoll]?.feedback || ''}
                              onChange={(e) => updateGrading(studentRoll, 'feedback', e.target.value)}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowGradingModal(false)}
                    disabled={grading}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGrades}
                    disabled={grading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium disabled:opacity-50"
                  >
                    {grading ? 'Saving Grades...' : 'Save Grades'}
                  </button>
                </div>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AssignmentManagement;
