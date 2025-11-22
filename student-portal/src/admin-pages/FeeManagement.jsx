import React, { useState } from 'react';
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
  Download
} from 'lucide-react';

const FeeManagement = () => {
  const [feeStructures, setFeeStructures] = useState([
    { id: 1, semester: 1, tuition: 45000, development: 5000, exam: 2000, library: 1500, sports: 1000, lab: 3000 },
    { id: 2, semester: 2, tuition: 45000, development: 5000, exam: 2000, library: 1500, sports: 1000, lab: 3000 },
    { id: 3, semester: 3, tuition: 48000, development: 5500, exam: 2500, library: 1500, sports: 1000, lab: 3500 },
    { id: 4, semester: 4, tuition: 48000, development: 5500, exam: 2500, library: 1500, sports: 1000, lab: 3500 },
    { id: 5, semester: 5, tuition: 50000, development: 6000, exam: 3000, library: 2000, sports: 1500, lab: 4000 },
    { id: 6, semester: 6, tuition: 50000, development: 6000, exam: 3000, library: 2000, sports: 1500, lab: 4000 },
    { id: 7, semester: 7, tuition: 52000, development: 6500, exam: 3000, library: 2000, sports: 1500, lab: 4500 },
    { id: 8, semester: 8, tuition: 52000, development: 6500, exam: 3000, library: 2000, sports: 1500, lab: 4500 }
  ]);

  const [payments, setPayments] = useState([
    { id: 1, studentId: 'STU2022001', studentName: 'Rahul Sharma', semester: 5, amount: 66500, status: 'paid', date: '2024-01-15', method: 'Online' },
    { id: 2, studentId: 'STU2022002', studentName: 'Priya Patel', semester: 5, amount: 66500, status: 'paid', date: '2024-01-14', method: 'Bank Transfer' },
    { id: 3, studentId: 'STU2022003', studentName: 'Amit Kumar', semester: 5, amount: 66500, status: 'pending', date: null, method: null },
    { id: 4, studentId: 'STU2022004', studentName: 'Neha Gupta', semester: 5, amount: 33250, status: 'partial', date: '2024-01-10', method: 'Online' },
    { id: 5, studentId: 'STU2022005', studentName: 'Vikram Singh', semester: 5, amount: 66500, status: 'overdue', date: null, method: null },
    { id: 6, studentId: 'STU2023001', studentName: 'Sunita Devi', semester: 3, amount: 61500, status: 'paid', date: '2024-01-12', method: 'Cash' },
    { id: 7, studentId: 'STU2023002', studentName: 'Rohit Verma', semester: 3, amount: 61500, status: 'paid', date: '2024-01-13', method: 'Online' },
    { id: 8, studentId: 'STU2023003', studentName: 'Anita Reddy', semester: 3, amount: 61500, status: 'pending', date: null, method: null },
    { id: 9, studentId: 'STU2024001', studentName: 'Kiran Rao', semester: 1, amount: 57500, status: 'paid', date: '2024-01-16', method: 'Online' },
    { id: 10, studentId: 'STU2024002', studentName: 'Manoj Joshi', semester: 1, amount: 57500, status: 'pending', date: null, method: null }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [activeTab, setActiveTab] = useState('structure');
  const [formData, setFormData] = useState({
    semester: '', tuition: '', development: '', exam: '', library: '', sports: '', lab: ''
  });

  // Calculate totals
  const totalFeeStructure = feeStructures.reduce((sum, fee) =>
    sum + fee.tuition + fee.development + fee.exam + fee.library + fee.sports + fee.lab, 0
  );

  const feeCollected = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingDues = payments
    .filter(p => p.status === 'pending' || p.status === 'overdue' || p.status === 'partial')
    .reduce((sum, p) => {
      if (p.status === 'partial') {
        const fee = feeStructures.find(f => f.semester === p.semester);
        const total = fee ? fee.tuition + fee.development + fee.exam + fee.library + fee.sports + fee.lab : 0;
        return sum + (total - p.amount);
      }
      return sum + p.amount;
    }, 0);

  const calculateTotal = (fee) => {
    return fee.tuition + fee.development + fee.exam + fee.library + fee.sports + fee.lab;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || payment.semester.toString() === semesterFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesSemester && matchesStatus;
  });

  const handleAddFeeStructure = (e) => {
    e.preventDefault();
    const existingFee = feeStructures.find(f => f.semester === parseInt(formData.semester));
    if (existingFee) {
      alert('Fee structure for this semester already exists. Please edit the existing one.');
      return;
    }
    const newFee = {
      id: feeStructures.length + 1,
      semester: parseInt(formData.semester),
      tuition: parseFloat(formData.tuition),
      development: parseFloat(formData.development),
      exam: parseFloat(formData.exam),
      library: parseFloat(formData.library),
      sports: parseFloat(formData.sports),
      lab: parseFloat(formData.lab)
    };
    setFeeStructures([...feeStructures, newFee].sort((a, b) => a.semester - b.semester));
    setShowAddModal(false);
    setFormData({ semester: '', tuition: '', development: '', exam: '', library: '', sports: '', lab: '' });
    alert('Fee structure added successfully!');
  };

  const handleEditFeeStructure = (e) => {
    e.preventDefault();
    setFeeStructures(feeStructures.map(fee =>
      fee.id === selectedFee.id
        ? {
            ...fee,
            tuition: parseFloat(formData.tuition),
            development: parseFloat(formData.development),
            exam: parseFloat(formData.exam),
            library: parseFloat(formData.library),
            sports: parseFloat(formData.sports),
            lab: parseFloat(formData.lab)
          }
        : fee
    ));
    setShowEditModal(false);
    setSelectedFee(null);
    alert('Fee structure updated successfully!');
  };

  const handleDeleteFeeStructure = (feeId) => {
    const fee = feeStructures.find(f => f.id === feeId);
    const hasPayments = payments.some(p => p.semester === fee.semester);
    if (hasPayments) {
      alert('Cannot delete fee structure with existing payments. Please clear payments first.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      setFeeStructures(feeStructures.filter(f => f.id !== feeId));
      alert('Fee structure deleted successfully!');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'yellow';
      case 'partial': return 'blue';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
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
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Fee Management</h1>
        <p className="text-indigo-100">Manage fee structures and track student payments</p>
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
              <p className="text-xs text-gray-500 mt-1">All semesters combined</p>
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
              <p className="text-xs text-green-600 mt-1">{payments.filter(p => p.status === 'paid').length} payments received</p>
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
              <p className="text-xs text-red-600 mt-1">{payments.filter(p => p.status !== 'paid').length} payments pending</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('structure')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'structure'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Fee Structure
            </div>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'payments'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Tracking
            </div>
          </button>
        </div>
      </div>

      {/* Fee Structure Tab */}
      {activeTab === 'structure' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Fee Structure
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-center px-4 py-4 text-sm font-medium text-gray-600">Semester</th>
                    <th className="text-right px-4 py-4 text-sm font-medium text-gray-600">Tuition</th>
                    <th className="text-right px-4 py-4 text-sm font-medium text-gray-600">Development</th>
                    <th className="text-right px-4 py-4 text-sm font-medium text-gray-600">Exam</th>
                    <th className="text-right px-4 py-4 text-sm font-medium text-gray-600">Library</th>
                    <th className="text-right px-4 py-4 text-sm font-medium text-gray-600">Sports</th>
                    <th className="text-right px-4 py-4 text-sm font-medium text-gray-600">Lab</th>
                    <th className="text-right px-4 py-4 text-sm font-medium text-gray-600">Total</th>
                    <th className="text-center px-4 py-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feeStructures.map((fee) => (
                    <tr key={fee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-center">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                          Sem {fee.semester}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600">{formatCurrency(fee.tuition)}</td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600">{formatCurrency(fee.development)}</td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600">{formatCurrency(fee.exam)}</td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600">{formatCurrency(fee.library)}</td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600">{formatCurrency(fee.sports)}</td>
                      <td className="px-4 py-4 text-right text-sm text-gray-600">{formatCurrency(fee.lab)}</td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">{formatCurrency(calculateTotal(fee))}</td>
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
                            onClick={() => handleDeleteFeeStructure(fee.id)}
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
            </div>
          </motion.div>
        </>
      )}

      {/* Payment Tracking Tab */}
      {activeTab === 'payments' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
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
              <button
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Student</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Semester</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => {
                    const StatusIcon = getStatusIcon(payment.status);
                    const statusColor = getStatusColor(payment.status);
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{payment.studentName}</p>
                              <p className="text-sm text-gray-500 font-mono">{payment.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            Sem {payment.semester}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-700`}>
                            <StatusIcon className="w-3 h-3" />
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {payment.date ? new Date(payment.date).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {payment.method || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredPayments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No payments found matching your criteria</p>
              </div>
            )}
          </motion.div>
        </>
      )}

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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
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
                      placeholder="45000"
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Development Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.development}
                      onChange={(e) => setFormData({ ...formData, development: e.target.value })}
                      placeholder="5000"
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.exam}
                      onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                      placeholder="2000"
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Library Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.library}
                      onChange={(e) => setFormData({ ...formData, library: e.target.value })}
                      placeholder="1500"
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sports Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.sports}
                      onChange={(e) => setFormData({ ...formData, sports: e.target.value })}
                      placeholder="1000"
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.lab}
                      onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
                      placeholder="3000"
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    Add Fee Structure
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
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
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
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Development Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.development}
                      onChange={(e) => setFormData({ ...formData, development: e.target.value })}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.exam}
                      onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Library Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.library}
                      onChange={(e) => setFormData({ ...formData, library: e.target.value })}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sports Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.sports}
                      onChange={(e) => setFormData({ ...formData, sports: e.target.value })}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Fee *</label>
                    <input
                      type="number"
                      required
                      value={formData.lab}
                      onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
    </div>
  );
};

export default FeeManagement;
