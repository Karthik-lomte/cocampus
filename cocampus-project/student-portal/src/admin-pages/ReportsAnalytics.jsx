import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Download,
  Filter,
  GraduationCap,
  BookOpen,
  Award,
  PieChart,
  X
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ReportsAnalytics = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportsData, setReportsData] = useState(null);

  const [filters, setFilters] = useState({
    department: 'all',
    semester: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    loadReportsData();
  }, [filters]);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getReports(filters);
      setReportsData(data);
    } catch (err) {
      console.error('Reports error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading reports and analytics..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadReportsData} fullScreen />;

  const departments = reportsData?.departments || [];
  const semesters = reportsData?.semesters || ['1', '2', '3', '4', '5', '6', '7', '8'];
  const performanceData = reportsData?.performanceData || [];
  const feeData = reportsData?.feeData || {
    totalExpected: 0,
    totalCollected: 0,
    pending: 0,
    collectionRate: 0,
    departmentWise: []
  };
  const attendanceData = reportsData?.attendanceData || [];
  const facultyWorkload = reportsData?.facultyWorkload || [];

  // Check if any filter is active
  const isFiltered = useMemo(() => {
    return filters.department !== 'all' ||
           filters.semester !== 'all' ||
           filters.dateFrom !== '' ||
           filters.dateTo !== '';
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.department !== 'all') count++;
    if (filters.semester !== 'all') count++;
    if (filters.dateFrom !== '') count++;
    if (filters.dateTo !== '') count++;
    return count;
  }, [filters]);

  // Filtered Performance Data
  const filteredPerformanceData = useMemo(() => {
    if (filters.department === 'all') {
      return performanceData;
    }
    return performanceData.filter(item => item.department === filters.department);
  }, [filters.department, performanceData]);

  // Filtered Fee Data (department wise)
  const filteredFeeDataDeptWise = useMemo(() => {
    if (filters.department === 'all') {
      return feeData.departmentWise;
    }
    return feeData.departmentWise.filter(item => item.department === filters.department);
  }, [filters.department, feeData.departmentWise]);

  // Filtered Attendance Data
  const filteredAttendanceData = useMemo(() => {
    if (filters.department === 'all') {
      return attendanceData;
    }
    return attendanceData.filter(item => item.department === filters.department);
  }, [filters.department, attendanceData]);

  // Filtered Faculty Workload Data
  const filteredFacultyWorkload = useMemo(() => {
    if (filters.department === 'all') {
      return facultyWorkload;
    }
    return facultyWorkload.filter(item => item.department === filters.department);
  }, [filters.department, facultyWorkload]);

  // Calculate summary stats based on filtered data
  const summaryStats = useMemo(() => {
    // Pass Rate
    const totalPassed = filteredPerformanceData.reduce((sum, item) => sum + item.passed, 0);
    const avgPassRate = filteredPerformanceData.length > 0
      ? (totalPassed / filteredPerformanceData.length).toFixed(1)
      : 0;

    // Fee Collection
    const totalCollected = filteredFeeDataDeptWise.reduce((sum, item) => sum + item.collected, 0);
    const totalPending = filteredFeeDataDeptWise.reduce((sum, item) => sum + item.pending, 0);
    const collectionRate = totalCollected + totalPending > 0
      ? Math.round((totalCollected / (totalCollected + totalPending)) * 100)
      : 0;

    // Attendance
    const totalAttendance = filteredAttendanceData.reduce((sum, item) => sum + item.overall, 0);
    const avgAttendance = filteredAttendanceData.length > 0
      ? (totalAttendance / filteredAttendanceData.length).toFixed(1)
      : 0;

    // Faculty
    const totalFaculty = filteredFacultyWorkload.reduce((sum, item) => sum + item.faculty, 0);
    const totalHours = filteredFacultyWorkload.reduce((sum, item) => sum + item.avgHours * item.faculty, 0);
    const avgHoursWeek = totalFaculty > 0
      ? (totalHours / totalFaculty).toFixed(1)
      : 0;

    return {
      passRate: avgPassRate,
      collectionRate,
      totalCollected,
      avgAttendance,
      totalFaculty,
      avgHoursWeek
    };
  }, [filteredPerformanceData, filteredFeeDataDeptWise, filteredAttendanceData, filteredFacultyWorkload]);

  // Filtered fee summary data
  const filteredFeeSummary = useMemo(() => {
    const totalCollected = filteredFeeDataDeptWise.reduce((sum, item) => sum + item.collected, 0);
    const totalPending = filteredFeeDataDeptWise.reduce((sum, item) => sum + item.pending, 0);
    const collectionRate = totalCollected + totalPending > 0
      ? Math.round((totalCollected / (totalCollected + totalPending)) * 100)
      : 0;

    return {
      totalCollected,
      pending: totalPending,
      collectionRate
    };
  }, [filteredFeeDataDeptWise]);

  const handleExport = (reportType) => {
    alert(`Exporting ${reportType} report as PDF...`);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      department: 'all',
      semester: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-indigo-100">Comprehensive insights and data analysis for institution management</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Pass Rate</p>
              <p className="text-3xl font-bold text-gray-900">{summaryStats.passRate}%</p>
              <p className="text-xs text-green-600 mt-1">
                {isFiltered ? `${filteredPerformanceData.length} dept(s)` : '+2.3% from last sem'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
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
              <p className="text-sm text-gray-600">Fee Collection</p>
              <p className="text-3xl font-bold text-gray-900">{summaryStats.collectionRate}%</p>
              <p className="text-xs text-blue-600 mt-1">
                Rs. {(summaryStats.totalCollected / 10000000).toFixed(2)} Cr collected
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-3xl font-bold text-gray-900">{summaryStats.avgAttendance}%</p>
              <p className="text-xs text-purple-600 mt-1">
                {isFiltered ? `${filteredAttendanceData.length} dept(s)` : 'Across all depts'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm text-gray-600">Total Faculty</p>
              <p className="text-3xl font-bold text-gray-900">{summaryStats.totalFaculty}</p>
              <p className="text-xs text-amber-600 mt-1">{summaryStats.avgHoursWeek} avg hrs/week</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`bg-white rounded-xl shadow-sm p-4 border ${isFiltered ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-100'}`}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters:</span>
            {isFiltered && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </div>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              filters.department !== 'all' ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300'
            }`}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={filters.semester}
            onChange={(e) => handleFilterChange('semester', e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              filters.semester !== 'all' ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300'
            }`}
          >
            <option value="all">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              filters.dateFrom !== '' ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300'
            }`}
            placeholder="From Date"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              filters.dateTo !== '' ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300'
            }`}
            placeholder="To Date"
          />
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
        {isFiltered && (
          <div className="mt-3 pt-3 border-t border-indigo-200">
            <p className="text-sm text-indigo-600 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              Showing filtered results
              {filters.department !== 'all' && ` for ${filters.department}`}
            </p>
          </div>
        )}
      </motion.div>

      {/* Student Performance Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Student Performance Report
              {isFiltered && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                  {filteredPerformanceData.length} result(s)
                </span>
              )}
            </h2>
            <button
              onClick={() => handleExport('Student Performance')}
              className="flex items-center px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pass %</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Fail %</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Score</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Top Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPerformanceData.length > 0 ? (
                  filteredPerformanceData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">{row.department}</td>
                      <td className="px-4 py-4 text-center text-green-600 font-medium">{row.passed}%</td>
                      <td className="px-4 py-4 text-center text-red-600">{row.failed}%</td>
                      <td className="px-4 py-4 text-center text-gray-600">{row.avgScore}</td>
                      <td className="px-4 py-4 text-center text-indigo-600 font-medium">{row.topScore}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                            <div
                              className={`h-2 rounded-full ${
                                row.passed >= 90 ? 'bg-green-500' :
                                row.passed >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${row.passed}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No data found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Fee Collection Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Fee Collection Report
              {isFiltered && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                  {filteredFeeDataDeptWise.length} result(s)
                </span>
              )}
            </h2>
            <button
              onClick={() => handleExport('Fee Collection')}
              className="flex items-center px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        <div className="p-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Total Collected</p>
              <p className="text-xl font-bold text-green-600">Rs. {(filteredFeeSummary.totalCollected / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-xl font-bold text-red-600">Rs. {(filteredFeeSummary.pending / 100000).toFixed(2)} L</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Collection Rate</p>
              <p className="text-xl font-bold text-blue-600">{filteredFeeSummary.collectionRate}%</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Collected</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pending</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFeeDataDeptWise.length > 0 ? (
                  filteredFeeDataDeptWise.map((row, index) => {
                    const total = row.collected + row.pending;
                    const percentage = Math.round((row.collected / total) * 100);
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 font-medium text-gray-900">{row.department}</td>
                        <td className="px-4 py-4 text-right text-green-600">Rs. {(row.collected / 100000).toFixed(1)}L</td>
                        <td className="px-4 py-4 text-right text-red-600">Rs. {(row.pending / 100000).toFixed(1)}L</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                              <div
                                className="h-2 rounded-full bg-indigo-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No data found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Attendance Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Attendance Report
              {isFiltered && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                  {filteredAttendanceData.length} result(s)
                </span>
              )}
            </h2>
            <button
              onClick={() => handleExport('Attendance')}
              className="flex items-center px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Overall %</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Theory %</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Practical %</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttendanceData.length > 0 ? (
                  filteredAttendanceData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">{row.department}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          row.overall >= 85 ? 'bg-green-100 text-green-700' :
                          row.overall >= 75 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {row.overall}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">{row.theory}%</td>
                      <td className="px-4 py-4 text-center text-gray-600">{row.practical}%</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${
                                row.overall >= 85 ? 'bg-green-500' :
                                row.overall >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${row.overall}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No data found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Faculty Workload Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Faculty Workload Report
              {isFiltered && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                  {filteredFacultyWorkload.length} result(s)
                </span>
              )}
            </h2>
            <button
              onClick={() => handleExport('Faculty Workload')}
              className="flex items-center px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Faculty Count</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Hours/Week</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Classes</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Students</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFacultyWorkload.length > 0 ? (
                  filteredFacultyWorkload.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">{row.department}</td>
                      <td className="px-4 py-4 text-center text-gray-600">{row.faculty}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          row.avgHours <= 18 ? 'bg-green-100 text-green-700' :
                          row.avgHours <= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {row.avgHours}h
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">{row.totalClasses}</td>
                      <td className="px-4 py-4 text-center text-gray-600">{row.avgStudents}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${
                                row.avgHours <= 18 ? 'bg-green-500' :
                                row.avgHours <= 20 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(row.avgHours / 24) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No data found for the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsAnalytics;
