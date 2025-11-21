import { motion } from 'framer-motion';
import { Home, Users, DoorOpen, Utensils, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

function HostelDashboard() {
  const stats = {
    totalStudents: 450,
    totalRooms: 225,
    occupancyRate: 92,
    pendingGatePasses: 12,
    approvedToday: 8,
    blocksCount: 4
  };

  const recentGatePasses = [
    { id: 1, studentName: 'Rahul Sharma', roomNo: 'A-205', type: 'Medical', status: 'pending', time: '2 hours ago' },
    { id: 2, studentName: 'Priya Patel', roomNo: 'B-312', type: 'Family', status: 'pending', time: '3 hours ago' },
    { id: 3, studentName: 'Amit Kumar', roomNo: 'A-108', type: 'Personal', status: 'approved', time: '5 hours ago' }
  ];

  const blockOccupancy = [
    { block: 'Block A', total: 60, occupied: 58, percentage: 97 },
    { block: 'Block B', total: 60, occupied: 55, percentage: 92 },
    { block: 'Block C', total: 55, occupied: 50, percentage: 91 },
    { block: 'Block D', total: 50, occupied: 45, percentage: 90 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Hostel Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of hostel management</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Students</p>
              <p className="text-4xl font-bold mt-2">{stats.totalStudents}</p>
            </div>
            <Users size={48} className="text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Rooms</p>
              <p className="text-4xl font-bold mt-2">{stats.totalRooms}</p>
            </div>
            <Home size={48} className="text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Occupancy Rate</p>
              <p className="text-4xl font-bold mt-2">{stats.occupancyRate}%</p>
            </div>
            <TrendingUp size={48} className="text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Passes</p>
              <p className="text-4xl font-bold mt-2">{stats.pendingGatePasses}</p>
            </div>
            <Clock size={48} className="text-yellow-200" />
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Gate Pass Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <DoorOpen className="text-orange-600" size={24} />
              Recent Gate Pass Requests
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentGatePasses.map((pass) => (
              <div key={pass.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{pass.studentName}</h3>
                    <p className="text-sm text-gray-600">{pass.roomNo} • {pass.type}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pass.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {pass.status.toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{pass.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <a href="/hostel/gate-pass" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              View all requests →
            </a>
          </div>
        </motion.div>

        {/* Block Occupancy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Home className="text-purple-600" size={24} />
              Block Occupancy
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {blockOccupancy.map((block) => (
              <div key={block.block}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{block.block}</span>
                  <span className="text-sm text-gray-600">{block.occupied}/{block.total} rooms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      block.percentage >= 95 ? 'bg-red-500' :
                      block.percentage >= 85 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${block.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{block.percentage}% occupied</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/hostel/gate-pass" className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-center">
            <DoorOpen className="mx-auto text-orange-600 mb-2" size={32} />
            <span className="font-medium text-gray-900">Gate Passes</span>
          </a>
          <a href="/hostel/rooms" className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-center">
            <Home className="mx-auto text-purple-600 mb-2" size={32} />
            <span className="font-medium text-gray-900">Room Management</span>
          </a>
          <a href="/hostel/students" className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-center">
            <Users className="mx-auto text-blue-600 mb-2" size={32} />
            <span className="font-medium text-gray-900">Students</span>
          </a>
          <a href="/hostel/mess" className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-center">
            <Utensils className="mx-auto text-green-600 mb-2" size={32} />
            <span className="font-medium text-gray-900">Mess Menu</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default HostelDashboard;
