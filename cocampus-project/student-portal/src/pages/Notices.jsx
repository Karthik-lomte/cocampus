import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Pin, Download, Calendar } from 'lucide-react';
import { notices, getPinnedNotices, getNoticePriorityColor } from '../data/noticesData';

const Notices = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const pinnedNotices = getPinnedNotices();

  const categories = [
    'all',
    'Academic notices',
    'Examination updates',
    'Fee reminders',
    'Event announcements',
    'Placement notifications',
    'General circulars'
  ];

  const filteredNotices = selectedCategory === 'all'
    ? notices
    : notices.filter(n => n.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
        <p className="text-gray-600 mt-1">Important announcements and updates</p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              selectedCategory === cat
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pinned Notices */}
      {pinnedNotices.length > 0 && selectedCategory === 'all' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Pin className="mr-2 text-red-500" size={20} />
            Pinned Notices
          </h2>
          {pinnedNotices.map((notice, index) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getNoticePriorityColor(notice.priority)}`}>
                      {notice.priority} Priority
                    </span>
                    <span className="text-sm text-gray-600">{notice.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{notice.title}</h3>
                </div>
                <Pin className="text-red-500" size={24} />
              </div>
              <p className="text-gray-700 mb-3">{notice.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {new Date(notice.date).toLocaleString()}
                </span>
                <span>Posted by: {notice.postedBy}</span>
              </div>
              {notice.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {notice.attachments.map((file, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded-lg text-sm hover:bg-red-50 flex items-center"
                    >
                      <Download size={14} className="mr-1" />
                      {file}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* All Notices */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Bell className="mr-2 text-blue-500" size={20} />
          All Notices
        </h2>
        {filteredNotices.map((notice, index) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getNoticePriorityColor(notice.priority)}`}>
                    {notice.priority} Priority
                  </span>
                  <span className="text-sm text-gray-600">{notice.category}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{notice.title}</h3>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{notice.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {new Date(notice.date).toLocaleString()}
              </span>
              <span>Posted by: {notice.postedBy}</span>
            </div>
            {notice.attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {notice.attachments.map((file, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-sm hover:bg-blue-100 flex items-center"
                  >
                    <Download size={14} className="mr-1" />
                    {file}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Notices;
