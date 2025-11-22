import React, { useState } from 'react';
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

const RevenueAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const [revenueData] = useState({
    today: {
      total: 15680,
      orders: 342,
      avgOrder: 46,
      growth: 12
    },
    week: {
      total: 98500,
      orders: 2156,
      avgOrder: 46,
      growth: 8
    },
    month: {
      total: 425000,
      orders: 8934,
      avgOrder: 48,
      growth: 15
    }
  });

  const [stallRevenue] = useState([
    { name: 'Main Canteen', today: 8500, week: 42500, month: 185000, orders: 156, growth: 12 },
    { name: 'Tea Corner', today: 4200, week: 28000, month: 120000, orders: 134, growth: 8 },
    { name: 'Snacks Hub', today: 3800, week: 19000, month: 82000, orders: 98, growth: -3 },
    { name: 'Juice Bar', today: 2600, week: 15600, month: 67000, orders: 87, growth: 5 },
    { name: 'Bakery Delights', today: 2200, week: 13200, month: 57000, orders: 76, growth: 10 },
    { name: 'Fast Food Corner', today: 1800, week: 10800, month: 46500, orders: 65, growth: -2 }
  ]);

  const [dailyRevenue] = useState([
    { day: 'Mon', amount: 12500 },
    { day: 'Tue', amount: 14200 },
    { day: 'Wed', amount: 13800 },
    { day: 'Thu', amount: 15100 },
    { day: 'Fri', amount: 16800 },
    { day: 'Sat', amount: 18500 },
    { day: 'Sun', amount: 7600 }
  ]);

  const currentData = revenueData[selectedPeriod];
  const maxDailyRevenue = Math.max(...dailyRevenue.map(d => d.amount));

  const handleExport = () => {
    alert('Revenue report exported successfully!');
  };

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
            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
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
              <p className="text-3xl font-bold text-gray-900">₹{currentData.total.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className={`text-sm mt-2 flex items-center ${currentData.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {currentData.growth >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {Math.abs(currentData.growth)}% from previous period
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
              <p className="text-3xl font-bold text-gray-900">{currentData.orders.toLocaleString()}</p>
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
              <p className="text-3xl font-bold text-gray-900">₹{currentData.avgOrder}</p>
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
              <p className="text-3xl font-bold text-gray-900">{currentData.growth}%</p>
            </div>
            <div className={`p-3 rounded-lg ${currentData.growth >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {currentData.growth >= 0 ?
                <TrendingUp className="w-6 h-6 text-green-600" /> :
                <TrendingDown className="w-6 h-6 text-red-600" />
              }
            </div>
          </div>
          <p className={`text-sm mt-2 ${currentData.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                <span className="text-xs text-gray-600 mb-2">₹{(day.amount / 1000).toFixed(1)}k</span>
                <div
                  className="w-full bg-amber-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(day.amount / maxDailyRevenue) * 150}px` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 mt-2">{day.day}</span>
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
                  <td className="px-6 py-4 font-medium text-gray-900">{stall.name}</td>
                  <td className="px-6 py-4 text-right text-gray-600">₹{stall.today.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-600">₹{stall.week.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-600">₹{stall.month.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{stall.orders}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center ${stall.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stall.growth >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                      {Math.abs(stall.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  ₹{stallRevenue.reduce((sum, s) => sum + s.today, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  ₹{stallRevenue.reduce((sum, s) => sum + s.week, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  ₹{stallRevenue.reduce((sum, s) => sum + s.month, 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">
                  {stallRevenue.reduce((sum, s) => sum + s.orders, 0)}
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
