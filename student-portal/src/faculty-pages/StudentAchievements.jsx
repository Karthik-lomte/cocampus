import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Download, Search, Trophy, Award, Medal,
  Calendar, User, X, FileText, Filter
} from 'lucide-react';

function StudentAchievements() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [uploadData, setUploadData] = useState({
    studentName: '',
    rollNo: '',
    category: '',
    title: '',
    description: '',
    date: '',
    certificate: null
  });

  // Mock achievements data
  const [achievements] = useState([
    {
      id: 1,
      studentName: 'Aarav Sharma',
      rollNo: 'CSE21001',
      class: 'CSE-3A',
      category: 'Technical',
      title: 'First Prize - National Hackathon 2024',
      description: 'Won first prize in Smart India Hackathon for developing an AI-based solution',
      date: '2024-03-15',
      uploadedBy: 'Dr. Rajesh Kumar',
      uploadDate: '2024-03-20'
    },
    {
      id: 2,
      studentName: 'Priya Patel',
      rollNo: 'CSE21025',
      class: 'CSE-3A',
      category: 'Sports',
      title: 'Gold Medal - State Level Athletics',
      description: 'Won gold medal in 400m race at State Level Athletics Championship',
      date: '2024-02-10',
      uploadedBy: 'Dr. Rajesh Kumar',
      uploadDate: '2024-02-15'
    },
    {
      id: 3,
      studentName: 'Rahul Verma',
      rollNo: 'CSE21042',
      class: 'CSE-3B',
      category: 'Cultural',
      title: 'Best Performance - College Fest',
      description: 'Best dance performance at annual college cultural fest',
      date: '2024-01-25',
      uploadedBy: 'Dr. Rajesh Kumar',
      uploadDate: '2024-01-28'
    },
    {
      id: 4,
      studentName: 'Ananya Singh',
      rollNo: 'CSE21018',
      class: 'CSE-3A',
      category: 'Academic',
      title: 'Research Paper Publication',
      description: 'Published research paper in IEEE conference on Machine Learning',
      date: '2024-03-01',
      uploadedBy: 'Dr. Rajesh Kumar',
      uploadDate: '2024-03-05'
    }
  ]);

  const categories = ['all', 'Technical', 'Sports', 'Cultural', 'Academic', 'Other'];

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch =
      achievement.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || achievement.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    alert(`Achievement uploaded successfully for ${uploadData.studentName}!`);
    setShowUploadModal(false);
    setUploadData({
      studentName: '',
      rollNo: '',
      category: '',
      title: '',
      description: '',
      date: '',
      certificate: null
    });
  };

  const handleDownload = (achievement) => {
    alert(`Downloading certificate for ${achievement.studentName} - ${achievement.title}`);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Technical': Trophy,
      'Sports': Medal,
      'Cultural': Award,
      'Academic': FileText,
      'Other': Award
    };
    return icons[category] || Award;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technical': 'bg-blue-100 text-blue-700 border-blue-200',
      'Sports': 'bg-green-100 text-green-700 border-green-200',
      'Cultural': 'bg-purple-100 text-purple-700 border-purple-200',
      'Academic': 'bg-orange-100 text-orange-700 border-orange-200',
      'Other': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Achievements</h1>
          <p className="text-gray-600 mt-1">
            Upload and manage student achievements and certificates
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Upload size={20} />
          Upload Achievement
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Achievements</p>
              <p className="text-4xl font-bold mt-2">{achievements.length}</p>
            </div>
            <Trophy size={48} className="text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Technical</p>
              <p className="text-4xl font-bold mt-2">
                {achievements.filter(a => a.category === 'Technical').length}
              </p>
            </div>
            <Award size={48} className="text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Sports & Cultural</p>
              <p className="text-4xl font-bold mt-2">
                {achievements.filter(a => a.category === 'Sports' || a.category === 'Cultural').length}
              </p>
            </div>
            <Medal size={48} className="text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Academic</p>
              <p className="text-4xl font-bold mt-2">
                {achievements.filter(a => a.category === 'Academic').length}
              </p>
            </div>
            <FileText size={48} className="text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by student name, roll number, or achievement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filterCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Achievements List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="divide-y divide-gray-200">
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map((achievement, index) => {
              const CategoryIcon = getCategoryIcon(achievement.category);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CategoryIcon size={24} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-lg">{achievement.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(achievement.category)}`}>
                            {achievement.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{achievement.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User size={16} />
                            <span>{achievement.studentName} ({achievement.rollNo})</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} />
                            <span>{new Date(achievement.date).toLocaleDateString()}</span>
                          </div>
                          <div className="text-gray-500 text-xs">
                            Uploaded on {new Date(achievement.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(achievement)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No achievements found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
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
                  <h2 className="text-2xl font-bold">Upload Student Achievement</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        value={uploadData.studentName}
                        onChange={(e) => setUploadData({ ...uploadData, studentName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roll Number *
                      </label>
                      <input
                        type="text"
                        value={uploadData.rollNo}
                        onChange={(e) => setUploadData({ ...uploadData, rollNo: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={uploadData.category}
                        onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Technical">Technical</option>
                        <option value="Sports">Sports</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Academic">Academic</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={uploadData.date}
                        onChange={(e) => setUploadData({ ...uploadData, date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievement Title *
                    </label>
                    <input
                      type="text"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., First Prize - National Hackathon"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Brief description of the achievement..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Certificate/Document
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setUploadData({ ...uploadData, certificate: e.target.files[0] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted formats: PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg font-medium"
                    >
                      Upload Achievement
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

export default StudentAchievements;
