import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  ShoppingBag,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { canteenService } from '../services/canteenService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CanteenDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentOrders: [],
    topStalls: []
  });

  // Load Dashboard
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await canteenService.getDashboard();
      setDashboardData({
        stats: data.stats || {},
        recentOrders: data.recentOrders || [],
        topStalls: data.topStalls || []
      });
    } catch (err) {
      console.error('Error loading canteen dashboard:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const { stats, recentOrders, topStalls } = dashboardData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading and Error States
  if (loading) {
    return <Loading fullScreen message="Loading canteen dashboard..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadDashboard} fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Canteen Dashboard</h1>
        <p className="text-gray-600">Monitor all stalls and orders across the campus canteen</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stalls</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStalls}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Store className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">All active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-blue-600 mt-2">12 pending, 12 preparing</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.todayRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <ArrowUp className="w-3 h-3 mr-1" /> 12% from yesterday
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-purple-600 mt-2">Today's visitors</p>
        </motion.div>
      </div>

      {/* Recent Orders & Top Stalls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => navigate('/canteen/orders')}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.stall} • {order.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performing Stalls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Stalls</h2>
              <button
                onClick={() => navigate('/canteen/stalls')}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {topStalls.map((stall, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-amber-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{stall.name}</p>
                      <p className="text-sm text-gray-600">{stall.orders} orders today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{stall.revenue.toLocaleString()}</p>
                    <p className={`text-xs flex items-center justify-end ${stall.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stall.trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                      {stall.trend === 'up' ? '+8%' : '-3%'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/canteen/stalls')}
            className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-center"
          >
            <Store className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Add New Stall</span>
          </button>
          <button
            onClick={() => navigate('/canteen/orders')}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
          >
            <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">View Orders</span>
          </button>
          <button
            onClick={() => navigate('/canteen/revenue')}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
          >
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Revenue Report</span>
          </button>
          <button
            onClick={() => navigate('/canteen/stalls')}
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
          >
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Manage Stalls</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CanteenDashboard;
