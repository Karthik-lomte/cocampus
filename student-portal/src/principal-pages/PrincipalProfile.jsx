import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Award, Calendar, Briefcase, GraduationCap, Building2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import principalService from '../api/principalService';

function PrincipalProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalStaff: 0,
    totalDepartments: 0,
    passPercentage: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await principalService.getPrincipalDashboardStats();

      if (response.success && response.data) {
        setStats({
          totalStudents: response.data.totalStudents || 0,
          totalFaculty: response.data.totalFaculty || 0,
          totalStaff: response.data.totalStaff || 0,
          totalDepartments: response.data.totalDepartments || 0,
          passPercentage: response.data.passPercentage || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Use actual user data or fallback to default values
  const profile = {
    name: user?.name || 'Principal',
    email: user?.email || 'principal@cocampus.edu',
    phone: user?.phone || '+91 98765 43210',
    employeeId: user?.employeeId || user?.userId || 'EMP001',
    designation: 'Principal',
    institution: 'Co-Campus College of Engineering',
    joinDate: user?.joinDate || '2015-07-01',
    experience: '25+ Years',
    qualification: 'Ph.D.',
    avatar: user?.avatar || '/assets/default-avatar.png'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Principal Profile</h1>
        <p className="text-gray-600 mt-1">Your professional information and details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-32"></div>
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-6">
                <div className="w-32 h-32 rounded-full ring-4 ring-white bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="pt-20">
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">{profile.designation}</p>
                <p className="text-sm text-gray-500">{profile.employeeId}</p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-3" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-3" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building2 size={16} className="mr-3" />
                    <span className="text-sm">{profile.institution}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Institution Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Students</span>
                <span className="font-bold text-purple-600">{stats.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Faculty</span>
                <span className="font-bold text-blue-600">{stats.totalFaculty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Staff</span>
                <span className="font-bold text-green-600">{stats.totalStaff}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Departments</span>
                <span className="font-bold text-orange-600">{stats.totalDepartments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pass %</span>
                <span className="font-bold text-indigo-600">{stats.passPercentage}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Professional Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Briefcase className="mr-2 text-purple-500" size={24} />
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Institution</p>
                <p className="font-semibold text-gray-900">{profile.institution}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-semibold text-gray-900">{profile.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-semibold text-gray-900">{profile.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Joining</p>
                <p className="font-semibold text-gray-900">{new Date(profile.joinDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-semibold text-gray-900">{profile.experience}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Qualification</p>
                <p className="font-semibold text-gray-900">{profile.qualification}</p>
              </div>
            </div>
          </div>

          {/* Educational Qualifications */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="mr-2 text-blue-500" size={24} />
              Educational Qualifications
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-bold text-gray-900">Ph.D. in Engineering Management</p>
                <p className="text-sm text-gray-600">Indian Institute of Technology, Bombay</p>
                <p className="text-xs text-gray-500">1995 - 2000</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-bold text-gray-900">M.Tech in Mechanical Engineering</p>
                <p className="text-sm text-gray-600">National Institute of Technology, Delhi</p>
                <p className="text-xs text-gray-500">1992 - 1994</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-bold text-gray-900">B.Tech in Mechanical Engineering</p>
                <p className="text-sm text-gray-600">Regional Engineering College, Trichy</p>
                <p className="text-xs text-gray-500">1988 - 1992</p>
              </div>
            </div>
          </div>

          {/* Areas of Expertise */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="mr-2 text-green-500" size={24} />
              Areas of Expertise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Educational Leadership',
                'Strategic Planning',
                'Quality Assurance',
                'Curriculum Development',
                'Faculty Development',
                'Industry-Academia Collaboration',
                'Research & Innovation',
                'Institutional Accreditation'
              ].map((area, index) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100"
                >
                  <p className="text-sm font-semibold text-gray-900">{area}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievements & Honors */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="mr-2 text-yellow-500" size={24} />
              Achievements & Honors
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900">Leadership Awards</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                  <li>Best Principal Award - State Education Board (2022)</li>
                  <li>Excellence in Educational Leadership - AICTE (2020)</li>
                  <li>Distinguished Educator Award - IEEE (2019)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Publications & Research</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                  <li>Research Papers: 45+ in International Journals</li>
                  <li>Books Authored: 3 on Engineering Education</li>
                  <li>Patents Filed: 8 in Educational Technology</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Institutional Achievements</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                  <li>NAAC A+ Grade Accreditation (2023)</li>
                  <li>NBA Accreditation for all UG Programs</li>
                  <li>Top 50 Engineering Colleges - National Ranking</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Professional Memberships */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="mr-2 text-indigo-500" size={24} />
              Professional Memberships
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                <p className="font-bold text-gray-900">ISTE</p>
                <p className="text-xs text-gray-600">Indian Society for Technical Education</p>
                <p className="text-xs text-gray-500 mt-1">Life Member</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <p className="font-bold text-gray-900">IEEE</p>
                <p className="text-xs text-gray-600">Institute of Electrical and Electronics Engineers</p>
                <p className="text-xs text-gray-500 mt-1">Senior Member</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
                <p className="font-bold text-gray-900">AIU</p>
                <p className="text-xs text-gray-600">Association of Indian Universities</p>
                <p className="text-xs text-gray-500 mt-1">Member</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
                <p className="font-bold text-gray-900">AICTE</p>
                <p className="text-xs text-gray-600">All India Council for Technical Education</p>
                <p className="text-xs text-gray-500 mt-1">Expert Member</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PrincipalProfile;
