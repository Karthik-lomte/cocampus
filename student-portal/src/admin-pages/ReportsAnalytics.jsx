import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  Filter,
  GraduationCap,
  BookOpen,
  Award,
  PieChart,
  X,
  RefreshCw,
  FileText,
  Bell,
  CheckCircle
} from 'lucide-react';
import adminService from '../api/adminService';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    departments: [],
    users: [],
    feeStats: {},
    subjects: [],
    notices: [],
    approvals: []
  });
  const [filters, setFilters] = useState({
    department: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [depts, users, feeStats, subjects, notices, approvals] = await Promise.all([
        adminService.getDepartments(),
        adminService.getUsers(),
        adminService.getFeeStats(),
        adminService.getSubjects(),
        adminService.getNotices(),
        adminService.getApprovals()
      ]);

      setData({
        departments: depts.success ? depts.data : [],
        users: users.success ? users.data : [],
        feeStats: feeStats.success ? feeStats.data : {},
        subjects: subjects.success ? subjects.data : [],
        notices: notices.success ? notices.data : [],
        approvals: approvals.success ? approvals.data : []
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      alert('Error loading analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const students = data.users.filter(u => u.role === 'Student');
    const faculty = data.users.filter(u => u.role === 'Faculty');

    return {
      totalStudents: students.length,
      totalFaculty: faculty.length,
      totalDepartments: data.departments.length,
      totalSubjects: data.subjects.length,
      totalNotices: data.notices.length,
      activeNotices: data.notices.filter(n => n.isPinned).length,
      pendingApprovals: data.approvals.filter(a => a.status === 'Pending').length,
      feeCollected: data.feeStats.totalCollected || 0,
      feePending: data.feeStats.totalPending || 0
    };
  }, [data]);

  // Department-wise statistics
  const departmentStats = useMemo(() => {
    return data.departments.map(dept => {
      const deptSubjects = data.subjects.filter(s => s.department === dept.name);
      const theorySubjects = deptSubjects.filter(s => s.type === 'Theory').length;
      const labSubjects = deptSubjects.filter(s => s.type === 'Lab').length;

      return {
        name: dept.name,
        code: dept.code,
        students: dept.studentCount || 0,
        faculty: dept.facultyCount || 0,
        subjects: deptSubjects.length,
        theory: theorySubjects,
        lab: labSubjects,
        performance: dept.performance || 0
      };
    });
  }, [data.departments, data.subjects]);

  // Subject type distribution
  const subjectDistribution = useMemo(() => {
    const theory = data.subjects.filter(s => s.type === 'Theory').length;
    const lab = data.subjects.filter(s => s.type === 'Lab').length;
    const elective = data.subjects.filter(s => s.type === 'Elective').length;

    return { theory, lab, elective };
  }, [data.subjects]);

  // Approval statistics
  const approvalStats = useMemo(() => {
    const byStatus = data.approvals.reduce((acc, approval) => {
      acc[approval.status] = (acc[approval.status] || 0) + 1;
      return acc;
    }, {});

    const byType = data.approvals.reduce((acc, approval) => {
      acc[approval.type] = (acc[approval.type] || 0) + 1;
      return acc;
    }, {});

    return { byStatus, byType };
  }, [data.approvals]);

  // Notice statistics
  const noticeStats = useMemo(() => {
    const byCategory = data.notices.reduce((acc, notice) => {
      acc[notice.category] = (acc[notice.category] || 0) + 1;
      return acc;
    }, {});

    const byPriority = data.notices.reduce((acc, notice) => {
      acc[notice.priority] = (acc[notice.priority] || 0) + 1;
      return acc;
    }, {});

    return { byCategory, byPriority };
  }, [data.notices]);

  // Filtered department stats
  const filteredDepartmentStats = useMemo(() => {
    if (filters.department === 'all') return departmentStats;
    return departmentStats.filter(d => d.name === filters.department);
  }, [departmentStats, filters.department]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const clearFilters = () => {
    setFilters({ department: 'all', dateFrom: '', dateTo: '' });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.department !== 'all') count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-indigo-100">Comprehensive insights and data visualization</p>
          </div>
          <button
            onClick={fetchAllData}
            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {data.departments.map(dept => (
              <option key={dept._id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="From Date"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="To Date"
          />
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Enrolled"
          color="blue"
        />
        <StatCard
          icon={GraduationCap}
          title="Total Faculty"
          value={stats.totalFaculty}
          subtitle="Teaching staff"
          color="green"
        />
        <StatCard
          icon={BookOpen}
          title="Total Subjects"
          value={stats.totalSubjects}
          subtitle="Across departments"
          color="purple"
        />
        <StatCard
          icon={Building2}
          title="Departments"
          value={stats.totalDepartments}
          subtitle="Active"
          color="orange"
        />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fee Collection</h3>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Collected</span>
                <span className="font-semibold text-green-600">{formatCurrency(stats.feeCollected)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${stats.feeCollected / (stats.feeCollected + stats.feePending) * 100}%`
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-red-600">{formatCurrency(stats.feePending)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${stats.feePending / (stats.feeCollected + stats.feePending) * 100}%`
                  }}
                />
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Collection Rate</span>
                <span className="text-sm font-semibold text-indigo-600">
                  {((stats.feeCollected / (stats.feeCollected + stats.feePending)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Approvals Status</h3>
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            {Object.entries(approvalStats.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{status}</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                  {count}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-4 mt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{data.approvals.length}</p>
              <p className="text-sm text-gray-600">Total Requests</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Department Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Faculty</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Subjects</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Theory</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Lab</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDepartmentStats.map((dept) => (
                <tr key={dept.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{dept.name}</p>
                      <p className="text-sm text-gray-500">{dept.code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">{dept.students}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">{dept.faculty}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-indigo-600">{dept.subjects}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">{dept.theory}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">{dept.lab}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <div className="w-24">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">{dept.performance}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${dept.performance}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Subject & Notice Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Subject Distribution</h3>
            <PieChart className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Theory</span>
              </div>
              <span className="text-sm font-semibold">{subjectDistribution.theory}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Lab</span>
              </div>
              <span className="text-sm font-semibold">{subjectDistribution.lab}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Elective</span>
              </div>
              <span className="text-sm font-semibold">{subjectDistribution.elective}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Notice Categories</h3>
            <Bell className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-3">
            {Object.entries(noticeStats.byCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{category}</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                  {count}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-4 mt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pinned Notices</span>
              <span className="font-semibold text-indigo-600">{stats.activeNotices}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Download className="w-5 h-5 mr-2" />
          Export Report (PDF)
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

const Building2 = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export default ReportsAnalytics;
