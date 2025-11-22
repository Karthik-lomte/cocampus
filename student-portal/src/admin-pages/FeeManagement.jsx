import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  CreditCard,
  TrendingUp,
  Calendar,
  User,
  Download,
  RefreshCw
} from 'lucide-react';
import adminService from '../api/adminService';

const FeeManagement = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState('structure');
  const [formData, setFormData] = useState({
    semester: '', tuition: '', development: '', exam: '', library: '', sports: '', lab: ''
  });
  const [paymentFormData, setPaymentFormData] = useState({
    studentId: '', studentName: '', semester: '', paidAmount: '', paymentMethod: '', transactionId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [structuresRes, paymentsRes, statsRes] = await Promise.all([
        adminService.getFeeStructures(),
        adminService.getFeePayments(),
        adminService.getFeeStats()
      ]);

      if (structuresRes.success) setFeeStructures(structuresRes.data);
      if (paymentsRes.success) setPayments(paymentsRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching fee data:', error);
      alert('Error loading fee data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (fee) => {
    return fee.tuition + fee.development + fee.exam + fee.library + fee.sports + fee.lab;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || payment.semester?.toString() === semesterFilter;
    const matchesStatus = statusFilter === 'all' || payment.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesSemester && matchesStatus;
  });

  const handleAddFeeStructure = async (e) => {
    e.preventDefault();
    try {
      const feeData = {
        semester: parseInt(formData.semester),
        tuition: parseFloat(formData.tuition),
        development: parseFloat(formData.development),
        exam: parseFloat(formData.exam),
        library: parseFloat(formData.library),
        sports: parseFloat(formData.sports),
        lab: parseFloat(formData.lab)
      };
      const response = await adminService.createFeeStructure(feeData);
      if (response.success) {
        alert('Fee structure added successfully!');
        setShowAddModal(false);
        setFormData({ semester: '', tuition: '', development: '', exam: '', library: '', sports: '', lab: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding fee structure:', error);
      alert(error.response?.data?.message || 'Error adding fee structure. Please try again.');
    }
  };

  const handleEditFeeStructure = async (e) => {
    e.preventDefault();
    try {
      const feeData = {
        tuition: parseFloat(formData.tuition),
        development: parseFloat(formData.development),
        exam: parseFloat(formData.exam),
        library: parseFloat(formData.library),
        sports: parseFloat(formData.sports),
        lab: parseFloat(formData.lab)
      };
      const response = await adminService.updateFeeStructure(selectedFee._id, feeData);
      if (response.success) {
        alert('Fee structure updated successfully!');
        setShowEditModal(false);
        setSelectedFee(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating fee structure:', error);
      alert(error.response?.data?.message || 'Error updating fee structure. Please try again.');
    }
  };

  const handleDeleteFeeStructure = async (feeId) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      try {
        const response = await adminService.deleteFeeStructure(feeId);
        if (response.success) {
          alert('Fee structure deleted successfully!');
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting fee structure:', error);
        alert(error.response?.data?.message || 'Cannot delete fee structure with existing payments.');
      }
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        paidAmount: parseFloat(paymentFormData.paidAmount),
        paymentMethod: paymentFormData.paymentMethod,
        transactionId: paymentFormData.transactionId,
        paymentDate: new Date()
      };
      const response = await adminService.updateFeePayment(selectedPayment._id, paymentData);
      if (response.success) {
        alert('Payment updated successfully!');
        setShowPaymentModal(false);
        setSelectedPayment(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      alert(error.response?.data?.message || 'Error updating payment. Please try again.');
    }
  };

  const openEditModal = (fee) => {
    setSelectedFee(fee);
    setFormData({
      semester: fee.semester.toString(),
      tuition: fee.tuition.toString(),
      development: fee.development.toString(),
      exam: fee.exam.toString(),
      library: fee.library.toString(),
      sports: fee.sports.toString(),
      lab: fee.lab.toString()
    });
    setShowEditModal(true);
  };

  const openPaymentModal = (payment) => {
    setSelectedPayment(payment);
    setPaymentFormData({
      studentId: payment.studentId,
      studentName: payment.studentName,
      semester: payment.semester,
      paidAmount: payment.paidAmount || '',
      paymentMethod: payment.paymentMethod || 'Online',
      transactionId: payment.transactionId || ''
    });
    setShowPaymentModal(true);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'paid': return 'green';
      case 'pending': return 'yellow';
      case 'partial': return 'blue';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'partial': return Clock;
      case 'overdue': return AlertTriangle;
      default: return Clock;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fee data...</p>
        </div>
      </div>
    );
  }

  const totalFeeStructure = feeStructures.reduce((sum, fee) => sum + (fee.totalAmount || 0), 0);
  const feeCollected = stats.totalCollected || 0;
  const pendingDues = stats.totalPending || 0;

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
            <h1 className="text-3xl font-bold mb-2">Fee Management</h1>
            <p className="text-indigo-100">Manage fee structures and track student payments</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Fee Structure</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFeeStructure)}</p>
              <p className="text-xs text-gray-500 mt-1">{feeStructures.length} semesters</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-600" />
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
              <p className="text-sm text-gray-600">Fee Collected</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(feeCollected)}</p>
              <p className="text-xs text-green-600 mt-1">{payments.filter(p => p.status === 'Paid').length} payments</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
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
              <p className="text-sm text-gray-600">Pending Dues</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(pendingDues)}</p>
              <p className="text-xs text-red-600 mt-1">{payments.filter(p => p.status !== 'Paid').length} pending</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('structure')}
              className={`flex items-center px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === 'structure'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              Fee Structure
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === 'payments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Student Payments
              {payments.filter(p => p.status === 'Pending').length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                  {payments.filter(p => p.status === 'Pending').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Fee Structure Tab */}
        {activeTab === 'structure' && (
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Fee Structure
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tuition</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Development</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Exam</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Library</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sports</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lab</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feeStructures.sort((a, b) => a.semester - b.semester).map((fee) => (
                    <tr key={fee._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Semester {fee.semester}</td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900">{formatCurrency(fee.tuition)}</td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900">{formatCurrency(fee.development)}</td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900">{formatCurrency(fee.exam)}</td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900">{formatCurrency(fee.library)}</td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900">{formatCurrency(fee.sports)}</td>
                      <td className="px-4 py-4 text-sm text-right text-gray-900">{formatCurrency(fee.lab)}</td>
                      <td className="px-4 py-4 text-sm text-right font-semibold text-indigo-600">
                        {formatCurrency(fee.totalAmount)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditModal(fee)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFeeStructure(fee._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {feeStructures.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No fee structures found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by student name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Semester</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Paid Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pending</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => {
                    const StatusIcon = getStatusIcon(payment.status);
                    const statusColor = getStatusColor(payment.status);
                    return (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{payment.studentName}</p>
                              <p className="text-sm text-gray-500">{payment.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-900">
                          Semester {payment.semester}
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-gray-900">
                          {formatCurrency(payment.totalAmount)}
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-green-600 font-medium">
                          {formatCurrency(payment.paidAmount)}
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-red-600 font-medium">
                          {formatCurrency(payment.pendingAmount)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-700`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-600">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            {payment.status !== 'Paid' && (
                              <button
                                onClick={() => openPaymentModal(payment)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Update Payment"
                              >
                                <DollarSign className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredPayments.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No payments found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Fee Structure Modal */}
      <AnimatePresence>
        {showAddModal && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Add Fee Structure</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleAddFeeStructure} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                  <select
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.tuition}
                      onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="45000"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Development Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.development}
                      onChange={(e) => setFormData({ ...formData, development: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="5000"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.exam}
                      onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="2000"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Library Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.library}
                      onChange={(e) => setFormData({ ...formData, library: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="1500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sports Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.sports}
                      onChange={(e) => setFormData({ ...formData, sports: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="1000"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.lab}
                      onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="3000"
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Structure
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Fee Structure Modal */}
      <AnimatePresence>
        {showEditModal && selectedFee && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Edit Fee Structure - Semester {selectedFee.semester}</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleEditFeeStructure} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.tuition}
                      onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Development Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.development}
                      onChange={(e) => setFormData({ ...formData, development: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.exam}
                      onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Library Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.library}
                      onChange={(e) => setFormData({ ...formData, library: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sports Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.sports}
                      onChange={(e) => setFormData({ ...formData, sports: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.lab}
                      onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPayment && (
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
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Update Payment</h2>
                  <button onClick={() => setShowPaymentModal(false)} className="text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleUpdatePayment} className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>{selectedPayment.studentName}</strong> ({selectedPayment.studentId})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Semester {selectedPayment.semester} | Total: {formatCurrency(selectedPayment.totalAmount)}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Pending: {formatCurrency(selectedPayment.pendingAmount)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount *</label>
                  <input
                    type="number"
                    required
                    value={paymentFormData.paidAmount}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, paidAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="0"
                    max={selectedPayment.totalAmount}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                  <select
                    required
                    value={paymentFormData.paymentMethod}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="Online">Online</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                  <input
                    type="text"
                    value={paymentFormData.transactionId}
                    onChange={(e) => setPaymentFormData({ ...paymentFormData, transactionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter transaction ID"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Update Payment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeeManagement;
