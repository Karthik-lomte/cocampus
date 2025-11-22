import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, TrendingDown, Plus, X, CreditCard } from 'lucide-react';
import { studentService } from '../services/studentService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CampusCoins = () => {
  const toast = useToast();
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [adding, setAdding] = useState(false);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getWallet();
      setWalletData(data);
    } catch (err) {
      console.error('Wallet error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!amount || !paymentMethod) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setAdding(true);
      await studentService.topupWallet(parseFloat(amount), paymentMethod);
      toast.success(`Successfully added ₹${amount} to Campus Coins!`);
      setShowAddMoneyModal(false);
      setAmount('');
      setPaymentMethod('');
      await loadWallet();
    } catch (err) {
      console.error('Topup error:', err);
      toast.error(err.response?.data?.message || 'Failed to add money');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading wallet..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadWallet} fullScreen />;
  if (!walletData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campus Coins</h1>
        <p className="text-gray-600 mt-1">Your digital campus wallet</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-amber-100 mb-2">Available Balance</p>
            <p className="text-5xl font-bold">₹{walletData.balance || 0}</p>
          </div>
          <Coins size={64} className="text-white/30" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-amber-100 text-sm">Total Earned</p>
            <p className="text-2xl font-bold">₹{walletData.totalEarned || 0}</p>
          </div>
          <div>
            <p className="text-amber-100 text-sm">Total Spent</p>
            <p className="text-2xl font-bold">₹{walletData.totalSpent || 0}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddMoneyModal(true)}
          className="w-full bg-white text-orange-600 py-3 rounded-lg font-bold hover:bg-amber-50 transition-colors flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Add Money
        </button>
      </motion.div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {walletData.transactions?.map((transaction, index) => (
            <motion.div
              key={transaction._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <TrendingUp className="text-green-600" size={20} />
                    ) : (
                      <TrendingDown className="text-red-600" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date || transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showAddMoneyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !adding && setShowAddMoneyModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Add Money</h2>
                  <button
                    onClick={() => !adding && setShowAddMoneyModal(false)}
                    disabled={adding}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddMoney} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {quickAmounts.map(qa => (
                        <button
                          key={qa}
                          type="button"
                          onClick={() => setAmount(qa.toString())}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          ₹{qa}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      required
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select payment method</option>
                      <option value="upi">UPI</option>
                      <option value="card">Debit/Credit Card</option>
                      <option value="netbanking">Net Banking</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={adding}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center justify-center"
                  >
                    {adding ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} className="mr-2" />
                        Add Money
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampusCoins;
