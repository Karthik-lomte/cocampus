import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Award, Users, GraduationCap, DollarSign } from 'lucide-react';
import { principalData } from '../principal-data/principalData';

function Performance() {
  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={16} className="text-green-600" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-red-600" />;
    return <Minus size={16} className="text-gray-600" />;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-600 bg-green-50';
    if (trend === 'down') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="text-gray-600 mt-1">Institution-wide performance metrics and trends</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100 text-sm">Pass Percentage</p>
            <Award size={24} className="text-green-200" />
          </div>
          <p className="text-4xl font-bold">{principalData.institutionStats.passPercentage}%</p>
          <p className="text-green-100 text-xs mt-2">Current Academic Year</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm">Average CGPA</p>
            <GraduationCap size={24} className="text-blue-200" />
          </div>
          <p className="text-4xl font-bold">{principalData.institutionStats.averageCGPA}</p>
          <p className="text-blue-100 text-xs mt-2">Institution Average</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100 text-sm">Top Performers</p>
            <Award size={24} className="text-purple-200" />
          </div>
          <p className="text-4xl font-bold">{principalData.institutionStats.toppersCount}</p>
          <p className="text-purple-100 text-xs mt-2">Students with 9+ CGPA</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100 text-sm">Faculty Strength</p>
            <Users size={24} className="text-orange-200" />
          </div>
          <p className="text-4xl font-bold">{principalData.institutionStats.totalFaculty}</p>
          <p className="text-orange-100 text-xs mt-2">Active Faculty Members</p>
        </motion.div>
      </div>

      {/* Department-wise Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="mr-2 text-purple-600" size={24} />
            Department-wise Performance
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {principalData.performanceMetrics.departmentWise.map((dept, index) => (
              <motion.div
                key={dept.department}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{dept.department}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTrendColor(dept.trend)}`}>
                      {getTrendIcon(dept.trend)}
                      <span className="ml-1 capitalize">{dept.trend}</span>
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{dept.performance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all"
                    style={{ width: `${dept.performance}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Academic Results Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Award className="mr-2 text-indigo-600" size={24} />
            Academic Results Distribution
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Distinction (75%+)</p>
              <p className="text-3xl font-bold text-green-600">{principalData.performanceMetrics.academicResults.distinction}%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">First Class (60-75%)</p>
              <p className="text-3xl font-bold text-blue-600">{principalData.performanceMetrics.academicResults.firstClass}%</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
              <p className="text-sm text-gray-600 mb-2">Second Class (50-60%)</p>
              <p className="text-3xl font-bold text-yellow-600">{principalData.performanceMetrics.academicResults.secondClass}%</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Pass Percentage</p>
              <p className="text-3xl font-bold text-purple-600">{principalData.performanceMetrics.academicResults.passPercentage}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Financial Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <DollarSign className="mr-2 text-green-600" size={24} />
            Financial Overview
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Fee Collected</p>
              <p className="text-2xl font-bold text-green-600">₹{(principalData.institutionStats.feeCollected / 10000000).toFixed(1)} Cr</p>
              <p className="text-xs text-gray-500 mt-1">Current Year</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
              <p className="text-sm text-gray-600 mb-2">Pending Dues</p>
              <p className="text-2xl font-bold text-orange-600">₹{(principalData.institutionStats.pendingDues / 10000000).toFixed(1)} Cr</p>
              <p className="text-xs text-gray-500 mt-1">Outstanding Amount</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Budget Utilization</p>
              <p className="text-2xl font-bold text-blue-600">{principalData.institutionStats.budgetUtilized}%</p>
              <p className="text-xs text-gray-500 mt-1">Of Total Budget</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Performance;
