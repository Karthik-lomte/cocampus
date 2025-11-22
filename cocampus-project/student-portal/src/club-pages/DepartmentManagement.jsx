import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Building2, Edit2, Trash2, X, Users, TrendingUp } from 'lucide-react';
import { clubService } from '../services/clubService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function DepartmentManagement() {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [clubInfo, setClubInfo] = useState({ totalMembers: 0 });
  const [departmentFormData, setDepartmentFormData] = useState({
    name: '',
    head: '',
    description: ''
  });

  // Load Departments
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clubService.getDepartments();
      setDepartments(data.departments || data || []);
      setClubInfo(data.clubInfo || { totalMembers: 0 });
    } catch (err) {
      console.error('Error loading departments:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await clubService.addDepartment(departmentFormData);
      toast.success(`Department "${departmentFormData.name}" added successfully!`);
      setShowAddDepartmentModal(false);
      setDepartmentFormData({ name: '', head: '', description: '' });
      await loadDepartments();
    } catch (err) {
      console.error('Error adding department:', err);
      toast.error(err.response?.data?.message || 'Failed to add department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDepartment = (dept) => {
    setSelectedDepartment(dept);
    setDepartmentFormData({
      name: dept.name,
      head: dept.head,
      description: dept.description || ''
    });
    setShowEditDepartmentModal(true);
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await clubService.updateDepartment(selectedDepartment.id, departmentFormData);
      toast.success(`Department "${departmentFormData.name}" updated successfully!`);
      setShowEditDepartmentModal(false);
      setSelectedDepartment(null);
      setDepartmentFormData({ name: '', head: '', description: '' });
      await loadDepartments();
    } catch (err) {
      console.error('Error updating department:', err);
      toast.error(err.response?.data?.message || 'Failed to update department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDepartment = async (dept) => {
    if (dept.members > 0) {
      toast.error(`Cannot delete "${dept.name}" department. It has ${dept.members} active members. Please reassign or remove members first.`);
      return;
    }
    if (window.confirm(`Are you sure you want to remove the "${dept.name}" department?`)) {
      try {
        await clubService.deleteDepartment(dept.id);
        toast.success(`"${dept.name}" department has been removed.`);
        await loadDepartments();
      } catch (err) {
        console.error('Error removing department:', err);
        toast.error(err.response?.data?.message || 'Failed to remove department');
      }
    }
  };

  const getDepartmentMemberCount = (deptName) => {
    const dept = departments.find(d => d.name === deptName);
    return dept?.members || 0;
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading departments..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadDepartments} fullScreen />;
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
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage club departments and their heads</p>
        </div>
        <button
          onClick={() => setShowAddDepartmentModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          Add Department
        </button>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Departments</p>
              <p className="text-4xl font-bold mt-2">{departments.length}</p>
            </div>
            <Building2 size={48} className="text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Members</p>
              <p className="text-4xl font-bold mt-2">{clubInfo.totalMembers || 0}</p>
            </div>
            <Users size={48} className="text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Members/Dept</p>
              <p className="text-4xl font-bold mt-2">
                {departments.length > 0 ? Math.round((clubInfo.totalMembers || 0) / departments.length) : 0}
              </p>
            </div>
            <TrendingUp size={48} className="text-green-200" />
          </div>
        </motion.div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md border-2 border-gray-200 hover:border-purple-300 transition-all overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b-2 border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  {dept.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-600">Department</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Department Head:</span>
                  <span className="font-semibold text-gray-900">{dept.head}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Members:</span>
                  <span className="flex items-center gap-1 font-semibold text-purple-600">
                    <Users size={16} />
                    {getDepartmentMemberCount(dept.name)}
                  </span>
                </div>
                {dept.description && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">{dept.description}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditDepartment(dept)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveDepartment(dept)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {departments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-md p-12 text-center"
        >
          <Building2 size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Departments Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your first department to organize club members</p>
          <button
            onClick={() => setShowAddDepartmentModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add First Department
          </button>
        </motion.div>
      )}

      {/* Add Department Modal */}
      <AnimatePresence>
        {showAddDepartmentModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddDepartmentModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Add New Department</h2>
                    <p className="text-purple-100 text-sm mt-1">Create a new department for your club</p>
                  </div>
                  <button
                    onClick={() => setShowAddDepartmentModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleAddDepartment} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={departmentFormData.name}
                      onChange={(e) => setDepartmentFormData({ ...departmentFormData, name: e.target.value })}
                      placeholder="e.g., Technical, Marketing, Design"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Head *
                    </label>
                    <input
                      type="text"
                      required
                      value={departmentFormData.head}
                      onChange={(e) => setDepartmentFormData({ ...departmentFormData, head: e.target.value })}
                      placeholder="Enter department head name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={departmentFormData.description}
                      onChange={(e) => setDepartmentFormData({ ...departmentFormData, description: e.target.value })}
                      rows={3}
                      placeholder="Brief description of this department's responsibilities"
                      maxLength={200}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {departmentFormData.description.length}/200 characters
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddDepartmentModal(false)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Adding...' : 'Add Department'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Department Modal */}
      <AnimatePresence>
        {showEditDepartmentModal && selectedDepartment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditDepartmentModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Edit Department</h2>
                    <p className="text-blue-100 text-sm mt-1">Update department details</p>
                  </div>
                  <button
                    onClick={() => setShowEditDepartmentModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleUpdateDepartment} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={departmentFormData.name}
                      onChange={(e) => setDepartmentFormData({ ...departmentFormData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Head *
                    </label>
                    <input
                      type="text"
                      required
                      value={departmentFormData.head}
                      onChange={(e) => setDepartmentFormData({ ...departmentFormData, head: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={departmentFormData.description}
                      onChange={(e) => setDepartmentFormData({ ...departmentFormData, description: e.target.value })}
                      rows={3}
                      maxLength={200}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {departmentFormData.description.length}/200 characters
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> This department has {getDepartmentMemberCount(selectedDepartment.name)} active members.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditDepartmentModal(false)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Updating...' : 'Update Department'}
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

export default DepartmentManagement;
