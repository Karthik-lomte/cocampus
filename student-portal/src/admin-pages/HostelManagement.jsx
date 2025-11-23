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
import adminService from '../api/adminService';

const HostelManagement = () => {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState({
    totalBlocks: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0
  });
  const [wardens, setWardens] = useState([
    { id: 1, name: 'Mr. Vikram Singh', email: 'vikram@university.edu', phone: '+91 9876543214', assignedBlock: 'Unassigned' },
    { id: 2, name: 'Mr. Rajesh Kumar', email: 'rajesh@university.edu', phone: '+91 9876543215', assignedBlock: 'Unassigned' },
    { id: 3, name: 'Mrs. Sunita Devi', email: 'sunita@university.edu', phone: '+91 9876543216', assignedBlock: 'Unassigned' },
    { id: 4, name: 'Mrs. Priya Sharma', email: 'priya@university.edu', phone: '+91 9876543217', assignedBlock: 'Unassigned' },
    { id: 5, name: 'Mr. Anil Verma', email: 'anil@university.edu', phone: '+91 9876543218', assignedBlock: 'Unassigned' }
  ]);

  const [activeView, setActiveView] = useState('blocks');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showWardenModal, setShowWardenModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const [blockForm, setBlockForm] = useState({
    name: '', type: 'boys', floors: '', roomsPerFloor: '', warden: ''
  });
  const [wardenAssignForm, setWardenAssignForm] = useState({
    wardenId: '', blockId: ''
  });

  useEffect(() => {
    fetchHostelData();
  }, []);

  const fetchHostelData = async () => {
    try {
      setLoading(true);
      const [blocksRes, statsRes] = await Promise.all([
        adminService.getHostelBlocks(),
        adminService.getHostelStats()
      ]);

      if (blocksRes.success && blocksRes.data) {
        setBlocks(blocksRes.data);
      }

      if (statsRes.success && statsRes.data) {
        setStats({
          totalBlocks: statsRes.data.totalBlocks || blocksRes.data?.length || 0,
          totalRooms: statsRes.data.totalRooms || 0,
          occupiedRooms: statsRes.data.occupiedRooms || 0,
          availableRooms: statsRes.data.availableRooms || 0
        });
      }
    } catch (error) {
      console.error('Error fetching hostel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRooms = stats.totalRooms || blocks.reduce((sum, block) => sum + (block.totalRooms || 0), 0);

  // Block Functions
  const handleAddBlock = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const totalRooms = parseInt(blockForm.floors) * parseInt(blockForm.roomsPerFloor);
      const blockData = {
        ...blockForm,
        floors: parseInt(blockForm.floors),
        roomsPerFloor: parseInt(blockForm.roomsPerFloor),
        totalRooms
      };

      if (editingBlock) {
        const response = await adminService.updateHostelBlock(editingBlock._id || editingBlock.id, blockData);
        if (response.success) {
          alert('Block updated successfully!');
          await fetchHostelData();
        }
      } else {
        const response = await adminService.createHostelBlock(blockData);
        if (response.success) {
          alert('Block added successfully!');
          await fetchHostelData();
        }
      }
      setShowBlockModal(false);
      setEditingBlock(null);
      setBlockForm({ name: '', type: 'boys', floors: '', roomsPerFloor: '', warden: '' });
    } catch (error) {
      console.error('Error saving block:', error);
      alert('Error saving block. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEditBlock = (block) => {
    setEditingBlock(block);
    setBlockForm({
      name: block.name,
      type: block.type,
      floors: block.floors?.toString() || '',
      roomsPerFloor: block.roomsPerFloor?.toString() || '',
      warden: block.warden || ''
    });
    setShowBlockModal(true);
  };

  const deleteBlock = async (id) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      try {
        setLoading(true);
        const response = await adminService.deleteHostelBlock(id);
        if (response.success) {
          alert('Block deleted successfully!');
          await fetchHostelData();
        }
      } catch (error) {
        console.error('Error deleting block:', error);
        alert('Error deleting block. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Warden Assignment
  const handleAssignWarden = (e) => {
    e.preventDefault();
    const warden = wardens.find(w => w.id === parseInt(wardenAssignForm.wardenId));
    const block = blocks.find(b => b.id === parseInt(wardenAssignForm.blockId));

    if (warden && block) {
      // Update blocks
      setBlocks(blocks.map(b => {
        if (b.id === block.id) {
          return { ...b, warden: warden.name, wardenId: warden.id };
        }
        if (b.wardenId === warden.id) {
          return { ...b, warden: 'Unassigned', wardenId: null };
        }
        return b;
      }));

      // Update wardens
      setWardens(wardens.map(w => {
        if (w.id === warden.id) {
          return { ...w, assignedBlock: block.name };
        }
        if (w.assignedBlock === block.name) {
          return { ...w, assignedBlock: 'Unassigned' };
        }
        return w;
      }));

      alert(`${warden.name} assigned to ${block.name} successfully!`);
    }
    setShowWardenModal(false);
    setWardenAssignForm({ wardenId: '', blockId: '' });
  };

  if (loading && blocks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hostel data...</p>
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Blocks</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBlocks}</p>
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
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-3xl font-bold text-gray-900">{stats.occupiedRooms}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-3xl font-bold text-gray-900">{stats.availableRooms}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
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
                    <tr key={block._id || block.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{block.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          block.type === 'boys' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        } capitalize`}>
                          {block.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{block.floors || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{block.totalRooms || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{block.warden || 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditBlock(block)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            disabled={loading}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBlock(block._id || block.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {blocks.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No hostel blocks found</p>
                        <p className="text-gray-400 text-sm mt-1">Click "Add Block" to create one</p>
                      </td>
                    </tr>
                  )}
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
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingBlock ? 'Save Changes' : 'Add Block'}
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
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Assign Warden
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
