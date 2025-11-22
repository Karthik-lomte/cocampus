import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Building, Calendar, Edit2, Save, X, Camera } from 'lucide-react';

function HostelProfile() {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Mr. Rajesh Sharma',
    email: 'rajesh.sharma@university.edu',
    phone: '+91 9876543210',
    alternatePhone: '+91 9876543211',
    designation: 'Chief Warden',
    department: 'Hostel Administration',
    employeeId: 'WRD2015001',
    joiningDate: '2015-06-15',
    assignedBlocks: ['Block A', 'Block B'],
    officeLocation: 'Hostel Admin Building, Room 101',
    officeHours: '9:00 AM - 5:00 PM',
    emergencyContact: '+91 9876543212',
    qualification: 'M.Tech, Civil Engineering',
    experience: '15 years'
  });

  const [editingData, setEditingData] = useState({ ...profileData });

  const handleSave = () => {
    setProfileData({ ...editingData });
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditingData({ ...profileData });
    setEditMode(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Warden Profile</h1>
          <p className="text-gray-600 mt-1">Manage your profile information</p>
        </div>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-shadow"
          >
            <Edit2 size={20} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 text-center"
        >
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
              <User size={64} className="text-white" />
            </div>
            {editMode && (
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                <Camera size={16} className="text-gray-600" />
              </button>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
          <p className="text-orange-600 font-medium">{profileData.designation}</p>
          <p className="text-gray-500 text-sm mt-1">{profileData.employeeId}</p>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-left space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} />
                <span className="text-sm">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} />
                <span className="text-sm">{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} />
                <span className="text-sm">{profileData.officeLocation}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {editMode ? (
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {editMode ? (
                <input
                  type="email"
                  value={editingData.email}
                  onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {editMode ? (
                <input
                  type="tel"
                  value={editingData.phone}
                  onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone</label>
              {editMode ? (
                <input
                  type="tel"
                  value={editingData.alternatePhone}
                  onChange={(e) => setEditingData({ ...editingData, alternatePhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.alternatePhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <p className="text-gray-900">{profileData.designation}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <p className="text-gray-900">{profileData.employeeId}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
              <p className="text-gray-900">{new Date(profileData.joiningDate).toLocaleDateString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <p className="text-gray-900">{profileData.experience}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
              {editMode ? (
                <input
                  type="text"
                  value={editingData.qualification}
                  onChange={(e) => setEditingData({ ...editingData, qualification: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.qualification}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours</label>
              {editMode ? (
                <input
                  type="text"
                  value={editingData.officeHours}
                  onChange={(e) => setEditingData({ ...editingData, officeHours: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.officeHours}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Office Location</label>
              {editMode ? (
                <input
                  type="text"
                  value={editingData.officeLocation}
                  onChange={(e) => setEditingData({ ...editingData, officeLocation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.officeLocation}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Blocks</label>
              <div className="flex flex-wrap gap-2">
                {profileData.assignedBlocks.map((block) => (
                  <span
                    key={block}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {block}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Emergency Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-red-50 border border-red-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-red-900 mb-4">Emergency Contact</h3>
        <div className="flex items-center gap-3">
          <Phone className="text-red-600" size={20} />
          {editMode ? (
            <input
              type="tel"
              value={editingData.emergencyContact}
              onChange={(e) => setEditingData({ ...editingData, emergencyContact: e.target.value })}
              className="flex-1 px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ) : (
            <span className="text-red-900 font-medium">{profileData.emergencyContact}</span>
          )}
        </div>
        <p className="text-red-700 text-sm mt-2">
          This number will be displayed to students for emergency situations.
        </p>
      </motion.div>
    </div>
  );
}

export default HostelProfile;
