import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Filter,
  FlaskConical,
  BookText,
  ListChecks,
  Building2,
  Hash,
  Star
} from 'lucide-react';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, code: 'CS101', name: 'Introduction to Programming', credits: 4, type: 'Theory', department: 'Computer Science', semester: 1 },
    { id: 2, code: 'CS102', name: 'Data Structures', credits: 4, type: 'Theory', department: 'Computer Science', semester: 2 },
    { id: 3, code: 'CS103L', name: 'Programming Lab', credits: 2, type: 'Lab', department: 'Computer Science', semester: 1 },
    { id: 4, code: 'CS201', name: 'Database Management Systems', credits: 4, type: 'Theory', department: 'Computer Science', semester: 3 },
    { id: 5, code: 'CS202L', name: 'DBMS Lab', credits: 2, type: 'Lab', department: 'Computer Science', semester: 3 },
    { id: 6, code: 'CS301E', name: 'Machine Learning', credits: 3, type: 'Elective', department: 'Computer Science', semester: 5 },
    { id: 7, code: 'EC101', name: 'Basic Electronics', credits: 4, type: 'Theory', department: 'Electronics', semester: 1 },
    { id: 8, code: 'EC102L', name: 'Electronics Lab', credits: 2, type: 'Lab', department: 'Electronics', semester: 1 },
    { id: 9, code: 'EC201', name: 'Digital Signal Processing', credits: 4, type: 'Theory', department: 'Electronics', semester: 4 },
    { id: 10, code: 'EC301E', name: 'VLSI Design', credits: 3, type: 'Elective', department: 'Electronics', semester: 6 },
    { id: 11, code: 'ME101', name: 'Engineering Mechanics', credits: 4, type: 'Theory', department: 'Mechanical', semester: 1 },
    { id: 12, code: 'ME102L', name: 'Workshop Practice', credits: 2, type: 'Lab', department: 'Mechanical', semester: 1 },
    { id: 13, code: 'ME201', name: 'Thermodynamics', credits: 4, type: 'Theory', department: 'Mechanical', semester: 3 },
    { id: 14, code: 'CE101', name: 'Surveying', credits: 4, type: 'Theory', department: 'Civil', semester: 2 },
    { id: 15, code: 'CE201E', name: 'Environmental Engineering', credits: 3, type: 'Elective', department: 'Civil', semester: 5 },
    { id: 16, code: 'IT101', name: 'Web Technologies', credits: 4, type: 'Theory', department: 'Information Technology', semester: 3 },
    { id: 17, code: 'IT102L', name: 'Web Development Lab', credits: 2, type: 'Lab', department: 'Information Technology', semester: 3 },
    { id: 18, code: 'MATH101', name: 'Engineering Mathematics I', credits: 4, type: 'Theory', department: 'Mathematics', semester: 1 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({
    code: '', name: '', credits: '', type: '', department: '', semester: ''
  });

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology', 'Mathematics', 'Physics', 'Chemistry'];
  const subjectTypes = ['Theory', 'Lab', 'Elective'];

  const theoryCount = subjects.filter(s => s.type === 'Theory').length;
  const labCount = subjects.filter(s => s.type === 'Lab').length;
  const electiveCount = subjects.filter(s => s.type === 'Elective').length;

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || subject.department === departmentFilter;
    const matchesType = typeFilter === 'all' || subject.type === typeFilter;
    return matchesSearch && matchesDepartment && matchesType;
  });

  const handleAddSubject = (e) => {
    e.preventDefault();
    const newSubject = {
      id: subjects.length + 1,
      code: formData.code,
      name: formData.name,
      credits: parseInt(formData.credits),
      type: formData.type,
      department: formData.department,
      semester: parseInt(formData.semester)
    };
    setSubjects([...subjects, newSubject]);
    setShowAddModal(false);
    setFormData({ code: '', name: '', credits: '', type: '', department: '', semester: '' });
    alert('Subject added successfully!');
  };

  const handleEditSubject = (e) => {
    e.preventDefault();
    setSubjects(subjects.map(subject =>
      subject.id === selectedSubject.id
        ? {
            ...subject,
            code: formData.code,
            name: formData.name,
            credits: parseInt(formData.credits),
            type: formData.type,
            department: formData.department,
            semester: parseInt(formData.semester)
          }
        : subject
    ));
    setShowEditModal(false);
    setSelectedSubject(null);
    alert('Subject updated successfully!');
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== subjectId));
      alert('Subject deleted successfully!');
    }
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      credits: subject.credits.toString(),
      type: subject.type,
      department: subject.department,
      semester: subject.semester.toString()
    });
    setShowEditModal(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Theory': return BookText;
      case 'Lab': return FlaskConical;
      case 'Elective': return Star;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Theory': return 'blue';
      case 'Lab': return 'green';
      case 'Elective': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Subject Management</h1>
        <p className="text-indigo-100">Manage courses, credits, and department assignments</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subjects</p>
              <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
              <p className="text-xs text-green-600 mt-1">Active curriculum</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-600" />
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
              <p className="text-sm text-gray-600">Theory</p>
              <p className="text-3xl font-bold text-gray-900">{theoryCount}</p>
              <p className="text-xs text-blue-600 mt-1">Core subjects</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookText className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Lab</p>
              <p className="text-3xl font-bold text-gray-900">{labCount}</p>
              <p className="text-xs text-green-600 mt-1">Practical sessions</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FlaskConical className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Electives</p>
              <p className="text-3xl font-bold text-gray-900">{electiveCount}</p>
              <p className="text-xs text-purple-600 mt-1">Optional subjects</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {subjectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Subjects Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Code</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Subject Name</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Credits</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Department</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Semester</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubjects.map((subject) => {
                const TypeIcon = getTypeIcon(subject.type);
                const typeColor = getTypeColor(subject.type);
                return (
                  <tr key={subject.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-mono">
                        {subject.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-${typeColor}-100 rounded-lg`}>
                          <TypeIcon className={`w-4 h-4 text-${typeColor}-600`} />
                        </div>
                        <span className="font-medium text-gray-900">{subject.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {subject.credits}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${typeColor}-100 text-${typeColor}-700`}>
                        {subject.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{subject.department}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      Sem {subject.semester}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(subject)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredSubjects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No subjects found matching your criteria</p>
          </div>
        )}
      </motion.div>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {showAddModal && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Add New Subject</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddSubject} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., CS101"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits *</label>
                    <input
                      type="number"
                      required
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                      placeholder="e.g., 4"
                      min={1}
                      max={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Introduction to Programming"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      {subjectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Subject
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Subject Modal */}
      <AnimatePresence>
        {showEditModal && selectedSubject && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Edit Subject</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleEditSubject} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits *</label>
                    <input
                      type="number"
                      required
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                      min={1}
                      max={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {subjectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectManagement;
