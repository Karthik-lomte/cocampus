import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const AdminDashboard = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading admin dashboard..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadDashboardData} fullScreen />;

  const stats = dashboardData?.stats || {
    totalStudents: 0,
    totalFaculty: 0,
    departments: 0,
    feeCollected: 0,
    pendingApprovals: 0,
    activeEvents: 0
  };

  const recentActivities = dashboardData?.recentActivities || [];
  const pendingTasks = dashboardData?.pendingTasks || [];
  const departmentStats = dashboardData?.departmentStats || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome, Administrator</h1>
        <p className="text-indigo-100">System overview and management dashboard</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+120 this month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Total Faculty</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFaculty}</p>
              <p className="text-xs text-green-600 mt-1">+5 this month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.departments}</p>
              <p className="text-xs text-gray-500 mt-1">All active</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fee Collected</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.feeCollected}Cr</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Pending Tasks
              </h2>
              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                {pendingTasks.length} pending
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingTasks.map((task) => (
              <Link
                key={task.id}
                to={task.link}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-gray-700">{task.task}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${
                    activity.status === 'success' ? 'text-green-500' :
                    activity.status === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                  }`}>
                    {activity.status === 'success' ? <CheckCircle size={16} /> :
                     activity.status === 'warning' ? <AlertTriangle size={16} /> :
                     <Bell size={16} />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Department Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Department Performance
            </h2>
            <Link to="/admin/departments" className="text-sm text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departmentStats.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{dept.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">{dept.students}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">{dept.faculty}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            dept.performance >= 85 ? 'bg-green-500' :
                            dept.performance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${dept.performance}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{dept.performance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Link to="/admin/users" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-900">Add User</span>
        </Link>
        <Link to="/admin/notices" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
          <Bell className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-900">Post Notice</span>
        </Link>
        <Link to="/admin/academic" className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
          <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-900">Upload Marks</span>
        </Link>
        <Link to="/admin/reports" className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-center transition-colors">
          <TrendingUp className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <span className="text-sm font-medium text-gray-900">View Reports</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
