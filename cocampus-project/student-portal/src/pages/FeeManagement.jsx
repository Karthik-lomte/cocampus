import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, DollarSign, CheckCircle, AlertCircle, Smartphone, Building as Bank } from 'lucide-react';
import { studentService } from '../services/studentService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function FeeManagement() {
  const toast = useToast();
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getFees();
      setFeeData(data);
    } catch (err) {
      console.error('Fee error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (fee) => {
    setSelectedFee(fee);
    setShowPaymentModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      setPaying(true);
      await studentService.payFee(selectedFee._id || selectedFee.id, { paymentMethod });
      toast.success(`Fee payment of ₹${selectedFee.amount} successful!`);
      setShowPaymentModal(false);
      setPaymentMethod('');
      await loadFees();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading fees..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadFees} fullScreen />;

  const paymentMethods = feeData?.paymentMethods || [
    { value: 'upi', label: 'UPI Payment', icon: 'Smartphone', description: 'PhonePe, Google Pay, Paytm' },
    { value: 'card', label: 'Credit/Debit Card', icon: 'CreditCard', description: 'Visa, MasterCard, RuPay' },
    { value: 'netbanking', label: 'Net Banking', icon: 'Building', description: 'All major banks supported' }
  ];

  const getPaymentIcon = (iconName) => {
    const icons = { Smartphone, CreditCard, Building: Bank };
    const Icon = icons[iconName];
    return Icon ? <Icon size={20} /> : <CreditCard size={20} />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fee Management</h1>
        <p className="text-gray-600">View and pay your fees online</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-4">Current Semester Fee Structure</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {feeData?.feeStructure && Object.entries(feeData.feeStructure).filter(([key]) => key !== 'total').map(([key, value]) => (
            <div key={key} className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-sm opacity-90 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="text-2xl font-bold">₹{value?.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-white border-opacity-30">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total Semester Fee</span>
            <span className="text-3xl font-bold">₹{feeData?.feeStructure?.total?.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {feeData?.pendingFees?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
        >
          <div className="p-6 border-b border-gray-200 bg-yellow-50">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle size={24} />
              <h2 className="text-xl font-bold">Pending Fees</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {feeData.pendingFees.map((fee) => (
              <div key={fee._id || fee.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{fee.semester || 'Current Semester'}</h3>
                    <p className="text-sm text-gray-600 mb-2">{fee.feeType || fee.type}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-600">
                        Amount: <span className="font-semibold text-gray-900">₹{fee.amount?.toLocaleString()}</span>
                      </span>
                      <span className="text-gray-600">
                        Due Date: <span className="font-semibold text-red-600">{new Date(fee.dueDate).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePayNow(fee)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <DollarSign size={20} />
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {feeData?.paymentHistory?.map((payment) => (
                <tr key={payment._id || payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.semester}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.feeType || payment.type}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{payment.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.paymentMethod || payment.method}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{payment.transactionId}</td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      <Download size={16} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-200">
          {feeData?.paymentHistory?.map((payment) => (
            <div key={payment._id || payment.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{payment.semester}</h3>
                  <p className="text-sm text-gray-600">{payment.feeType || payment.type}</p>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-xs font-medium">PAID</span>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">₹{payment.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">{new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="text-gray-900">{payment.paymentMethod || payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="text-gray-900 font-mono text-xs">{payment.transactionId}</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={16} />
                Download Receipt
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {showPaymentModal && selectedFee && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => !paying && setShowPaymentModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h2 className="text-2xl font-bold">Complete Payment</h2>
              <p className="text-sm opacity-90 mt-1">{selectedFee.semester || 'Current Semester'}</p>
            </div>
            <form onSubmit={handlePayment} className="p-6">
              <div className="mb-6">
                <div className="flex justify-between text-lg mb-2">
                  <span className="text-gray-600">Amount to Pay:</span>
                  <span className="font-bold text-gray-900">₹{selectedFee.amount?.toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method *
                </label>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1"
                        required
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                          {getPaymentIcon(method.icon)}
                          {method.label}
                        </div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={paying}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center"
                >
                  {paying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Pay'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default FeeManagement;
