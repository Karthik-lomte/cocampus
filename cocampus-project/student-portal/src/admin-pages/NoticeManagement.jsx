import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Pin,
  PinOff,
  Calendar,
  Filter,
  AlertTriangle,
  AlertCircle,
  Info,
  Paperclip,
  FileDown
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const NoticeManagement = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium',
    pinned: false,
    attachment: null,
    attachmentName: null
  });

  const categories = ['Academic', 'Exam', 'Fee', 'Event', 'Placement', 'General'];
  const priorities = ['High', 'Medium', 'Low'];

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getNotices();
      setNotices(data.notices || data || []);
    } catch (err) {
      console.error('Notices error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const totalNotices = notices.length;
  const pinnedNotices = notices.filter(n => n.pinned).length;
  const thisMonth = notices.filter(n => {
    const noticeDate = new Date(n.date);
    const now = new Date();
    return noticeDate.getMonth() === now.getMonth() && noticeDate.getFullYear() === now.getFullYear();
  }).length;

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || notice.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      category: 'General',
      priority: 'Medium',
      pinned: false,
      attachment: null,
      attachmentName: null
    });
    setShowModal(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      priority: notice.priority,
      pinned: notice.pinned,
      attachment: notice.attachment,
      attachmentName: notice.attachmentName
    });
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        attachment: file,
        attachmentName: file.name
      });
    }
  };

  const removeAttachment = () => {
    setFormData({
      ...formData,
      attachment: null,
      attachmentName: null
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const noticeFormData = new FormData();
      noticeFormData.append('title', formData.title);
      noticeFormData.append('content', formData.content);
      noticeFormData.append('category', formData.category);
      noticeFormData.append('priority', formData.priority);
      noticeFormData.append('pinned', formData.pinned);

      if (formData.attachment) {
        noticeFormData.append('attachment', formData.attachment);
      }

      if (editingNotice) {
        await adminService.updateNotice(editingNotice.id, noticeFormData);
        toast.success('Notice updated successfully!');
      } else {
        await adminService.createNotice(noticeFormData);
        toast.success('Notice added successfully!');
      }

      await loadNotices();
      setShowModal(false);
    } catch (err) {
      console.error('Submit notice error:', err);
      toast.error(err.response?.data?.message || 'Failed to save notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await adminService.deleteNotice(id);
        toast.success('Notice deleted successfully!');
        await loadNotices();
      } catch (err) {
        console.error('Delete notice error:', err);
        toast.error(err.response?.data?.message || 'Failed to delete notice');
      }
    }
  };

  const togglePin = async (id) => {
    try {
      const notice = notices.find(n => n.id === id);
      if (!notice) return;

      const noticeFormData = new FormData();
      noticeFormData.append('title', notice.title);
      noticeFormData.append('content', notice.content);
      noticeFormData.append('category', notice.category);
      noticeFormData.append('priority', notice.priority);
      noticeFormData.append('pinned', !notice.pinned);

      await adminService.updateNotice(id, noticeFormData);
      toast.success(notice.pinned ? 'Notice unpinned' : 'Notice pinned');
      await loadNotices();
    } catch (err) {
      console.error('Toggle pin error:', err);
      toast.error(err.response?.data?.message || 'Failed to update notice');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Medium':
        return <AlertCircle className="w-4 h-4" />;
      case 'Low':
        return <Info className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Academic: 'bg-blue-100 text-blue-700',
      Exam: 'bg-purple-100 text-purple-700',
      Fee: 'bg-amber-100 text-amber-700',
      Event: 'bg-green-100 text-green-700',
      Placement: 'bg-indigo-100 text-indigo-700',
      General: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <Loading fullScreen message="Loading notice management..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadNotices} fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Notice Management</h1>
        <p className="text-indigo-100">Create and manage campus notices and announcements</p>
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
              <p className="text-sm text-gray-600">Total Notices</p>
              <p className="text-3xl font-bold text-gray-900">{totalNotices}</p>
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Pinned Notices</p>
              <p className="text-3xl font-bold text-gray-900">{pinnedNotices}</p>
              <p className="text-xs text-purple-600 mt-1">Important</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Pin className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">{thisMonth}</p>
              <p className="text-xs text-green-600 mt-1">Recent notices</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Notice
          </button>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice, index) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white rounded-xl shadow-sm border p-6 ${
              notice.pinned ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {notice.pinned && (
                    <Pin className="w-4 h-4 text-indigo-600" />
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                    {notice.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPriorityColor(notice.priority)}`}>
                    {getPriorityIcon(notice.priority)}
                    {notice.priority}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{notice.content}</p>
                <div className="flex items-center text-xs text-gray-500 gap-4">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {notice.date}
                  </span>
                  <span>Posted by: {notice.postedBy}</span>
                </div>
                {/* Attachment Display */}
                {notice.attachment && notice.attachmentName && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <a
                      href={notice.attachment}
                      download={notice.attachmentName}
                      className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="mr-2">{notice.attachmentName}</span>
                      <FileDown className="w-4 h-4 text-indigo-600" />
                    </a>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => togglePin(notice.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    notice.pinned
                      ? 'text-indigo-600 hover:bg-indigo-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={notice.pinned ? 'Unpin' : 'Pin'}
                >
                  {notice.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEditModal(notice)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredNotices.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notices found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
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
                  <h2 className="text-xl font-semibold">
                    {editingNotice ? 'Edit Notice' : 'Add New Notice'}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter notice title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter notice content"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={formData.pinned}
                    onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="pinned" className="ml-2 text-sm text-gray-700">
                    Pin this notice (will appear at the top)
                  </label>
                </div>

                {/* File Attachment Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment (PDF/Doc)
                  </label>
                  {formData.attachmentName ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Paperclip className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">
                          {formData.attachmentName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remove attachment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
                      >
                        <Paperclip className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload PDF or Document
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
                    {submitting ? 'Saving...' : editingNotice ? 'Update Notice' : 'Add Notice'}
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

export default NoticeManagement;
