import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Award, Calendar, Users, Edit2, Save, X } from 'lucide-react';
import { clubData } from '../club-data/clubData';

function ClubProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: clubData.clubInfo.name,
    id: clubData.clubInfo.id,
    president: clubData.clubInfo.president,
    vicePresident: clubData.clubInfo.vicePresident,
    facultyAdvisor: clubData.clubInfo.facultyAdvisor,
    establishedYear: clubData.clubInfo.establishedYear,
    email: 'tech.club@college.edu',
    phone: '+91 9876543210',
    location: 'Room 301, Student Activity Center',
    description: 'The Technical Club is dedicated to fostering innovation and technical excellence among students. We organize workshops, hackathons, and technical events throughout the academic year.',
    vision: 'To create a community of technically proficient students who can solve real-world problems through innovation and collaboration.',
    mission: 'Provide hands-on learning experiences, organize technical events, and build a strong technical community on campus.'
  });

  const handleSave = () => {
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
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
          <h1 className="text-3xl font-bold text-gray-900">Club Profile</h1>
          <p className="text-gray-600 mt-1">Manage your club information and settings</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-shadow"
          >
            <Edit2 size={20} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-shadow"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        )}
      </motion.div>

      {/* Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-purple-600 text-5xl font-bold shadow-xl">
            {profileData.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-2">{profileData.name}</h2>
            <p className="text-purple-100 text-lg mb-4">Club ID: {profileData.id}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Est. {profileData.establishedYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>{clubData.clubInfo.totalMembers} Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span>{clubData.clubInfo.activeEvents} Active Events</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="text-purple-600" size={24} />
            Basic Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Club Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">President</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.president}
                  onChange={(e) => setProfileData({ ...profileData, president: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold">{profileData.president}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Vice President</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.vicePresident}
                  onChange={(e) => setProfileData({ ...profileData, vicePresident: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold">{profileData.vicePresident}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Faculty Advisor</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.facultyAdvisor}
                  onChange={(e) => setProfileData({ ...profileData, facultyAdvisor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold">{profileData.facultyAdvisor}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Mail className="text-purple-600" size={24} />
            Contact Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold flex items-center gap-2">
                  <MapPin size={16} className="text-gray-600" />
                  {profileData.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Established Year</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.establishedYear}
                  onChange={(e) => setProfileData({ ...profileData, establishedYear: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-900 font-semibold">{profileData.establishedYear}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">About the Club</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={profileData.description}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profileData.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Vision</label>
            {isEditing ? (
              <textarea
                value={profileData.vision}
                onChange={(e) => setProfileData({ ...profileData, vision: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profileData.vision}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Mission</label>
            {isEditing ? (
              <textarea
                value={profileData.mission}
                onChange={(e) => setProfileData({ ...profileData, mission: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profileData.mission}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Club Statistics</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Total Members</p>
            <p className="text-3xl font-bold text-purple-600">{clubData.clubInfo.totalMembers}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Active Events</p>
            <p className="text-3xl font-bold text-blue-600">{clubData.clubInfo.activeEvents}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Budget</p>
            <p className="text-3xl font-bold text-green-600">₹{(clubData.clubInfo.budget / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Departments</p>
            <p className="text-3xl font-bold text-orange-600">{clubData.clubDepartments.length}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ClubProfile;
