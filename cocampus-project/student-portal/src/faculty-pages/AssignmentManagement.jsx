import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload, Eye, CheckCircle, Clock, FileText, X, Download, User, Edit2, Lock, Unlock } from 'lucide-react';
import { facultyAssignmentsData } from '../faculty-data/assignmentsData';
import { facultyData } from '../faculty-data/facultyData';
import { studentsData } from '../faculty-data/studentsData';

function AssignmentManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [gradingData, setGradingData] = useState({});
  const [submissionStatuses, setSubmissionStatuses] = useState({});
  const [assignmentSubmissionControl, setAssignmentSubmissionControl] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    description: '',
    dueDate: '',
    maxMarks: '',
    lateSubmission: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Assignment created successfully!');
    setShowCreateForm(false);
    setFormData({
      title: '',
      subject: '',
      class: '',
      description: '',
      dueDate: '',
      maxMarks: '',
      lateSubmission: false
    });
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissions(true);
    // Initialize submission statuses
    const initialStatuses = {};
    const submissions = generateSubmissions(assignment);
    submissions.forEach(submission => {
      initialStatuses[submission.studentRoll] = submission.status;
    });
    setSubmissionStatuses(initialStatuses);
  };

  const handleStatusChange = (rollNo, newStatus) => {
    setSubmissionStatuses(prev => ({
      ...prev,
      [rollNo]: newStatus
    }));
    // This would typically sync with the backend and update student view
    alert(`Submission status updated to "${newStatus}" for student ${rollNo}. This will be reflected in student portal.`);
  };

  const handleToggleSubmission = (assignmentId) => {
    const currentStatus = assignmentSubmissionControl[assignmentId] !== false; // Default is true (active)
    const newStatus = !currentStatus;

    setAssignmentSubmissionControl(prev => ({
      ...prev,
      [assignmentId]: newStatus
    }));

    const statusText = newStatus ? 'ACTIVE' : 'INACTIVE';
    const message = newStatus
      ? `Submission is now ACTIVE. Students can submit this assignment.`
      : `Submission is now INACTIVE. Students cannot submit this assignment.`;

    alert(message);
  };

  const isSubmissionActive = (assignmentId) => {
    // Default is true (active) if not set
    return assignmentSubmissionControl[assignmentId] !== false;
  };

  const handleGradeNow = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowGradingModal(true);
    // Initialize grading data for all pending submissions
    const initialGradingData = {};
    const pendingSubmissions = generatePendingSubmissions(evaluation);
    pendingSubmissions.forEach(submission => {
      initialGradingData[submission.studentRoll] = {
        marks: '',
        feedback: ''
      };
    });
    setGradingData(initialGradingData);
  };

  const handleSaveGrades = () => {
    // Count how many students were graded
    const gradedCount = Object.values(gradingData).filter(data => data.marks !== '').length;
    if (gradedCount === 0) {
      alert('Please grade at least one student before saving.');
      return;
    }
    alert(`Successfully graded ${gradedCount} student(s)!`);
    setShowGradingModal(false);
    setSelectedEvaluation(null);
    setGradingData({});
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
      expired: 'bg-red-100 text-red-700'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.toUpperCase()}
    </span>;
  };

  // Generate mock submissions based on assignment
  const generateSubmissions = (assignment) => {
    const classStudents = studentsData[assignment.class] || [];
    return classStudents.slice(0, assignment.submittedCount).map((student, index) => ({
      studentName: student.name,
      studentRoll: student.rollNo,
      submittedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.5 ? 'On Time' : 'Late',
      marksObtained: Math.random() > 0.5 ? Math.floor(Math.random() * assignment.maxMarks) : null
    }));
  };

  // Generate pending submissions for grading
  const generatePendingSubmissions = (evaluation) => {
    const classStudents = studentsData[evaluation.class] || [];
    return classStudents.slice(0, evaluation.pendingCount).map((student, index) => ({
      studentName: student.name,
      studentRoll: student.rollNo,
      submittedDate: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.7 ? 'On Time' : 'Late'
    }));
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
                  {facultyData.assignedSubjects.map(subject => (
                    <option key={subject.code} value={subject.code}>{subject.name}</option>
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
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                Create Assignment
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
          {facultyAssignmentsData.createdAssignments.map((assignment, index) => (
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
                      <p className="text-sm text-gray-600">{assignment.subject} • {assignment.class}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    <span>Max Marks: {assignment.maxMarks}</span>
                    <span>Submitted: {assignment.submittedCount}/{assignment.totalStudents}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {getStatusBadge(assignment.status)}

                  {/* Submission Control Toggle */}
                  <button
                    onClick={() => handleToggleSubmission(assignment.id)}
                    className={`px-4 py-2 text-white text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${
                      isSubmissionActive(assignment.id)
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg'
                        : 'bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-lg'
                    }`}
                  >
                    {isSubmissionActive(assignment.id) ? (
                      <>
                        <Unlock size={16} />
                        Active
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Inactive
                      </>
                    )}
                  </button>

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
          ))}
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
          {facultyAssignmentsData.pendingEvaluations.map((item, index) => (
            <motion.div
              key={item.assignmentId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.class}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="text-green-600">Evaluated: {item.evaluatedCount}</span>
                  <span className="text-orange-600">Pending: {item.pendingCount}</span>
                </div>
              </div>
              <button
                onClick={() => handleGradeNow(item)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Grade Now
              </button>
            </motion.div>
          ))}
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
                        {generateSubmissions(selectedAssignment).map((submission, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{submission.studentRoll}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{submission.studentName}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(submission.submittedDate).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={submissionStatuses[submission.studentRoll] || submission.status}
                                onChange={(e) => handleStatusChange(submission.studentRoll, e.target.value)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium border-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {submission.marksObtained !== null ? (
                                <span className="font-semibold text-green-600">
                                  {submission.marksObtained}/{selectedAssignment.maxMarks}
                                </span>
                              ) : (
                                <span className="text-gray-400">Not Graded</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-green-600 hover:text-green-700 flex items-center gap-1">
                                <Download size={16} />
                                <span className="text-sm">Download</span>
                              </button>
                            </td>
                          </tr>
                        ))}
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
                      {generatePendingSubmissions(selectedEvaluation).map((submission, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{submission.studentRoll}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{submission.studentName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(submission.submittedDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              submission.status === 'On Time' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Marks"
                              value={gradingData[submission.studentRoll]?.marks || ''}
                              onChange={(e) => updateGrading(submission.studentRoll, 'marks', e.target.value)}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              placeholder="Feedback (optional)"
                              value={gradingData[submission.studentRoll]?.feedback || ''}
                              onChange={(e) => updateGrading(submission.studentRoll, 'feedback', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Grading Cards */}
                <div className="md:hidden space-y-4">
                  {generatePendingSubmissions(selectedEvaluation).map((submission, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900">{submission.studentName}</h4>
                          <p className="text-sm text-gray-600">{submission.studentRoll}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.status === 'On Time' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Submitted:</span> {new Date(submission.submittedDate).toLocaleDateString()}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Marks *</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter marks"
                            value={gradingData[submission.studentRoll]?.marks || ''}
                            onChange={(e) => updateGrading(submission.studentRoll, 'marks', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (Optional)</label>
                          <textarea
                            rows={2}
                            placeholder="Enter feedback"
                            value={gradingData[submission.studentRoll]?.feedback || ''}
                            onChange={(e) => updateGrading(submission.studentRoll, 'feedback', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowGradingModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveGrades}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                  >
                    Save Grades
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
