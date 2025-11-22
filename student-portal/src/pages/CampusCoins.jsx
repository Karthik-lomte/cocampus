import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, TrendingDown, Plus, Download, X, CreditCard, Smartphone } from 'lucide-react';
import { campusCoins } from '../data/campusCoinsData';

const CampusCoins = () => {
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleAddMoney = (e) => {
    e.preventDefault();
    if (!amount || !paymentMethod) {
      alert('Please fill all required fields');
      return;
    }
    alert(`Successfully added ₹${amount} to Campus Coins!`);
    setShowAddMoneyModal(false);
    setAmount('');
    setPaymentMethod('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campus Coins</h1>
        <p className="text-gray-600 mt-1">Your digital campus wallet</p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-amber-100 mb-2">Available Balance</p>
            <p className="text-5xl font-bold">₹{campusCoins.balance}</p>
          </div>
          <Coins size={64} className="text-white/30" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-amber-100 text-sm">Total Earned</p>
            <p className="text-2xl font-bold">₹{campusCoins.totalEarned}</p>
          </div>
          <div>
            <p className="text-amber-100 text-sm">Total Spent</p>
            <p className="text-2xl font-bold">₹{campusCoins.totalSpent}</p>
          </div>
        </div>
        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => setShowAddMoneyModal(true)}
            className="flex-1 bg-white text-orange-600 py-3 rounded-lg font-bold hover:bg-amber-50 transition-colors flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Add Money
          </button>
          <button className="px-6 bg-white/20 backdrop-blur-lg text-white py-3 rounded-lg font-bold hover:bg-white/30 transition-colors flex items-center">
            <Download size={20} />
          </button>
        </div>
      </motion.div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {campusCoins.transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
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
                      {new Date(transaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Money Modal */}
      <AnimatePresence>
        {showAddMoneyModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddMoneyModal(false)} className="fixed inset-0 bg-black/50 z-50" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Coins size={28} />
                  <h2 className="text-2xl font-bold">Add Money</h2>
                </div>
                <button onClick={() => setShowAddMoneyModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleAddMoney} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-bold">₹</span>
                      <input
                        type="number"
                        required
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Quick Add</label>
                    <div className="grid grid-cols-3 gap-2">
                      {quickAmounts.map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAmount(amt.toString())}
                          className="px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-orange-100 hover:text-orange-600 transition-colors font-semibold"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                    <div className="space-y-2">
                      {[
                        { value: 'upi', label: 'UPI', icon: Smartphone },
                        { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                        { value: 'netbanking', label: 'Net Banking', icon: CreditCard }
                      ].map(method => (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => setPaymentMethod(method.value)}
                          className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                            paymentMethod === method.value
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <method.icon size={20} className={paymentMethod === method.value ? 'text-orange-600' : 'text-gray-600'} />
                          <span className={`font-medium ${paymentMethod === method.value ? 'text-orange-600' : 'text-gray-900'}`}>
                            {method.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowAddMoneyModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                      Cancel
                    </button>
                    <button type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg font-medium">
                      Add ₹{amount || 0}
                    </button>
                  </div>
                </form>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampusCoins;
