import { motion } from 'framer-motion';
import { DollarSign, Download, FileText, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import { payrollData } from '../faculty-data/payrollData';
import { facultyData } from '../faculty-data/facultyData';

function PayrollDashboard() {
  const { currentMonth, salaryHistory, taxInfo, ytdEarnings } = payrollData;

  const handleDownloadSlip = (month) => {
    alert(`Downloading salary slip for ${month}`);
  };

  const handleDownloadForm16 = () => {
    alert('Downloading Form 16...');
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
            <p className="text-gray-600 text-sm">{currentMonth.month}</p>
          </div>
          {getStatusBadge(currentMonth.status)}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <span className="text-sm text-gray-600">Gross Salary</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{currentMonth.grossSalary.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <FileText className="text-white" size={20} />
                </div>
                <span className="text-sm text-gray-600">Total Deductions</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">₹{currentMonth.deductions.totalDeductions.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-white" size={20} />
                </div>
                <span className="text-sm text-gray-600">Net Salary</span>
              </div>
              <p className="text-3xl font-bold text-green-600">₹{currentMonth.netSalary.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Breakdown */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Earnings</h3>
              <div className="space-y-3">
                {[
                  { label: 'Basic Pay', amount: currentMonth.basicPay },
                  { label: 'HRA', amount: currentMonth.hra },
                  { label: 'Dearness Allowance', amount: currentMonth.da },
                  { label: 'Transport Allowance', amount: currentMonth.ta },
                  { label: 'Medical Allowance', amount: currentMonth.medicalAllowance },
                  { label: 'Other Allowances', amount: currentMonth.otherAllowances }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-gray-900">₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <span className="font-bold text-gray-900">Gross Salary</span>
                  <span className="font-bold text-green-600">₹{currentMonth.grossSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions Breakdown */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Deductions</h3>
              <div className="space-y-3">
                {[
                  { label: 'Provident Fund', amount: currentMonth.deductions.pf },
                  { label: 'Professional Tax', amount: currentMonth.deductions.professionalTax },
                  { label: 'TDS', amount: currentMonth.deductions.tds },
                  { label: 'Insurance', amount: currentMonth.deductions.insurance }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-red-600">-₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-2 border-red-200">
                  <span className="font-bold text-gray-900">Total Deductions</span>
                  <span className="font-bold text-red-600">-₹{currentMonth.deductions.totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl text-white flex justify-between items-center">
            <div>
              <p className="text-green-100 text-sm">Net Payable Amount</p>
              <p className="text-3xl font-bold">₹{currentMonth.netSalary.toLocaleString()}</p>
              <p className="text-green-100 text-xs mt-1">Payment Date: {new Date(currentMonth.paymentDate).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => handleDownloadSlip(currentMonth.month)}
              className="px-6 py-3 bg-white text-green-600 rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              <Download size={20} />
              Download Slip
            </button>
          </div>
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
          <p className="text-gray-600 text-sm">Financial Year {taxInfo.financialYear}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Basic Pay', amount: ytdEarnings.basicPay, color: 'blue' },
              { label: 'Allowances', amount: ytdEarnings.allowances, color: 'purple' },
              { label: 'Gross', amount: ytdEarnings.gross, color: 'green' },
              { label: 'Deductions', amount: ytdEarnings.deductions, color: 'red' },
              { label: 'Net Pay', amount: ytdEarnings.netPay, color: 'teal' }
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
              <p className="text-2xl font-bold text-gray-900">₹{taxInfo.totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Tax Deducted (YTD)</p>
              <p className="text-2xl font-bold text-orange-600">₹{taxInfo.taxDeducted.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Form 16</p>
              <div className="flex items-center gap-2 mt-2">
                {taxInfo.form16Available ? (
                  <>
                    <span className="text-green-600 font-semibold">Available</span>
                    <button
                      onClick={handleDownloadForm16}
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
              {salaryHistory.map((salary, index) => (
                <motion.tr
                  key={salary.month}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="text-green-600 mr-2" size={18} />
                      <span className="font-medium text-gray-900">{salary.month}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{salary.grossSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    -₹{salary.deductions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    ₹{salary.netSalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(salary.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(salary.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDownloadSlip(salary.month)}
                      className="text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <Download size={16} />
                      <span className="text-sm">Download</span>
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {salaryHistory.map((salary, index) => (
            <motion.div
              key={salary.month}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="text-green-600" size={18} />
                  <span className="font-bold text-gray-900">{salary.month}</span>
                </div>
                {getStatusBadge(salary.status)}
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Salary:</span>
                  <span className="font-semibold text-gray-900">₹{salary.grossSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deductions:</span>
                  <span className="font-semibold text-red-600">-₹{salary.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Salary:</span>
                  <span className="font-bold text-green-600">₹{salary.netSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="text-gray-900">{new Date(salary.paymentDate).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleDownloadSlip(salary.month)}
                className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Slip
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default PayrollDashboard;
