import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, TrendingUp, DollarSign,
  Building2, Award, FileText, Calendar, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import principalService from '../api/principalService';

function PrincipalDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalDepartments: 0,
    pendingApprovals: 0,
    feeCollected: 0,
    feePending: 0
  });
  const [departments, setDepartments] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const isRefresh = !loading;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [dashboardRes, deptsRes, leavesRes, approvalsRes] = await Promise.all([
        principalService.getPrincipalDashboardStats(),
        principalService.getDepartments(),
        principalService.getLeaves({ status: 'pending' }),
        principalService.getApprovals({ status: 'pending' })
      ]);

      if (dashboardRes.success) {
        const dashData = dashboardRes.data;
        setStats({
          totalStudents: dashData.totalStudents || 0,
          totalFaculty: dashData.totalFaculty || 0,
          totalDepartments: dashData.totalDepartments || 0,
          pendingApprovals: approvalsRes.success ? approvalsRes.count : 0,
          feeCollected: dashData.feeStats?.totalCollected || 0,
          feePending: dashData.feeStats?.totalPending || 0
        });
      }

      if (deptsRes.success) {
        setDepartments(deptsRes.data.slice(0, 4)); // Top 4 departments
      }

      if (leavesRes.success) {
        setRecentLeaves(leavesRes.data.slice(0, 5)); // Recent 5 leave requests
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome, {user?.name || 'Principal'}
            </h1>
            <p className="text-purple-100 text-lg">Co-Campus College of Engineering</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-6 h-6 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
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
              <p className="text-4xl font-bold mt-2">{stats.totalStudents}</p>
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
              <p className="text-4xl font-bold mt-2">{stats.totalFaculty}</p>
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
              <p className="text-purple-100 text-sm">Departments</p>
              <p className="text-4xl font-bold mt-2">{stats.totalDepartments}</p>
            </div>
            <Building2 size={48} className="text-purple-200" />
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
              <p className="text-orange-100 text-sm">Pending Approvals</p>
              <p className="text-4xl font-bold mt-2">{stats.pendingApprovals}</p>
            </div>
            <FileText size={48} className="text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Fee Collection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fee Collection</h3>
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Collected</span>
                <span className="font-semibold text-green-600">
                  ₹{(stats.feeCollected / 10000000).toFixed(2)}Cr
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.feeCollected / (stats.feeCollected + stats.feePending)) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Pending</span>
                <span className="font-semibold text-orange-600">
                  ₹{(stats.feePending / 10000000).toFixed(2)}Cr
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(stats.feePending / (stats.feeCollected + stats.feePending)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium text-purple-700">
              View Reports
            </button>
            <button className="p-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium text-blue-700">
              Manage Dept.
            </button>
            <button className="p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium text-green-700">
              Approve Leaves
            </button>
            <button className="p-3 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium text-orange-700">
              View Calendar
            </button>
          </div>
        </motion.div>
      </div>

      {/* Departments Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 mb-2">{dept.name}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Code: <span className="font-medium">{dept.code}</span></p>
                <p>HOD: <span className="font-medium">{dept.hod && typeof dept.hod === 'object' ? dept.hod.name : (dept.hodName || 'Not Assigned')}</span></p>
                <p>Faculty: <span className="font-medium">{dept.facultyCount || 0}</span></p>
                <p>Students: <span className="font-medium">{dept.studentCount || 0}</span></p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Leave Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Leave Requests</h3>
          <span className="text-sm text-purple-600 font-medium cursor-pointer hover:underline">
            View All
          </span>
        </div>
        {recentLeaves.length > 0 ? (
          <div className="space-y-3">
            {recentLeaves.map((leave) => (
              <div
                key={leave._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{leave.userName}</p>
                  <p className="text-sm text-gray-600">
                    {leave.leaveType} • {leave.days} day(s)
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Pending
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(leave.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No pending leave requests</p>
        )}
      </motion.div>
    </div>
  );
}

export default PrincipalDashboard;
