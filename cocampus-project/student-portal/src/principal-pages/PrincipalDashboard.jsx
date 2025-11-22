import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, TrendingUp, DollarSign,
  Building2, Award, FileText, Calendar
} from 'lucide-react';
import { principalService } from '../services/principalService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function PrincipalDashboard() {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard Data
  const [profile, setProfile] = useState({});
  const [institutionStats, setInstitutionStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    passPercentage: 0,
    totalDepartments: 0
  });
  const [departments, setDepartments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Load Dashboard Data
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await principalService.getDashboard();

      setProfile(data.profile || {});
      setInstitutionStats(data.institutionStats || {
        totalStudents: 0,
        totalFaculty: 0,
        passPercentage: 0,
        totalDepartments: 0
      });
      setDepartments(data.departments || []);
      setRecentActivities(data.recentActivities || []);
    } catch (err) {
      console.error('Error loading principal dashboard:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading principal dashboard..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadDashboard} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome, {profile?.name || 'Principal'}
        </h1>
        <p className="text-purple-100 text-lg">{profile?.institution || ''}</p>
      </motion.div>

      {/* Institution Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Students</p>
              <p className="text-4xl font-bold mt-2">{institutionStats.totalStudents}</p>
            </div>
            <Users size={48} className="text-blue-200" />
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
              <p className="text-green-100 text-sm">Total Faculty</p>
              <p className="text-4xl font-bold mt-2">{institutionStats.totalFaculty}</p>
            </div>
            <GraduationCap size={48} className="text-green-200" />
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
              <p className="text-purple-100 text-sm">Pass Percentage</p>
              <p className="text-4xl font-bold mt-2">{institutionStats.passPercentage}%</p>
            </div>
            <Award size={48} className="text-purple-200" />
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
              <p className="text-orange-100 text-sm">Departments</p>
              <p className="text-4xl font-bold mt-2">{institutionStats.totalDepartments}</p>
            </div>
            <Building2 size={48} className="text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Departments Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Departments Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">HOD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{dept.name}</div>
                    <div className="text-sm text-gray-500">{dept.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dept.hod ? (
                      <span className="text-gray-900">{dept.hod}</span>
                    ) : (
                      <span className="text-red-600 font-medium">Vacant</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{dept.facultyCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{dept.studentCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${dept.performanceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{dept.performanceScore}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  <span className="text-xs text-purple-600 font-medium">{activity.department}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default PrincipalDashboard;
