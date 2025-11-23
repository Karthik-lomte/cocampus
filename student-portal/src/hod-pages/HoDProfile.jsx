import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, Award, BookOpen,
  Building, MapPin, Clock, GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function HoDProfile() {
  const { user } = useAuth();

  const profile = {
    name: user?.name || 'HOD Name',
    email: user?.email || 'hod@example.com',
    phone: user?.phone || 'N/A',
    designation: 'Head of Department',
    department: user?.department || 'Department',
    qualification: user?.qualification || 'N/A',
    experience: user?.experience || 'N/A',
    employeeId: user?.employeeId || user?.id || 'N/A',
    joinDate: user?.joinDate || user?.createdAt || new Date(),
    officeRoom: user?.officeRoom || 'N/A',
    avatar: user?.avatar || 'https://via.placeholder.com/150'
  };

  const infoCards = [
    {
      icon: Mail,
      label: 'Email',
      value: profile.email,
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile.phone,
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      icon: Building,
      label: 'Office',
      value: profile.officeRoom,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      icon: Calendar,
      label: 'Joined',
      value: new Date(profile.joinDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      gradient: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.name}</h1>
            <p className="text-xl text-green-100 mb-2">{profile.designation}</p>
            <p className="text-lg text-green-200 mb-4">{profile.department}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <GraduationCap size={20} />
                <span>{profile.qualification}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Award size={20} />
                <span>{profile.experience}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {infoCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className={`bg-gradient-to-r ${card.gradient} p-4`}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                <p className="font-semibold text-gray-900">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Professional Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen size={28} />
            Professional Details
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Employee ID</p>
              <p className="text-lg font-semibold text-gray-900">{profile.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Designation</p>
              <p className="text-lg font-semibold text-gray-900">{profile.designation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Department</p>
              <p className="text-lg font-semibold text-gray-900">{profile.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Qualification</p>
              <p className="text-lg font-semibold text-gray-900">{profile.qualification}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Experience</p>
              <p className="text-lg font-semibold text-gray-900">{profile.experience}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Date of Joining</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(profile.joinDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Responsibilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Award size={24} />
              Key Responsibilities
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Department administration and management</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Faculty coordination and supervision</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Student performance monitoring</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Resource and budget management</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Leave and gate pass approvals</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p className="text-gray-700">Academic planning and curriculum development</p>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Award size={24} />
              Achievements & Awards
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">Best HOD Award</p>
                  <p className="text-sm text-gray-600">2023 - University Level</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">Excellence in Teaching</p>
                  <p className="text-sm text-gray-600">2022 - State Level</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">Research Publications</p>
                  <p className="text-sm text-gray-600">25+ Papers in Reputed Journals</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">Department Ranking</p>
                  <p className="text-sm text-gray-600">Top 10 in Region - 2023</p>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HoDProfile;
