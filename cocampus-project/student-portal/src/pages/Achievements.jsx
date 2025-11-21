import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Trophy, Award, BookOpen, Code, FileText, Music, Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import { achievementsData } from '../data/achievementsData';

function Achievements() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    date: '',
    issuer: '',
    certificate: null,
    visibility: 'public'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Achievement uploaded successfully! It will be reviewed by the admin.');
    setShowUploadForm(false);
    setFormData({
      category: '',
      title: '',
      description: '',
      date: '',
      issuer: '',
      certificate: null,
      visibility: 'public'
    });
  };

  const getCategoryIcon = (iconName) => {
    const icons = {
      BookOpen: BookOpen,
      Trophy: Trophy,
      Music: Music,
      Code: Code,
      FileText: FileText,
      Award: Award,
      Briefcase: Briefcase
    };
    const Icon = icons[iconName] || Award;
    return <Icon size={20} />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Achievements</h1>
            <p className="text-gray-600">Upload and showcase your achievements</p>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Upload Achievement
          </button>
        </div>
      </motion.div>

      {/* Upload Form */}
      {showUploadForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upload New Achievement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achievement Category *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {achievementsData.categories.map((category) => (
                  <label
                    key={category.value}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      formData.category === category.value ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={formData.category === category.value}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1"
                      required
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium text-gray-900 mb-1">
                        {getCategoryIcon(category.icon)}
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-600">{category.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Achievement Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., First Prize in Hackathon"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                maxLength={500}
                placeholder="Describe your achievement in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Achieved *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issued By *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g., College Name, Organization"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Certificate/Proof *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, certificate: e.target.files[0] })}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.certificate && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {formData.certificate.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === 'public'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Public</div>
                    <div className="text-xs text-gray-600">Visible to everyone</div>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === 'private'}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Private</div>
                    <div className="text-xs text-gray-600">Only visible to you</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                Upload Achievement
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievementsData.achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(achievement.status)}
                  {getStatusBadge(achievement.status)}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{achievement.description}</p>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium text-gray-900">{new Date(achievement.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Issued By:</span>
                  <span className="font-medium text-gray-900">{achievement.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Visibility:</span>
                  <span className={`font-medium ${achievement.visibility === 'public' ? 'text-green-600' : 'text-gray-600'}`}>
                    {achievement.visibility.charAt(0).toUpperCase() + achievement.visibility.slice(1)}
                  </span>
                </div>
              </div>

              {achievement.status === 'approved' && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FileText size={16} />
                  View Certificate
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
