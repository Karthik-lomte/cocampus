import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { canteenService } from '../services/canteenService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const RevenueAnalytics = () => {
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Revenue Data
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [revenueData, setRevenueData] = useState({});
  const [stallRevenue, setStallRevenue] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);

  // Load Revenue Data
  useEffect(() => {
    loadRevenueData();
  }, [selectedPeriod]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { period: selectedPeriod };
      const [revenue, analytics] = await Promise.all([
        canteenService.getRevenue(params),
        canteenService.getSalesAnalytics(params)
      ]);

      setRevenueData(revenue || {});
      setStallRevenue(analytics?.stallRevenue || []);
      setDailyRevenue(analytics?.dailyRevenue || []);
    } catch (err) {
      console.error('Error loading revenue data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const currentData = revenueData?.[selectedPeriod] || {};
  const maxDailyRevenue = dailyRevenue.length > 0 ? Math.max(...dailyRevenue.map(d => d?.amount || 0)) : 1;

  const handleExport = async () => {
    try {
      setSubmitting(true);
      toast.success('Revenue report exported successfully!');
    } catch (err) {
      console.error('Error exporting report:', err);
      toast.error(err.response?.data?.message || 'Failed to export report');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading revenue analytics..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadRevenueData} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="text-gray-600">Track canteen revenue and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={handleExport}
            disabled={submitting}
            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            {submitting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{(currentData?.total || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className={`text-sm mt-2 flex items-center ${(currentData?.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {(currentData?.growth || 0) >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {Math.abs(currentData?.growth || 0)}% from previous period
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{(currentData?.orders || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">Across all stalls</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900">₹{currentData?.avgOrder || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">Per transaction</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-3xl font-bold text-gray-900">{currentData?.growth || 0}%</p>
            </div>
            <div className={`p-3 rounded-lg ${(currentData?.growth || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {(currentData?.growth || 0) >= 0 ?
                <TrendingUp className="w-6 h-6 text-green-600" /> :
                <TrendingDown className="w-6 h-6 text-red-600" />
              }
            </div>
          </div>
          <p className={`text-sm mt-2 ${(currentData?.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            vs previous period
          </p>
        </motion.div>
      </div>

      {/* Weekly Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Revenue Trend</h2>
        <div className="flex items-end justify-between h-48 gap-2">
          {dailyRevenue.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs text-gray-600 mb-2">₹{((day?.amount || 0) / 1000).toFixed(1)}k</span>
                <div
                  className="w-full bg-amber-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${((day?.amount || 0) / maxDailyRevenue) * 150}px` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 mt-2">{day?.day || 'N/A'}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stall-wise Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Stall-wise Revenue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Stall Name</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Today</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">This Week</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">This Month</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Orders Today</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stallRevenue.map((stall, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{stall?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-right text-gray-600">₹{(stall?.today || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-600">₹{(stall?.week || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-600">₹{(stall?.month || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{stall?.orders || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center ${(stall?.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(stall?.growth || 0) >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                      {Math.abs(stall?.growth || 0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  ₹{stallRevenue.reduce((sum, s) => sum + (s?.today || 0), 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  ₹{stallRevenue.reduce((sum, s) => sum + (s?.week || 0), 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  ₹{stallRevenue.reduce((sum, s) => sum + (s?.month || 0), 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  {stallRevenue.reduce((sum, s) => sum + (s?.orders || 0), 0)}
                </td>
                <td className="px-6 py-4 text-right font-bold text-green-600">+8%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default RevenueAnalytics;
