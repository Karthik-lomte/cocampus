import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server, Monitor, Wrench, DollarSign, TrendingUp,
  AlertCircle, CheckCircle, Settings, Package, Edit2, X
} from 'lucide-react';
import { hodService } from '../services/hodService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function ResourceManagement() {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Resources Data
  const [resources, setResources] = useState({
    laboratories: [],
    equipment: [],
    budgetAllocation: {
      total: 0,
      utilized: 0,
      pending: 0,
      categories: []
    }
  });

  // UI States
  const [viewType, setViewType] = useState('labs');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState(''); // 'lab', 'equipment', 'budget'
  const [editData, setEditData] = useState(null);

  // Load Resources
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hodService.getResources();
      setResources(data.resources || data || {
        laboratories: [],
        equipment: [],
        budgetAllocation: {
          total: 0,
          utilized: 0,
          pending: 0,
          categories: []
        }
      });
    } catch (err) {
      console.error('Error loading resources:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'excellent': 'bg-green-100 text-green-700',
      'good': 'bg-blue-100 text-blue-700',
      'needs-attention': 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.good;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'excellent': CheckCircle,
      'good': CheckCircle,
      'needs-attention': AlertCircle
    };
    const Icon = icons[status] || CheckCircle;
    return Icon;
  };

  const handleEditLab = (lab) => {
    setEditType('lab');
    setEditData({
      ...lab,
      software: lab.software.join(', ')
    });
    setShowEditModal(true);
  };

  const handleEditEquipment = (equipment) => {
    setEditType('equipment');
    setEditData({ ...equipment });
    setShowEditModal(true);
  };

  const handleEditBudget = (category) => {
    setEditType('budget');
    setEditData({ ...category });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // Prepare data based on edit type
      let updateData = { ...editData };
      if (editType === 'lab' && typeof editData.software === 'string') {
        updateData.software = editData.software.split(',').map(s => s.trim());
      }

      await hodService.updateResource(editData.id, {
        type: editType,
        data: updateData
      });

      toast.success(`${editType.charAt(0).toUpperCase() + editType.slice(1)} updated successfully!`);
      await loadResources();
      setShowEditModal(false);
      setEditData(null);
    } catch (err) {
      console.error('Error updating resource:', err);
      toast.error(err.response?.data?.message || `Failed to update ${editType}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFieldChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Null-safe calculations
  const totalSystems = resources.laboratories?.reduce((sum, lab) => sum + (lab.systems || 0), 0) || 0;
  const functionalSystems = resources.laboratories?.reduce((sum, lab) => sum + (lab.functional || 0), 0) || 0;
  const functionalPercentage = totalSystems > 0 ? ((functionalSystems / totalSystems) * 100).toFixed(1) : '0.0';

  const budgetUtilizedPercentage = resources.budgetAllocation?.total > 0
    ? ((resources.budgetAllocation.utilized / resources.budgetAllocation.total) * 100).toFixed(1)
    : '0.0';

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading resource management..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadResources} fullScreen />;
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
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600 mt-1">
            Manage laboratories, equipment, and budget allocation
          </p>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Server size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <p className="text-blue-100 text-sm">Total Systems</p>
          <p className="text-4xl font-bold mt-2">{totalSystems}</p>
          <p className="text-sm text-blue-100 mt-1">{functionalSystems} functional</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Monitor size={32} />
            <CheckCircle size={24} className="opacity-75" />
          </div>
          <p className="text-green-100 text-sm">System Health</p>
          <p className="text-4xl font-bold mt-2">{functionalPercentage}%</p>
          <p className="text-sm text-green-100 mt-1">All systems</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <p className="text-purple-100 text-sm">Budget Utilized</p>
          <p className="text-4xl font-bold mt-2">{budgetUtilizedPercentage}%</p>
          <p className="text-sm text-purple-100 mt-1">₹{(resources.budgetAllocation.utilized / 100000).toFixed(1)}L / ₹{(resources.budgetAllocation.total / 100000).toFixed(1)}L</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Wrench size={32} />
            <AlertCircle size={24} className="opacity-75" />
          </div>
          <p className="text-orange-100 text-sm">Under Maintenance</p>
          <p className="text-4xl font-bold mt-2">{totalSystems - functionalSystems}</p>
          <p className="text-sm text-orange-100 mt-1">Equipment items</p>
        </motion.div>
      </div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-2 flex gap-2 overflow-x-auto"
      >
        <button
          onClick={() => setViewType('labs')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            viewType === 'labs'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Laboratories
        </button>
        <button
          onClick={() => setViewType('equipment')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            viewType === 'equipment'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Equipment
        </button>
        <button
          onClick={() => setViewType('budget')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            viewType === 'budget'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Budget Allocation
        </button>
      </motion.div>

      {/* Laboratories View */}
      {viewType === 'labs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.laboratories.map((lab, index) => {
            const StatusIcon = getStatusIcon(lab.status);
            return (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{lab.name}</h3>
                      <p className="text-green-100 text-sm">ID: {lab.id}</p>
                    </div>
                    <Server size={32} className="text-green-200" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Capacity</p>
                      <p className="text-xl font-bold text-gray-900">{lab.capacity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Systems</p>
                      <p className="text-xl font-bold text-gray-900">{lab.systems}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Functional</p>
                      <p className="text-xl font-bold text-green-600">{lab.functional}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">System Health</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                        style={{ width: `${(lab.functional / lab.systems) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {((lab.functional / lab.systems) * 100).toFixed(1)}% operational
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Installed Software</p>
                    <div className="flex flex-wrap gap-2">
                      {lab.software.map((sw, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lab.status)}`}>
                      <StatusIcon size={14} />
                      {lab.status === 'needs-attention' ? 'Needs Attention' : lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                    </span>
                    <button
                      onClick={() => handleEditLab(lab)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Equipment View */}
      {viewType === 'equipment' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package size={24} className="text-green-600" />
              Equipment Inventory
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {resources.equipment.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {item.total} Total
                    </span>
                    <button
                      onClick={() => handleEditEquipment(item)}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Working</p>
                    <p className="text-2xl font-bold text-green-600">{item.working}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Under Maintenance</p>
                    <p className="text-2xl font-bold text-orange-600">{item.underMaintenance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Health</p>
                    <p className="text-2xl font-bold text-green-600">
                      {((item.working / item.total) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                      style={{ width: `${(item.working / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Budget View */}
      {viewType === 'budget' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign size={24} className="text-green-600" />
              Budget Allocation & Utilization
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Budget</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{(resources.budgetAllocation.total / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Utilized</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{(resources.budgetAllocation.utilized / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Remaining</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{(resources.budgetAllocation.pending / 100000).toFixed(1)}L
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {resources.budgetAllocation.categories.map((category, index) => {
                const percentage = (category.spent / category.allocated) * 100;
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{category.name}</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{(category.spent / 100000).toFixed(1)}L / ₹{(category.allocated / 100000).toFixed(1)}L
                          </p>
                          <p className="text-xs text-gray-600">{percentage.toFixed(1)}% utilized</p>
                        </div>
                        <button
                          onClick={() => handleEditBudget(category)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          percentage >= 90
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : percentage >= 70
                            ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
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
                  <h2 className="text-2xl font-bold">
                    Edit {editType === 'lab' ? 'Laboratory' : editType === 'equipment' ? 'Equipment' : 'Budget Category'}
                  </h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {/* Lab Edit Form */}
                  {editType === 'lab' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lab Name
                          </label>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => handleEditFieldChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Capacity
                          </label>
                          <input
                            type="number"
                            value={editData.capacity}
                            onChange={(e) => handleEditFieldChange('capacity', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Systems
                          </label>
                          <input
                            type="number"
                            value={editData.systems}
                            onChange={(e) => handleEditFieldChange('systems', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Functional Systems
                          </label>
                          <input
                            type="number"
                            value={editData.functional}
                            onChange={(e) => handleEditFieldChange('functional', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Installed Software (comma-separated)
                        </label>
                        <textarea
                          value={editData.software}
                          onChange={(e) => handleEditFieldChange('software', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="VS Code, IntelliJ IDEA, PyCharm"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Equipment Edit Form */}
                  {editType === 'equipment' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Equipment Name
                        </label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => handleEditFieldChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total
                          </label>
                          <input
                            type="number"
                            value={editData.total}
                            onChange={(e) => handleEditFieldChange('total', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Working
                          </label>
                          <input
                            type="number"
                            value={editData.working}
                            onChange={(e) => handleEditFieldChange('working', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Under Maintenance
                          </label>
                          <input
                            type="number"
                            value={editData.underMaintenance}
                            onChange={(e) => handleEditFieldChange('underMaintenance', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Budget Edit Form */}
                  {editType === 'budget' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category Name
                        </label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => handleEditFieldChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Allocated (₹)
                          </label>
                          <input
                            type="number"
                            value={editData.allocated}
                            onChange={(e) => handleEditFieldChange('allocated', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Spent (₹)
                          </label>
                          <input
                            type="number"
                            value={editData.spent}
                            onChange={(e) => handleEditFieldChange('spent', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      disabled={submitting}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Saving...' : 'Save Changes'}
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

export default ResourceManagement;
