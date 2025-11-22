import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Edit2, Save, X, User, Building } from 'lucide-react';
import { hostelService } from '../services/hostelService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function RoomManagement() {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [blocks, setBlocks] = useState([]);

  // Load Students/Residents
  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostelService.getResidents();
      setStudents(data.residents || data || []);
      setBlocks(data.blocks || ['Block A', 'Block B', 'Block C', 'Block D']);
    } catch (err) {
      console.error('Error loading residents:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const [editFormData, setEditFormData] = useState({
    roomNo: '',
    floor: '',
    block: '',
    roomType: '',
    roommateName: '',
    roommateRollNo: ''
  });

  const floors = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor'];
  const roomTypes = ['Single', 'Double Sharing', 'Triple Sharing'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.roomNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = blockFilter === 'all' || student.block === blockFilter;
    return matchesSearch && matchesBlock;
  });

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      roomNo: student.roomNo,
      floor: student.floor,
      block: student.block,
      roomType: student.roomType,
      roommateName: student.roommate?.name || '',
      roommateRollNo: student.roommate?.rollNo || ''
    });
    setShowEditModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await hostelService.allocateRoom({
        residentId: selectedStudent.id,
        roomNo: editFormData.roomNo,
        floor: editFormData.floor,
        block: editFormData.block,
        roomType: editFormData.roomType,
        roommate: editFormData.roommateName ? {
          name: editFormData.roommateName,
          rollNo: editFormData.roommateRollNo
        } : null
      });
      toast.success('Room details updated successfully!');
      setShowEditModal(false);
      await loadResidents();
    } catch (err) {
      console.error('Error updating room details:', err);
      toast.error(err.response?.data?.message || 'Failed to update room details');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading room management..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadResidents} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
        <p className="text-gray-600 mt-1">Manage student room assignments and details</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, roll number, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Blocks</option>
            {blocks.map(block => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Students List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Student Room Assignments ({filteredStudents.length})</h2>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roommate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.rollNo}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{student.roomNo}</div>
                      <div className="text-sm text-gray-500">{student.block} • {student.floor}</div>
                      <div className="text-xs text-gray-400">{student.roomType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.roommate ? (
                      <div>
                        <div className="text-sm text-gray-900">{student.roommate.name}</div>
                        <div className="text-xs text-gray-500">{student.roommate.rollNo}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No roommate</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(student)}
                      className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.rollNo}</p>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  {student.roomNo}
                </span>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div><span className="text-gray-500">Block:</span> <span className="font-medium">{student.block}</span></div>
                <div><span className="text-gray-500">Floor:</span> <span className="font-medium">{student.floor}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="font-medium">{student.roomType}</span></div>
                {student.roommate && (
                  <div><span className="text-gray-500">Roommate:</span> <span className="font-medium">{student.roommate.name}</span></div>
                )}
              </div>
              <button
                onClick={() => handleEdit(student)}
                className="w-full px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2"
              >
                <Edit2 size={16} />
                Edit Room Details
              </button>
            </motion.div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center">
            <Home size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No students found</p>
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedStudent && (
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
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Edit Room Details</h2>
                    <p className="text-orange-100 text-sm mt-1">{selectedStudent.name} ({selectedStudent.rollNo})</p>
                  </div>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.roomNo}
                        onChange={(e) => setEditFormData({ ...editFormData, roomNo: e.target.value })}
                        placeholder="e.g., A-205"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Block *</label>
                      <select
                        required
                        value={editFormData.block}
                        onChange={(e) => setEditFormData({ ...editFormData, block: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {blocks.map(block => (
                          <option key={block} value={block}>{block}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Floor *</label>
                      <select
                        required
                        value={editFormData.floor}
                        onChange={(e) => setEditFormData({ ...editFormData, floor: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {floors.map(floor => (
                          <option key={floor} value={floor}>{floor}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                      <select
                        required
                        value={editFormData.roomType}
                        onChange={(e) => setEditFormData({ ...editFormData, roomType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {roomTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Roommate Details (Optional)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Roommate Name</label>
                        <input
                          type="text"
                          value={editFormData.roommateName}
                          onChange={(e) => setEditFormData({ ...editFormData, roommateName: e.target.value })}
                          placeholder="Enter name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Roommate Roll No</label>
                        <input
                          type="text"
                          value={editFormData.roommateRollNo}
                          onChange={(e) => setEditFormData({ ...editFormData, roommateRollNo: e.target.value })}
                          placeholder="Enter roll no"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={18} />
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

export default RoomManagement;
