import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Download, FileText, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { facultyService } from '../services/facultyService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function PayrollDashboard() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payrollData, setPayrollData] = useState(null);

  useEffect(() => {
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try getPayroll or getPayslips depending on service implementation
      const data = await facultyService.getPayroll?.() ||
                    await facultyService.getPayslips?.();
      setPayrollData(data);
    } catch (err) {
      console.error('Payroll data error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSlip = (month, slipUrl) => {
    if (slipUrl) {
      window.open(slipUrl, '_blank');
      toast.success(`Downloading salary slip for ${month}`);
    } else {
      toast.info('Salary slip not available for download');
    }
  };

  const handleDownloadForm16 = (form16Url) => {
    if (form16Url) {
      window.open(form16Url, '_blank');
      toast.success('Downloading Form 16');
    } else {
      toast.info('Form 16 not available for download');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) return <Loading fullScreen message="Loading payroll dashboard..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadPayrollData} fullScreen />;

  const currentMonth = payrollData?.currentMonth || {};
  const salaryHistory = payrollData?.salaryHistory || payrollData?.payslips || [];
  const taxInfo = payrollData?.taxInfo || {};
  const ytdEarnings = payrollData?.ytdEarnings || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Payroll Dashboard</h1>
        <p className="text-green-100">View your salary details and download pay slips</p>
      </motion.div>

      {/* Current Month Salary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Current Month Salary</h2>
            <p className="text-gray-600 text-sm">{currentMonth.month || 'N/A'}</p>
          </div>
          {currentMonth.status && getStatusBadge(currentMonth.status)}
        </div>

        <div className="p-6">
          {currentMonth.grossSalary ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="text-white" size={20} />
                    </div>
                    <span className="text-sm text-gray-600">Gross Salary</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">₹{(currentMonth.grossSalary || 0).toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <FileText className="text-white" size={20} />
                    </div>
                    <span className="text-sm text-gray-600">Total Deductions</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">₹{(currentMonth.deductions?.totalDeductions || 0).toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="text-white" size={20} />
                    </div>
                    <span className="text-sm text-gray-600">Net Salary</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">₹{(currentMonth.netSalary || 0).toLocaleString()}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No salary data available for current month</p>
            </div>
          )}

          {currentMonth.grossSalary && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Breakdown */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Earnings</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Basic Pay', amount: currentMonth.basicPay || 0 },
                      { label: 'HRA', amount: currentMonth.hra || 0 },
                      { label: 'Dearness Allowance', amount: currentMonth.da || 0 },
                      { label: 'Transport Allowance', amount: currentMonth.ta || 0 },
                      { label: 'Medical Allowance', amount: currentMonth.medicalAllowance || 0 },
                      { label: 'Other Allowances', amount: currentMonth.otherAllowances || 0 }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="font-semibold text-gray-900">₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                      <span className="font-bold text-gray-900">Gross Salary</span>
                      <span className="font-bold text-green-600">₹{(currentMonth.grossSalary || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions Breakdown */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Deductions</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Provident Fund', amount: currentMonth.deductions?.pf || 0 },
                      { label: 'Professional Tax', amount: currentMonth.deductions?.professionalTax || 0 },
                      { label: 'TDS', amount: currentMonth.deductions?.tds || 0 },
                      { label: 'Insurance', amount: currentMonth.deductions?.insurance || 0 }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="font-semibold text-red-600">-₹{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-2 border-red-200">
                      <span className="font-bold text-gray-900">Total Deductions</span>
                      <span className="font-bold text-red-600">-₹{(currentMonth.deductions?.totalDeductions || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white flex justify-between items-center">
                <div>
                  <p className="text-green-100 text-sm">Net Payable Amount</p>
                  <p className="text-3xl font-bold">₹{(currentMonth.netSalary || 0).toLocaleString()}</p>
                  <p className="text-green-100 text-xs mt-1">
                    Payment Date: {currentMonth.paymentDate ? new Date(currentMonth.paymentDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadSlip(currentMonth.month, currentMonth.slipUrl || currentMonth.payslipUrl)}
                  className="px-6 py-3 bg-white text-green-600 rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  <Download size={20} />
                  Download Slip
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Year to Date Earnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Year to Date Earnings</h2>
          <p className="text-gray-600 text-sm">Financial Year {taxInfo.financialYear || 'N/A'}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Basic Pay', amount: ytdEarnings.basicPay || 0, color: 'blue' },
              { label: 'Allowances', amount: ytdEarnings.allowances || 0, color: 'purple' },
              { label: 'Gross', amount: ytdEarnings.gross || 0, color: 'green' },
              { label: 'Deductions', amount: ytdEarnings.deductions || 0, color: 'red' },
              { label: 'Net Pay', amount: ytdEarnings.netPay || 0, color: 'teal' }
            ].map((item) => (
              <div key={item.label} className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                <p className={`text-2xl font-bold text-${item.color}-600`}>
                  ₹{item.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tax Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tax Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total Income (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">₹{(taxInfo.totalIncome || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Tax Deducted (YTD)</p>
              <p className="text-2xl font-bold text-orange-600">₹{(taxInfo.taxDeducted || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Form 16</p>
              <div className="flex items-center gap-2 mt-2">
                {taxInfo.form16Available ? (
                  <>
                    <span className="text-green-600 font-semibold">Available</span>
                    <button
                      onClick={() => handleDownloadForm16(taxInfo.form16Url || taxInfo.form16)}
                      className="ml-auto px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500">Not Available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Salary History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Salary History</h2>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaryHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No salary history found</p>
                  </td>
                </tr>
              ) : (
                salaryHistory.map((salary, index) => (
                  <motion.tr
                    key={salary._id || salary.id || salary.month || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="text-green-600 mr-2" size={18} />
                        <span className="font-medium text-gray-900">{salary.month || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{(salary.grossSalary || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      -₹{(salary.deductions || salary.totalDeductions || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                      ₹{(salary.netSalary || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {salary.paymentDate ? new Date(salary.paymentDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(salary.status || 'pending')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDownloadSlip(salary.month, salary.slipUrl || salary.payslipUrl)}
                        className="text-green-600 hover:text-green-700 flex items-center gap-1"
                      >
                        <Download size={16} />
                        <span className="text-sm">Download</span>
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {salaryHistory.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No salary history found</p>
            </div>
          ) : (
            salaryHistory.map((salary, index) => (
              <motion.div
                key={salary._id || salary.id || salary.month || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-green-600" size={18} />
                    <span className="font-bold text-gray-900">{salary.month || 'N/A'}</span>
                  </div>
                  {getStatusBadge(salary.status || 'pending')}
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Salary:</span>
                    <span className="font-semibold text-gray-900">₹{(salary.grossSalary || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deductions:</span>
                    <span className="font-semibold text-red-600">-₹{(salary.deductions || salary.totalDeductions || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Salary:</span>
                    <span className="font-bold text-green-600">₹{(salary.netSalary || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="text-gray-900">{salary.paymentDate ? new Date(salary.paymentDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadSlip(salary.month, salary.slipUrl || salary.payslipUrl)}
                  className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Slip
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default PayrollDashboard;
