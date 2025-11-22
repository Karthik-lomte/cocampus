import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Search, Filter, Eye, Edit, Mail,
  Phone, Award, BookOpen, Calendar, X, UserPlus
} from 'lucide-react';
import { hodService } from '../services/hodService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function FacultyManagement() {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Faculty Data
  const [facultyList, setFacultyList] = useState([]);

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    subjects: [],
    classes: []
  });

  const availableSubjects = [
    'Data Structures', 'Algorithms', 'Database Management', 'SQL',
    'Operating Systems', 'Linux', 'Computer Networks', 'Network Security',
    'Artificial Intelligence', 'Machine Learning', 'Web Technologies', 'JavaScript'
  ];

  const availableClasses = ['CSE-2A', 'CSE-2B', 'CSE-3A', 'CSE-3B', 'CSE-4A', 'CSE-4B'];

  // Load Faculty Data
  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hodService.getFaculty();
      setFacultyList(data.facultyList || data || []);
    } catch (err) {
      console.error('Error loading faculty:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = facultyList.filter(faculty => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.subjects.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || faculty.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      present: 'bg-green-100 text-green-700',
      'on-leave': 'bg-orange-100 text-orange-700',
      absent: 'bg-red-100 text-red-700'
    };
    return styles[status] || styles.present;
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 18) return 'text-red-600 bg-red-50';
    if (workload >= 15) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const handleViewDetails = (faculty) => {
    setSelectedFaculty(faculty);
    setShowDetailsModal(true);
  };

  const handleAssignSubjects = (faculty) => {
    setSelectedFaculty(faculty);
    setAssignmentData({
      subjects: faculty.subjects || [],
      classes: faculty.classes || []
    });
    setShowAssignModal(true);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();

    if (assignmentData.subjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }
    if (assignmentData.classes.length === 0) {
      toast.error('Please select at least one class');
      return;
    }

    try {
      setSubmitting(true);
      const subjectData = {
        subjects: assignmentData.subjects,
        classes: assignmentData.classes
      };
      await hodService.assignSubject(selectedFaculty.id, subjectData);
      toast.success(`Successfully assigned ${assignmentData.subjects.length} subject(s) and ${assignmentData.classes.length} class(es) to ${selectedFaculty.name}`);
      await loadFaculty();
      setShowAssignModal(false);
    } catch (err) {
      console.error('Error assigning subjects:', err);
      toast.error(err.response?.data?.message || 'Failed to assign subjects and classes');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSubject = (subject) => {
    setAssignmentData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const toggleClass = (cls) => {
    setAssignmentData(prev => ({
      ...prev,
      classes: prev.classes.includes(cls)
        ? prev.classes.filter(c => c !== cls)
        : [...prev.classes, cls]
    }));
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading faculty management..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadFaculty} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-600 mt-1">
            Manage faculty members and subject allocation
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-shadow">
          <UserPlus size={20} />
          Add Faculty
        </button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, ID, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="on-leave">On Leave</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Faculty List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workload</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFaculty.map((faculty, index) => (
                <motion.tr
                  key={faculty.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {faculty.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{faculty.name}</p>
                      <p className="text-xs text-gray-500">{faculty.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {faculty.designation}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {faculty.subjects.map((subject, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWorkloadColor(faculty.workload)}`}>
                      {faculty.workload} hrs
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(faculty.status)}`}>
                      {faculty.status === 'on-leave' ? 'On Leave' : faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(faculty)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} className="text-green-600" />
                      </button>
                      <button
                        onClick={() => handleAssignSubjects(faculty)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Assign Subjects"
                      >
                        <BookOpen size={18} className="text-green-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredFaculty.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{faculty.name}</h3>
                  <p className="text-sm text-gray-600">{faculty.id}</p>
                  <p className="text-sm text-gray-600">{faculty.designation}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(faculty.status)}`}>
                  {faculty.status === 'on-leave' ? 'On Leave' : faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex flex-wrap gap-1">
                  {faculty.subjects.map((subject, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Workload: <span className={`font-semibold ${getWorkloadColor(faculty.workload).split(' ')[0]}`}>
                    {faculty.workload} hours
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(faculty)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <Eye size={16} className="inline mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleAssignSubjects(faculty)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <BookOpen size={16} className="inline mr-1" />
                  Assign
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedFaculty && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Faculty Details</h2>
                    <p className="text-green-100 text-sm mt-1">{selectedFaculty.name}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Employee ID</p>
                      <p className="font-semibold text-gray-900">{selectedFaculty.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-semibold text-gray-900">{selectedFaculty.designation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Qualification</p>
                      <p className="font-semibold text-gray-900">{selectedFaculty.qualification}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-semibold text-gray-900">{selectedFaculty.experience}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Contact Information</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Mail size={16} className="text-green-600" />
                        <span>{selectedFaculty.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone size={16} className="text-green-600" />
                        <span>{selectedFaculty.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Assigned Subjects</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFaculty.subjects.map((subject, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Assigned Classes</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedFaculty.classes.map((cls, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Workload</p>
                    <p className={`text-lg font-bold ${getWorkloadColor(selectedFaculty.workload).split(' ')[0]}`}>
                      {selectedFaculty.workload} hours/week
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Assignment Modal */}
      <AnimatePresence>
        {showAssignModal && selectedFaculty && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAssignModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Assign Subjects & Classes</h2>
                    <p className="text-green-100 text-sm mt-1">{selectedFaculty.name}</p>
                  </div>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmitAssignment} className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Subjects Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Subjects * ({assignmentData.subjects.length} selected)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSubjects.map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => toggleSubject(subject)}
                          className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            assignmentData.subjects.includes(subject)
                              ? 'bg-green-100 text-green-700 border-2 border-green-600'
                              : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Classes Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Classes * ({assignmentData.classes.length} selected)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {availableClasses.map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => toggleClass(cls)}
                          className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            assignmentData.classes.includes(cls)
                              ? 'bg-teal-100 text-teal-700 border-2 border-teal-600'
                              : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {(assignmentData.subjects.length > 0 || assignmentData.classes.length > 0) && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Assignment Summary:</p>
                      <p className="text-sm text-gray-600">
                        {assignmentData.subjects.length} subject(s) and {assignmentData.classes.length} class(es) will be assigned to {selectedFaculty.name}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowAssignModal(false)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Saving...' : 'Save Assignment'}
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

export default FacultyManagement;
