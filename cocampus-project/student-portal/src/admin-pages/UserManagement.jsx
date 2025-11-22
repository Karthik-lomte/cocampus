import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Eye,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  UserCheck,
  Home,
  ChefHat,
  Trophy,
  Key,
  Upload,
  Download,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const UserManagement = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: '', department: '', password: ''
  });
  const [passwordResetData, setPasswordResetData] = useState({
    newPassword: '',
    confirmPassword: '',
    generateRandom: true
  });

  const roles = [
    { value: 'student', label: 'Student', icon: GraduationCap, color: 'blue' },
    { value: 'faculty', label: 'Faculty', icon: Users, color: 'green' },
    { value: 'hod', label: 'HoD', icon: UserCheck, color: 'amber' },
    { value: 'principal', label: 'Principal', icon: Trophy, color: 'purple' },
    { value: 'warden', label: 'Hostel Warden', icon: Home, color: 'orange' },
    { value: 'canteen', label: 'Canteen Manager', icon: ChefHat, color: 'red' }
  ];

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology', 'Administration', 'Hostel', 'Canteen'];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }
      const data = await adminService.getUsers(params);
      setUsers(data.users || data || []);
    } catch (err) {
      console.error('Users error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.userId && user.userId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const generateUserId = (role) => {
    const prefixes = { student: 'STU', faculty: 'FAC', hod: 'HOD', principal: 'PRI', warden: 'WRD', canteen: 'CAN' };
    return `${prefixes[role]}${new Date().getFullYear()}${String(users.length + 1).padStart(3, '0')}`;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        password: formData.password
      };
      const newUser = await adminService.createUser(userData);
      toast.success(`User added successfully! User ID: ${newUser.userId || 'Generated'}`);
      await loadUsers();
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', role: '', department: '', password: '' });
    } catch (err) {
      console.error('Add user error:', err);
      toast.error(err.response?.data?.message || 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        department: formData.department
      };
      await adminService.updateUser(selectedUser.id, userData);
      toast.success('User updated successfully!');
      await loadUsers();
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Update user error:', err);
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        toast.success('User deleted successfully!');
        await loadUsers();
      } catch (err) {
        console.error('Delete user error:', err);
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const openPasswordResetModal = (user) => {
    setSelectedUser(user);
    setPasswordResetData({
      newPassword: '',
      confirmPassword: '',
      generateRandom: true
    });
    setShowPasswordResetModal(true);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    let newPassword = passwordResetData.newPassword;

    if (passwordResetData.generateRandom) {
      newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
    } else {
      if (passwordResetData.newPassword !== passwordResetData.confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      if (passwordResetData.newPassword.length < 8) {
        toast.error('Password must be at least 8 characters!');
        return;
      }
    }

    try {
      setSubmitting(true);
      await adminService.resetPassword(selectedUser.id, newPassword);
      toast.success(`Password reset successful for ${selectedUser.name}! New Password: ${newPassword}`, { duration: 8000 });
      setShowPasswordResetModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Password reset error:', err);
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkUploadFile) {
      toast.error('Please select a CSV file to upload');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('file', bulkUploadFile);
      const result = await adminService.bulkUploadUsers(formData);
      toast.success(`Bulk upload successful! ${result.count || 'Multiple'} users added.`);
      await loadUsers();
      setShowBulkUploadModal(false);
      setBulkUploadFile(null);
    } catch (err) {
      console.error('Bulk upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload users');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'Name,Email,Phone,Department,Roll Number,DOB,Guardian Name,Guardian Phone,Address\nJohn Doe,john@example.com,9876543210,Computer Science,CS2024001,2002-01-15,Mr. Doe,9876543211,123 Street Name';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, phone: user.phone, role: user.role, department: user.department, password: '' });
    setShowEditModal(true);
  };

  const getRoleIcon = (role) => {
    const roleData = roles.find(r => r.value === role);
    return roleData ? roleData.icon : Users;
  };

  const getRoleColor = (role) => {
    const colors = { student: 'blue', faculty: 'green', hod: 'amber', principal: 'purple', warden: 'orange', canteen: 'red' };
    return colors[role] || 'gray';
  };

  if (loading) return <Loading fullScreen message="Loading user management..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadUsers} fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all system users and their access</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkUploadModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {roles.map((role) => {
          const count = users.filter(u => u.role === role.value).length;
          const Icon = role.icon;
          return (
            <div key={role.value} className={`bg-${role.color}-50 rounded-lg p-4 text-center border border-${role.color}-100`}>
              <Icon className={`w-6 h-6 text-${role.color}-600 mx-auto mb-2`} />
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-600">{role.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">User ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Department</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Contact</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const Icon = getRoleIcon(user.role);
                const color = getRoleColor(user.role);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-${color}-100 rounded-lg`}>
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{user.userId}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700 capitalize`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openPasswordResetModal(user)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
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
      </div>

      {/* Add User Modal */}
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
                  <h2 className="text-xl font-semibold">Add New User</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddUser} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select role</option>
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
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
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Password *</label>
                    <input
                      type="text"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Set initial password"
                    />
                  </div>
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
                    {submitting ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
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
                  <h2 className="text-xl font-semibold">Edit User</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleEditUser} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
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

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {showBulkUploadModal && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Bulk Upload Students</h2>
                  <button onClick={() => setShowBulkUploadModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleBulkUpload} className="p-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Download Template First</p>
                      <p className="text-sm text-green-600">Use our CSV template for correct format</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV Template
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drag and drop your CSV file here, or</p>
                    <input
                      type="file"
                      accept=".csv"
                      required
                      className="hidden"
                      id="csvUpload"
                      onChange={(e) => setBulkUploadFile(e.target.files[0])}
                    />
                    {bulkUploadFile && (
                      <p className="mt-2 text-sm text-gray-600">Selected: {bulkUploadFile.name}</p>
                    )}
                    <label
                      htmlFor="csvUpload"
                      className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer hover:bg-indigo-200 transition-colors"
                    >
                      Browse Files
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> The system will automatically generate User IDs and initial passwords for all students. Credentials will be sent to their email addresses.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBulkUploadModal(false)}
                    disabled={submitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Uploading...' : 'Upload & Process'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showPasswordResetModal && selectedUser && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Reset Password</h2>
                  <button onClick={() => setShowPasswordResetModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handlePasswordReset} className="p-6 space-y-4">
                {/* User Profile Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 bg-${getRoleColor(selectedUser.role)}-100 rounded-lg`}>
                      {React.createElement(getRoleIcon(selectedUser.role), { className: `w-5 h-5 text-${getRoleColor(selectedUser.role)}-600` })}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedUser.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{selectedUser.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">User ID</p>
                      <p className="font-mono text-gray-900">{selectedUser.userId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Department</p>
                      <p className="text-gray-900">{selectedUser.department}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-gray-900 text-xs">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="text-gray-900">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Password Reset Options */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resetType"
                      checked={passwordResetData.generateRandom}
                      onChange={() => setPasswordResetData({ ...passwordResetData, generateRandom: true })}
                      className="text-amber-600"
                    />
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Generate random password</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="resetType"
                      checked={!passwordResetData.generateRandom}
                      onChange={() => setPasswordResetData({ ...passwordResetData, generateRandom: false })}
                      className="text-amber-600"
                    />
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Set manual password</span>
                    </div>
                  </label>
                </div>

                {!passwordResetData.generateRandom && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={passwordResetData.newPassword}
                        onChange={(e) => setPasswordResetData({ ...passwordResetData, newPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Min 8 characters"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        value={passwordResetData.confirmPassword}
                        onChange={(e) => setPasswordResetData({ ...passwordResetData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordResetModal(false)}
                    disabled={submitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Resetting...' : 'Reset Password'}
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

export default UserManagement;
