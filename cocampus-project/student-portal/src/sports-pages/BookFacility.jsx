import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  Info
} from 'lucide-react';

const BookFacility = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedFacility = location.state?.facility;

  const [facilities] = useState([
    { id: 1, name: 'Cricket Stadium', price: 5000, icon: '🏏' },
    { id: 2, name: 'Badminton Court', price: 400, icon: '🏸' },
    { id: 3, name: 'Volleyball Court', price: 800, icon: '🏐' },
    { id: 4, name: 'Kabaddi Court', price: 600, icon: '🤼' },
    { id: 5, name: 'Table Tennis', price: 200, icon: '🏓' }
  ]);

  const [formData, setFormData] = useState({
    facility: preSelectedFacility?.id?.toString() || '',
    date: '',
    startTime: '',
    duration: '1',
    paymentMethod: 'online',
    notes: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const durations = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' }
  ];

  const selectedFacility = facilities.find(f => f.id.toString() === formData.facility);
  const totalAmount = selectedFacility ? selectedFacility.price * parseInt(formData.duration) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmBooking = () => {
    alert('Booking request submitted successfully! You will receive confirmation shortly.');
    navigate('/sports/my-bookings');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Facility</h1>
        <p className="text-gray-600">Reserve your preferred sports facility</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Facility Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Facility *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {facilities.map((facility) => (
                  <button
                    key={facility.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, facility: facility.id.toString() })}
                    className={`p-4 rounded-lg border-2 transition-colors text-center ${
                      formData.facility === facility.id.toString()
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{facility.icon}</div>
                    <p className="text-sm font-medium text-gray-900">{facility.name}</p>
                    <p className="text-xs text-emerald-600">₹{facility.price}/hr</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Select Date *
              </label>
              <input
                type="date"
                required
                min={today}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Time & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Start Time *
                </label>
                <select
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <select
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {durations.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Payment Method *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.paymentMethod === 'online'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <p className="font-medium text-gray-900">Pay Online</p>
                  <p className="text-xs text-gray-600">Instant confirmation</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'venue' })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.paymentMethod === 'venue'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <p className="font-medium text-gray-900">Pay at Venue</p>
                  <p className="text-xs text-gray-600">Requires approval</p>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Any special requirements..."
              />
            </div>

            <button
              type="submit"
              disabled={!formData.facility || !formData.date || !formData.startTime}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Review Booking
            </button>
          </form>
        </motion.div>

        {/* Booking Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>

          {selectedFacility ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                <span className="text-2xl">{selectedFacility.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{selectedFacility.name}</p>
                  <p className="text-sm text-emerald-600">₹{selectedFacility.price}/hour</p>
                </div>
              </div>

              {formData.date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{formData.date}</span>
                </div>
              )}

              {formData.startTime && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{formData.startTime}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{formData.duration} hour(s)</span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-emerald-600">₹{totalAmount}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    {formData.paymentMethod === 'online'
                      ? 'Payment will be processed after admin approval'
                      : 'Booking requires admin approval. Pay at venue.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Select a facility to see summary</p>
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Confirm Booking</h2>
              <p className="text-gray-600 mt-2">Please review your booking details</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Facility</span>
                <span className="font-medium">{selectedFacility?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{formData.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time</span>
                <span className="font-medium">{formData.startTime} ({formData.duration}hr)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment</span>
                <span className="font-medium">{formData.paymentMethod === 'online' ? 'Online' : 'At Venue'}</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-medium">Total</span>
                <span className="font-bold text-emerald-600">₹{totalAmount}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BookFacility;
