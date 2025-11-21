import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, ShoppingCart, Star, Plus, Minus, Search, X, MapPin, CreditCard } from 'lucide-react';
import { canteenStalls } from '../data/canteenData';

const Canteen = () => {
  const [selectedStall, setSelectedStall] = useState(canteenStalls[0]);
  const [cart, setCart] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[item.id] > 1) {
        newCart[item.id]--;
      } else {
        delete newCart[item.id];
      }
      return newCart;
    });
  };

  const cartTotal = selectedStall.menu.reduce((total, item) => {
    return total + (item.price * (cart[item.id] || 0));
  }, 0);

  const cartItems = Object.keys(cart).length;

  // Filter menu items based on search query
  const filteredMenu = selectedStall.menu.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    alert('Order placed successfully!');
    setShowCheckoutModal(false);
    setCart({});
    setPaymentMethod('');
  };

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

      {/* Stall Selector */}
      <div className="flex flex-wrap gap-2">
        {canteenStalls.map((stall) => (
          <button
            key={stall.id}
            onClick={() => setSelectedStall(stall)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedStall.id === stall.id
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {stall.name}
            <span className="ml-2 text-sm flex items-center">
              <Star size={12} className="mr-1" fill="currentColor" />
              {stall.rating}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for food items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
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

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.isVeg && (
                <div className="absolute top-2 left-2 w-6 h-6 border-2 border-green-600 flex items-center justify-center bg-white rounded">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg flex items-center text-sm">
                <Star size={12} className="text-yellow-500 mr-1" fill="currentColor" />
                <span className="font-medium">{item.rating}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-orange-600">₹{item.price}</p>
                {cart[item.id] ? (
                  <div className="flex items-center space-x-2 bg-blue-600 rounded-lg">
                    <button
                      onClick={() => removeFromCart(item)}
                      className="px-3 py-2 text-white hover:bg-blue-700 rounded-l-lg"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-white font-bold">{cart[item.id]}</span>
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
        ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Search className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No items found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Checkout Button */}
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

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutModal(false)} className="fixed inset-0 bg-black/50 z-50" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Checkout</h2>
                <button onClick={() => setShowCheckoutModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">Order Summary</h3>
                    {selectedStall.menu.filter(item => cart[item.id]).map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">₹{item.price} × {cart[item.id]}</p>
                        </div>
                        <p className="font-bold">₹{item.price * cart[item.id]}</p>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-green-600 text-xl">₹{cartTotal}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                    <select required value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select Payment Method</option>
                      <option>Campus Coins</option>
                      <option>UPI</option>
                      <option>Cash on Delivery</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowCheckoutModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                    <button type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg font-medium">Place Order</button>
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

export default Canteen;
