import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const HostelManagement = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Blocks State
  const [blocks, setBlocks] = useState([]);

  // Wardens State
  const [wardens, setWardens] = useState([]);

  // UI State
  const [activeView, setActiveView] = useState('blocks');

  // Modals State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showWardenModal, setShowWardenModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  // Form Data
  const [blockForm, setBlockForm] = useState({
    name: '', type: 'boys', floors: '', roomsPerFloor: ''
  });
  const [wardenAssignForm, setWardenAssignForm] = useState({
    wardenId: '', blockId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [blocksData, wardensData] = await Promise.all([
        adminService.getHostelBlocks(),
        adminService.getWardens()
      ]);
      setBlocks(blocksData.blocks || blocksData || []);
      setWardens(wardensData.wardens || wardensData || []);
    } catch (err) {
      console.error('Hostel management error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Stats
  const totalRooms = blocks.reduce((sum, block) => sum + (block.totalRooms || 0), 0);

  // Block Functions
  const handleAddBlock = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const blockData = {
        name: blockForm.name,
        type: blockForm.type,
        floors: parseInt(blockForm.floors),
        roomsPerFloor: parseInt(blockForm.roomsPerFloor)
      };
      if (editingBlock) {
        await adminService.updateHostelBlock(editingBlock.id, blockData);
        toast.success('Block updated successfully!');
      } else {
        await adminService.createHostelBlock(blockData);
        toast.success('Block added successfully!');
      }
      await loadData();
      setShowBlockModal(false);
      setEditingBlock(null);
      setBlockForm({ name: '', type: 'boys', floors: '', roomsPerFloor: '' });
    } catch (err) {
      console.error('Block operation error:', err);
      toast.error(err.response?.data?.message || 'Failed to save block');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditBlock = (block) => {
    setEditingBlock(block);
    setBlockForm({
      name: block.name,
      type: block.type,
      floors: block.floors.toString(),
      roomsPerFloor: block.roomsPerFloor.toString()
    });
    setShowBlockModal(true);
  };

  const deleteBlock = async (id) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      try {
        await adminService.deleteHostelBlock(id);
        toast.success('Block deleted successfully!');
        await loadData();
      } catch (err) {
        console.error('Delete block error:', err);
        toast.error(err.response?.data?.message || 'Failed to delete block');
      }
    }
  };

  // Warden Assignment
  const handleAssignWarden = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await adminService.assignWarden(parseInt(wardenAssignForm.blockId), parseInt(wardenAssignForm.wardenId));
      toast.success('Warden assigned successfully!');
      await loadData();
      setShowWardenModal(false);
      setWardenAssignForm({ wardenId: '', blockId: '' });
    } catch (err) {
      console.error('Assign warden error:', err);
      toast.error(err.response?.data?.message || 'Failed to assign warden');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading hostel management..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadData} fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Hostel Management</h1>
        <p className="text-indigo-100">Manage hostel blocks and warden assignments</p>
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
              <p className="text-sm text-gray-600">Total Blocks</p>
              <p className="text-3xl font-bold text-gray-900">{blocks.length}</p>
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
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-3xl font-bold text-gray-900">{totalRooms}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Home className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Wardens</p>
              <p className="text-3xl font-bold text-gray-900">{wardens.length}</p>
              <p className="text-xs text-gray-500 mt-1">{wardens.filter(w => w.assignedBlock !== 'Unassigned').length} assigned</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('blocks')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'blocks'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Blocks
          </button>
          <button
            onClick={() => setActiveView('wardens')}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'wardens'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Wardens
          </button>
        </div>
      </div>

      {/* Blocks View */}
      {activeView === 'blocks' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Hostel Blocks</h2>
              <button
                onClick={() => setShowBlockModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Block
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Block Name</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Floors</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Rooms</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warden</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blocks.map((block) => (
                    <tr key={block.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{block.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          block.type === 'boys' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        } capitalize`}>
                          {block.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{block.floors}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{block.totalRooms}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{block.warden}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditBlock(block)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBlock(block.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          </div>
        </motion.div>
      )}

      {/* Wardens View */}
      {activeView === 'wardens' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Hostel Wardens</h2>
              <button
                onClick={() => setShowWardenModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Assign Warden
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warden</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Block</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {wardens.map((warden) => (
                    <tr key={warden.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">{warden.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {warden.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {warden.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{warden.assignedBlock}</td>
                      <td className="px-6 py-4 text-center">
                        {warden.assignedBlock !== 'Unassigned' ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Assigned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <XCircle className="w-3 h-3 mr-1" />
                            Unassigned
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Block Modal */}
      <AnimatePresence>
        {showBlockModal && (
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
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {editingBlock ? 'Edit Block' : 'Add New Block'}
                  </h2>
                  <button onClick={() => {
                    setShowBlockModal(false);
                    setEditingBlock(null);
                    setBlockForm({ name: '', type: 'boys', floors: '', roomsPerFloor: '' });
                  }} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddBlock} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Block Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Block A - Boys"
                    value={blockForm.name}
                    onChange={(e) => setBlockForm({ ...blockForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    required
                    value={blockForm.type}
                    onChange={(e) => setBlockForm({ ...blockForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Floors *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={blockForm.floors}
                      onChange={(e) => setBlockForm({ ...blockForm, floors: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooms per Floor *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={blockForm.roomsPerFloor}
                      onChange={(e) => setBlockForm({ ...blockForm, roomsPerFloor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {blockForm.floors && blockForm.roomsPerFloor && (
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                    Total rooms: <span className="font-medium">{parseInt(blockForm.floors) * parseInt(blockForm.roomsPerFloor)}</span>
                  </p>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBlockModal(false);
                      setEditingBlock(null);
                      setBlockForm({ name: '', type: 'boys', floors: '', roomsPerFloor: '' });
                    }}
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
                    {submitting ? 'Saving...' : editingBlock ? 'Save Changes' : 'Add Block'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Warden Modal */}
      <AnimatePresence>
        {showWardenModal && (
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
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Assign Warden to Block</h2>
                  <button onClick={() => {
                    setShowWardenModal(false);
                    setWardenAssignForm({ wardenId: '', blockId: '' });
                  }} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAssignWarden} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warden *</label>
                  <select
                    required
                    value={wardenAssignForm.wardenId}
                    onChange={(e) => setWardenAssignForm({ ...wardenAssignForm, wardenId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Warden</option>
                    {wardens.map(warden => (
                      <option key={warden.id} value={warden.id}>
                        {warden.name} {warden.assignedBlock !== 'Unassigned' ? `(Currently: ${warden.assignedBlock})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Block *</label>
                  <select
                    required
                    value={wardenAssignForm.blockId}
                    onChange={(e) => setWardenAssignForm({ ...wardenAssignForm, blockId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Block</option>
                    {blocks.map(block => (
                      <option key={block.id} value={block.id}>
                        {block.name} {block.warden !== 'Unassigned' ? `(Current: ${block.warden})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWardenModal(false);
                      setWardenAssignForm({ wardenId: '', blockId: '' });
                    }}
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
                    {submitting ? 'Assigning...' : 'Assign Warden'}
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

export default HostelManagement;
