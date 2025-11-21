import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Utensils, Wrench, Wifi, Calendar } from 'lucide-react';
import { hostelData } from '../data/hostelData';

function Hostel() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hostel Information</h1>
        <p className="text-gray-600">Your hostel details, mess menu, and services</p>
      </motion.div>

      {/* Room Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
            <Home size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">{hostelData.studentInfo.hostelName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Room Number</div>
                <div className="text-xl font-bold">{hostelData.studentInfo.roomNumber}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Floor</div>
                <div className="text-xl font-bold">{hostelData.studentInfo.floor}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Room Type</div>
                <div className="text-xl font-bold">{hostelData.studentInfo.roomType}</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90">Roommate</div>
                <div className="text-lg font-bold">{hostelData.studentInfo.roommate.name}</div>
                <div className="text-xs opacity-75">{hostelData.studentInfo.roommate.rollNo}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Laundry</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Schedule:</span>
              <span className="font-medium text-gray-900">{hostelData.services.laundry.schedule}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timings:</span>
              <span className="font-medium text-gray-900">{hostelData.services.laundry.timings}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Wrench className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Maintenance</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Contact:</span>
              <span className="font-medium text-gray-900">{hostelData.services.maintenance.contact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Support:</span>
              <span className="font-medium text-gray-900">{hostelData.services.maintenance.timings}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wifi className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">WiFi</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Speed:</span>
              <span className="font-medium text-gray-900">{hostelData.services.wifi.speed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium text-gray-900">{hostelData.services.wifi.username}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Mess Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center gap-3">
            <Utensils size={24} />
            <h2 className="text-2xl font-bold">Weekly Mess Menu</h2>
          </div>
        </div>

        {/* Day Selector */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDay === day
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Menu for Selected Day */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(hostelData.weeklyMenu[selectedDay]).map(([mealType, items]) => (
              <div key={mealType} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3 capitalize">{mealType}</h3>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gate Pass History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Gate Passes</h2>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Out Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hostelData.gatePassHistory.map((pass) => (
                <tr key={pass.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{pass.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(pass.outDate).toLocaleDateString()} at {pass.outTime}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(pass.inDate).toLocaleDateString()} at {pass.inTime}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pass.approvedBy}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pass.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {pass.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200">
          {hostelData.gatePassHistory.map((pass) => (
            <div key={pass.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{pass.reason}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  pass.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {pass.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Out: {new Date(pass.outDate).toLocaleDateString()} at {pass.outTime}</div>
                <div>In: {new Date(pass.inDate).toLocaleDateString()} at {pass.inTime}</div>
                <div className="text-xs">{pass.approvedBy}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Hostel;
