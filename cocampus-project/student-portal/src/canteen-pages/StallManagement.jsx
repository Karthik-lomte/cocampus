import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  TrendingUp,
  ShoppingBag,
  MapPin
} from 'lucide-react';
import { canteenService } from '../services/canteenService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const StallManagement = () => {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Stalls Data
  const [stalls, setStalls] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    phone: '',
    email: '',
    location: '',
    category: '',
    customCategory: '',
    password: ''
  });

  const categories = ['Full Meals', 'Beverages', 'Snacks', 'Bakery', 'Fast Food', 'Other'];

  // Load Stalls Data
  useEffect(() => {
    loadStalls();
  }, []);

  const loadStalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await canteenService.getStalls();
      setStalls(data || []);
    } catch (err) {
      console.error('Error loading stalls:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStalls = stalls.filter(stall => {
    const matchesSearch = stall?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stall?.owner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || stall?.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddStall = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;
      const stallData = {
        name: formData.name,
        owner: formData.owner,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        category: finalCategory,
        password: formData.password
      };
      await canteenService.createStall(stallData);
      toast.success(`Stall added successfully! Login credentials sent to ${formData.email}`);
      setShowAddModal(false);
      setFormData({ name: '', owner: '', phone: '', email: '', location: '', category: '', customCategory: '', password: '' });
      await loadStalls();
    } catch (err) {
      console.error('Error adding stall:', err);
      toast.error(err.response?.data?.message || 'Failed to add stall');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStall = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;
      const stallData = {
        name: formData.name,
        owner: formData.owner,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        category: finalCategory
      };
      await canteenService.updateStall(selectedStall.id, stallData);
      toast.success('Stall updated successfully!');
      setShowEditModal(false);
      setSelectedStall(null);
      await loadStalls();
    } catch (err) {
      console.error('Error updating stall:', err);
      toast.error(err.response?.data?.message || 'Failed to update stall');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStall = async (stallId) => {
    if (window.confirm('Are you sure you want to delete this stall?')) {
      try {
        await canteenService.updateStall(stallId, { status: 'deleted' });
        toast.success('Stall deleted successfully!');
        await loadStalls();
      } catch (err) {
        console.error('Error deleting stall:', err);
        toast.error(err.response?.data?.message || 'Failed to delete stall');
      }
    }
  };

  const handleViewStats = (stall) => {
    setSelectedStall(stall);
    setShowStatsModal(true);
  };

  const openEditModal = (stall) => {
    setSelectedStall(stall);
    const isOtherCategory = !['Full Meals', 'Beverages', 'Snacks', 'Bakery', 'Fast Food'].includes(stall.category);
    setFormData({
      name: stall.name,
      owner: stall.owner,
      phone: stall.phone,
      email: stall.email,
      location: stall.location,
      category: isOtherCategory ? 'Other' : stall.category,
      customCategory: isOtherCategory ? stall.category : '',
      password: ''
    });
    setShowEditModal(true);
  };

  const toggleStallStatus = async (stallId) => {
    const stall = stalls.find(s => s.id === stallId);
    const newStatus = stall?.status === 'active' ? 'inactive' : 'active';
    try {
      await canteenService.updateStall(stallId, { status: newStatus });
      toast.success(`Stall ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      await loadStalls();
    } catch (err) {
      console.error('Error toggling stall status:', err);
      toast.error(err.response?.data?.message || 'Failed to update stall status');
    }
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading stalls..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadStalls} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stall Management</h1>
          <p className="text-gray-600">Manage all canteen stalls and vendors</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Stall
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stalls or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stalls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStalls.map((stall) => (
          <motion.div
            key={stall.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Store className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{stall?.name || 'N/A'}</h3>
                    <p className="text-sm text-gray-600">{stall?.category || 'N/A'}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stall?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {stall?.status || 'N/A'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="font-medium mr-2">Owner:</span> {stall?.owner || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" /> {stall?.location || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" /> {stall?.phone || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{stall?.todayOrders || 0}</p>
                  <p className="text-xs text-gray-600">Orders Today</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">₹{(stall?.todayRevenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Revenue</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{stall?.rating || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewStats(stall)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Stats"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(stall)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteStall(stall.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Stall Modal */}
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Stall</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddStall} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stall Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter stall name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter owner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="owner@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ground Floor, Block A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                {formData.category === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Category *</label>
                    <input
                      type="text"
                      required
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter custom category"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Set initial password"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be shared with the stall owner for login</p>
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
                    disabled={submitting}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Adding...' : 'Add Stall'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Stall Modal */}
      <AnimatePresence>
        {showEditModal && selectedStall && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Stall</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleEditStall} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stall Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                {formData.category === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Category *</label>
                    <input
                      type="text"
                      required
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter custom category"
                    />
                  </div>
                )}
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
                    disabled={submitting}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStatsModal && selectedStall && (
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
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedStall.name} - Statistics</h2>
                  <button onClick={() => setShowStatsModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Today's Stats */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">Today's Performance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <ShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{selectedStall.todayOrders}</p>
                      <p className="text-xs text-gray-600">Orders</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">₹{selectedStall.todayRevenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Revenue</p>
                    </div>
                  </div>
                </div>

                {/* Weekly Stats */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">This Week</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">856</p>
                      <p className="text-xs text-gray-600">Total Orders</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">₹42,500</p>
                      <p className="text-xs text-gray-600">Total Revenue</p>
                    </div>
                  </div>
                </div>

                {/* Monthly Stats */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-3">This Month</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">3,420</p>
                      <p className="text-xs text-gray-600">Orders</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">₹1.7L</p>
                      <p className="text-xs text-gray-600">Revenue</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-gray-900">{selectedStall.rating}</p>
                      <p className="text-xs text-gray-600">Rating</p>
                    </div>
                  </div>
                </div>

                {/* Stall Info */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Owner</span>
                    <span className="font-medium">{selectedStall.owner}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Contact</span>
                    <span className="font-medium">{selectedStall.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Joined</span>
                    <span className="font-medium">{selectedStall.joinedDate}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100">
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StallManagement;
