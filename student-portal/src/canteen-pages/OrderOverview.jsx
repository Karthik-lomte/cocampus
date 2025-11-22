import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const OrderOverview = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customerName: 'Rahul Sharma',
      customerId: 'STU2022001',
      stall: 'Main Canteen',
      items: [
        { name: 'Veg Thali', qty: 1, price: 80 },
        { name: 'Lassi', qty: 1, price: 30 }
      ],
      totalAmount: 110,
      status: 'completed',
      paymentMethod: 'Campus Coins',
      orderTime: '2024-11-20 10:30 AM',
      completedTime: '2024-11-20 10:45 AM'
    },
    {
      id: 'ORD002',
      customerName: 'Priya Patel',
      customerId: 'STU2022045',
      stall: 'Tea Corner',
      items: [
        { name: 'Masala Tea', qty: 2, price: 40 },
        { name: 'Samosa', qty: 2, price: 30 }
      ],
      totalAmount: 70,
      status: 'preparing',
      paymentMethod: 'Campus Coins',
      orderTime: '2024-11-20 10:35 AM',
      completedTime: null
    },
    {
      id: 'ORD003',
      customerName: 'Amit Singh',
      customerId: 'STU2022078',
      stall: 'Juice Bar',
      items: [
        { name: 'Orange Juice', qty: 1, price: 50 },
        { name: 'Mixed Fruit', qty: 1, price: 60 }
      ],
      totalAmount: 110,
      status: 'pending',
      paymentMethod: 'Campus Coins',
      orderTime: '2024-11-20 10:40 AM',
      completedTime: null
    },
    {
      id: 'ORD004',
      customerName: 'Neha Gupta',
      customerId: 'STU2022032',
      stall: 'Snacks Hub',
      items: [
        { name: 'Veg Burger', qty: 1, price: 60 },
        { name: 'French Fries', qty: 1, price: 40 }
      ],
      totalAmount: 100,
      status: 'completed',
      paymentMethod: 'Campus Coins',
      orderTime: '2024-11-20 10:20 AM',
      completedTime: '2024-11-20 10:35 AM'
    },
    {
      id: 'ORD005',
      customerName: 'Vikram Joshi',
      customerId: 'STU2022056',
      stall: 'Bakery Delights',
      items: [
        { name: 'Chocolate Cake', qty: 1, price: 80 },
        { name: 'Coffee', qty: 1, price: 40 }
      ],
      totalAmount: 120,
      status: 'cancelled',
      paymentMethod: 'Campus Coins',
      orderTime: '2024-11-20 10:15 AM',
      completedTime: null,
      cancelReason: 'Customer cancelled'
    },
    {
      id: 'ORD006',
      customerName: 'Sanjay Kumar',
      customerId: 'FAC2022010',
      stall: 'Main Canteen',
      items: [
        { name: 'Special Thali', qty: 1, price: 120 },
        { name: 'Buttermilk', qty: 1, price: 25 }
      ],
      totalAmount: 145,
      status: 'preparing',
      paymentMethod: 'Campus Coins',
      orderTime: '2024-11-20 10:42 AM',
      completedTime: null
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stallFilter, setStallFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const stalls = ['Main Canteen', 'Tea Corner', 'Juice Bar', 'Snacks Hub', 'Bakery Delights'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesStall = stallFilter === 'all' || order.stall === stallFilter;
    return matchesSearch && matchesStatus && matchesStall;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'preparing': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const orderStats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    pending: orders.filter(o => o.status === 'pending').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders Overview</h1>
        <p className="text-gray-600">Monitor all orders across canteen stalls</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-100 text-center">
          <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 text-center">
          <p className="text-2xl font-bold text-yellow-600">{orderStats.preparing}</p>
          <p className="text-sm text-gray-600">Preparing</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 text-center">
          <p className="text-2xl font-bold text-blue-600">{orderStats.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-center">
          <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
          <p className="text-sm text-gray-600">Cancelled</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={stallFilter}
            onChange={(e) => setStallFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Stalls</option>
            {stalls.map(stall => (
              <option key={stall} value={stall}>{stall}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Order ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Stall</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Items</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Time</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-600">{order.customerId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.stall}</td>
                  <td className="px-6 py-4 text-gray-600">{order.items.length} items</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.orderTime.split(' ').slice(1).join(' ')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">{selectedOrder.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Customer</span>
                <span className="font-medium">{selectedOrder.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Customer ID</span>
                <span className="font-medium">{selectedOrder.customerId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Stall</span>
                <span className="font-medium">{selectedOrder.stall}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-900 mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.name} x {item.qty}</span>
                      <span className="font-medium">₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-bold text-lg">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Order Time</span>
                  <span className="font-medium">{selectedOrder.orderTime}</span>
                </div>
                {selectedOrder.completedTime && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completed Time</span>
                    <span className="font-medium">{selectedOrder.completedTime}</span>
                  </div>
                )}
                {selectedOrder.cancelReason && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cancel Reason</span>
                    <span className="font-medium text-red-600">{selectedOrder.cancelReason}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderOverview;
