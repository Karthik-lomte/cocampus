import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, ShoppingCart, Star, Plus, Minus, Search, X } from 'lucide-react';
import { studentService } from '../services/studentService';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Canteen = () => {
  const toast = useToast();
  const [canteenData, setCanteenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
  const [cart, setCart] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    loadCanteenMenu();
  }, []);

  const loadCanteenMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getCanteenMenu();
      setCanteenData(data);
      if (data?.stalls?.length > 0) {
        setSelectedStall(data.stalls[0]);
      }
    } catch (err) {
      console.error('Canteen error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item._id || item.id]: (prev[item._id || item.id] || 0) + 1
    }));
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const newCart = { ...prev };
      const itemId = item._id || item.id;
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const cartTotal = selectedStall?.menu?.reduce((total, item) => {
    return total + (item.price * (cart[item._id || item.id] || 0));
  }, 0) || 0;

  const cartItems = Object.keys(cart).length;

  const filteredMenu = selectedStall?.menu?.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      setOrdering(true);
      const orderItems = selectedStall.menu
        .filter(item => cart[item._id || item.id])
        .map(item => ({
          itemId: item._id || item.id,
          quantity: cart[item._id || item.id],
          price: item.price
        }));

      await studentService.placeCanteenOrder({
        stallId: selectedStall._id || selectedStall.id,
        items: orderItems,
        paymentMethod,
        totalAmount: cartTotal
      });

      toast.success('Order placed successfully!');
      setShowCheckoutModal(false);
      setCart({});
      setPaymentMethod('');
      await loadCanteenMenu();
    } catch (err) {
      console.error('Order error:', err);
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading canteen menu..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadCanteenMenu} fullScreen />;

  const stalls = canteenData?.stalls || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Canteen</h1>
          <p className="text-gray-600 mt-1">Order food from campus canteens</p>
        </div>
        {cartItems > 0 && (
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <ShoppingCart size={20} />
              <span className="font-medium">{cartItems} items</span>
              <span className="font-bold">₹{cartTotal}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {stalls.map((stall) => (
          <button
            key={stall._id || stall.id}
            onClick={() => setSelectedStall(stall)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStall?._id === stall._id || selectedStall?.id === stall.id
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {stall.name}
            {stall.rating && (
              <span className="ml-2 text-sm flex items-center">
                <Star size={12} className="mr-1" fill="currentColor" />
                {stall.rating}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for food items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item, index) => (
          <motion.div
            key={item._id || item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={item.image || 'https://via.placeholder.com/400x200'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.isVeg && (
                <div className="absolute top-2 left-2 w-6 h-6 border-2 border-green-600 flex items-center justify-center bg-white rounded">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                </div>
              )}
              {item.rating && (
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg flex items-center text-sm">
                  <Star size={12} className="text-yellow-500 mr-1" fill="currentColor" />
                  <span className="font-medium">{item.rating}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-orange-600">₹{item.price}</p>
                {cart[item._id || item.id] ? (
                  <div className="flex items-center space-x-2 bg-blue-600 rounded-lg">
                    <button
                      onClick={() => removeFromCart(item)}
                      className="px-3 py-2 text-white hover:bg-blue-700 rounded-l-lg"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-white font-bold">{cart[item._id || item.id]}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-2 text-white hover:bg-blue-700 rounded-r-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {cartItems > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="bg-green-600 text-white px-8 py-4 rounded-full shadow-2xl hover:bg-green-700 transition-colors flex items-center space-x-3"
          >
            <ShoppingCart size={24} />
            <span className="font-bold text-lg">Checkout ₹{cartTotal}</span>
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {showCheckoutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !ordering && setShowCheckoutModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex justify-between items-center sticky top-0">
                  <h2 className="text-2xl font-bold">Checkout</h2>
                  <button
                    onClick={() => !ordering && setShowCheckoutModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleCheckout} className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">Order Summary</h3>
                    {selectedStall?.menu?.filter(item => cart[item._id || item.id]).map(item => (
                      <div key={item._id || item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">₹{item.price} × {cart[item._id || item.id]}</p>
                        </div>
                        <p className="font-bold">₹{item.price * cart[item._id || item.id]}</p>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-green-600 text-xl">₹{cartTotal}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                    <select
                      required
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="campusCoins">Campus Coins</option>
                      <option value="upi">UPI</option>
                      <option value="cash">Cash on Delivery</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCheckoutModal(false)}
                      disabled={ordering}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={ordering}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
                    >
                      {ordering ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Placing Order...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Canteen;
