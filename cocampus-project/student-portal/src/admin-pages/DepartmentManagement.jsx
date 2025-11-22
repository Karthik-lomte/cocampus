import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Users,
  GraduationCap,
  UserCheck
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const DepartmentManagement = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    yearEstablished: '',
    email: '',
    phone: '',
    location: '',
    vision: '',
    mission: ''
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDepartments();
      setDepartments(data.departments || data || []);
    } catch (err) {
      console.error('Departments error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const totalFaculty = departments.reduce((sum, dept) => sum + (dept.facultyCount || 0), 0);
  const totalStudents = departments.reduce((sum, dept) => sum + (dept.studentCount || 0), 0);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.hod && dept.hod.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const deptData = {
        name: formData.name,
        code: formData.code,
        yearEstablished: parseInt(formData.yearEstablished),
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        vision: formData.vision,
        mission: formData.mission
      };
      await adminService.createDepartment(deptData);
      toast.success('Department added successfully!');
      await loadDepartments();
      setShowAddModal(false);
      setFormData({
        name: '',
        code: '',
        yearEstablished: '',
        email: '',
        phone: '',
        location: '',
        vision: '',
        mission: ''
      });
    } catch (err) {
      console.error('Add department error:', err);
      toast.error(err.response?.data?.message || 'Failed to add department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const deptData = {
        name: formData.name,
        code: formData.code,
        yearEstablished: parseInt(formData.yearEstablished),
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        vision: formData.vision,
        mission: formData.mission
      };
      await adminService.updateDepartment(selectedDepartment.id, deptData);
      toast.success('Department updated successfully!');
      await loadDepartments();
      setShowEditModal(false);
      setSelectedDepartment(null);
    } catch (err) {
      console.error('Update department error:', err);
      toast.error(err.response?.data?.message || 'Failed to update department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    if (dept && ((dept.studentCount || 0) > 0 || (dept.facultyCount || 0) > 0)) {
      toast.error('Cannot delete department with active students or faculty. Please reassign them first.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await adminService.deleteDepartment(deptId);
        toast.success('Department deleted successfully!');
        await loadDepartments();
      } catch (err) {
        console.error('Delete department error:', err);
        toast.error(err.response?.data?.message || 'Failed to delete department');
      }
    }
  };

  const openEditModal = (dept) => {
    setSelectedDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      yearEstablished: dept.yearEstablished.toString(),
      email: dept.email || '',
      phone: dept.phone || '',
      location: dept.location || '',
      vision: dept.vision || '',
      mission: dept.mission || ''
    });
    setShowEditModal(true);
  };

  if (loading) return <Loading fullScreen message="Loading department management..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadDepartments} fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Department Management</h1>
        <p className="text-indigo-100">Manage academic departments and their resources</p>
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
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
              <p className="text-xs text-green-600 mt-1">All active</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Building2 className="w-6 h-6 text-indigo-600" />
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
              <p className="text-sm text-gray-600">Total Faculty</p>
              <p className="text-3xl font-bold text-gray-900">{totalFaculty}</p>
              <p className="text-xs text-blue-600 mt-1">Across all departments</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">Currently enrolled</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Department
        </button>
      </div>

      {/* Departments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Department</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Code</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">HOD</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Faculty</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Students</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Performance</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-500">Est. {dept.yearEstablished}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-mono">
                      {dept.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{dept.hod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{dept.facultyCount}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{dept.studentCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div
                          className={`h-2 rounded-full ${
                            dept.performance >= 85 ? 'bg-green-500' :
                            dept.performance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${dept.performance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{dept.performance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openEditModal(dept)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Department Modal */}
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
                  <h2 className="text-xl font-semibold">Add New Department</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddDepartment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Computer Science Engineering"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., CSE"
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Established *</label>
                  <input
                    type="number"
                    required
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    placeholder="e.g., 1995"
                    min={1900}
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., cse@university.edu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +91-9876543210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Block A, Room 101-120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vision *</label>
                  <textarea
                    required
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    placeholder="Enter department vision statement..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission *</label>
                  <textarea
                    required
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    placeholder="Enter department mission statement..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={submitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Adding...' : 'Add Department'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Department Modal */}
      <AnimatePresence>
        {showEditModal && selectedDepartment && (
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
                  <h2 className="text-xl font-semibold">Edit Department</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleEditDepartment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Established *</label>
                  <input
                    type="number"
                    required
                    value={formData.yearEstablished}
                    onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                    min={1900}
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vision *</label>
                  <textarea
                    required
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission *</label>
                  <textarea
                    required
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={submitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
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

export default DepartmentManagement;
