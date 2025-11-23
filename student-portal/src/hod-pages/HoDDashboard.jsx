import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, Clock, Award, TrendingUp,
  FileText, CheckCircle, AlertCircle, Calendar,
  BarChart3, UserCheck, Settings
} from 'lucide-react';
import hodService from '../api/hodService';
import { useAuth } from '../context/AuthContext';

function HoDDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [departmentStats, setDepartmentStats] = useState({
    totalFaculty: 0,
    presentToday: 0,
    totalStudents: 0,
    sectionsCount: 0,
    pendingApprovals: 0,
    leaveRequests: 0,
    gatePasses: 0,
    departmentRating: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [profile, setProfile] = useState({
    name: user?.name || 'HOD',
    designation: 'Head of Department',
    department: user?.department || 'Department',
    avatar: user?.avatar || 'https://via.placeholder.com/150'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [dashboardRes, activitiesRes] = await Promise.all([
        hodService.getHoDDashboardStats(),
        hodService.getRecentActivities(user?.department, 10)
      ]);

      if (dashboardRes.success && dashboardRes.data) {
        setDepartmentStats({
          totalFaculty: dashboardRes.data.totalFaculty || 0,
          presentToday: dashboardRes.data.presentToday || 0,
          totalStudents: dashboardRes.data.totalStudents || 0,
          sectionsCount: dashboardRes.data.sectionsCount || 0,
          pendingApprovals: dashboardRes.data.pendingApprovals || 0,
          leaveRequests: dashboardRes.data.leaveRequests || 0,
          gatePasses: dashboardRes.data.gatePasses || 0,
          departmentRating: dashboardRes.data.departmentRating || 0
        });
      }

      if (activitiesRes.success && activitiesRes.data) {
        setRecentActivities(activitiesRes.data);
      }
    } catch (error) {
      console.error('Error fetching HOD dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Faculty',
      value: departmentStats.totalFaculty,
      subtext: `${departmentStats.presentToday} present today`,
      icon: Users,
      gradient: 'from-blue-600 to-cyan-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Students',
      value: departmentStats.totalStudents,
      subtext: `Across ${departmentStats.sectionsCount} sections`,
      icon: GraduationCap,
      gradient: 'from-purple-600 to-pink-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Pending Approvals',
      value: departmentStats.pendingApprovals,
      subtext: `${departmentStats.leaveRequests} leaves, ${departmentStats.gatePasses} passes`,
      icon: Clock,
      gradient: 'from-orange-600 to-red-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Department Rating',
      value: `${departmentStats.departmentRating}/5`,
      subtext: 'Based on feedback',
      icon: Award,
      gradient: 'from-green-600 to-emerald-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  const quickActions = [
    {
      name: 'Approve Leave',
      icon: FileText,
      gradient: 'from-blue-600 to-cyan-600',
      count: departmentStats.leaveRequests
    },
    {
      name: 'Gate Passes',
      icon: CheckCircle,
      gradient: 'from-green-600 to-emerald-600',
      count: departmentStats.gatePasses
    },
    {
      name: 'View Faculty',
      icon: Users,
      gradient: 'from-purple-600 to-pink-600',
      count: departmentStats.totalFaculty
    },
    {
      name: 'Performance',
      icon: BarChart3,
      gradient: 'from-orange-600 to-red-600',
      count: null
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-orange-600 bg-orange-50',
      low: 'text-blue-600 bg-blue-50'
    };
    return colors[priority] || colors.low;
  };

  const getActivityIcon = (type) => {
    const icons = {
      leave_request: FileText,
      gate_pass: CheckCircle,
      faculty_update: UserCheck,
      performance: TrendingUp
    };
    return icons[type] || AlertCircle;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome, {profile.name}
            </h1>
            <p className="text-green-100 text-lg">
              {profile.designation} - {profile.department}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className={`bg-gradient-to-r ${stat.gradient} p-4`}>
                <div className="flex items-center justify-between">
                  <div className={`${stat.iconBg} p-3 rounded-lg`}>
                    <Icon className={`${stat.iconColor}`} size={24} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.subtext}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Settings size={24} className="text-green-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`relative bg-gradient-to-r ${action.gradient} text-white p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <Icon size={32} className="mb-3" />
                <p className="font-semibold text-sm">{action.name}</p>
                {action.count !== null && (
                  <div className="absolute top-2 right-2 bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {action.count}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={24} className="text-green-600" />
            Recent Activities
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                  {activity.priority}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default HoDDashboard;
