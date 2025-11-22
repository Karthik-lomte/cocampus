import { motion } from 'framer-motion';
import { Calendar, Users, TrendingUp, DollarSign, Award, Bell, UserCheck } from 'lucide-react';
import { clubData } from '../club-data/clubData';

function ClubDashboard() {
  const clubInfo = clubData.clubInfo;
  const recentEvents = clubData.eventRequests.slice(0, 3);
  const recentMembers = clubData.clubMembers.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{clubInfo.name}</h1>
            <p className="text-purple-100 text-lg">Welcome back! Here's your club overview</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <UserCheck size={18} />
                <span>President: {clubInfo.president}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Est. {clubInfo.establishedYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span>Advisor: {clubInfo.facultyAdvisor}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-600"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="text-purple-600" size={32} />
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Members</h3>
          <p className="text-3xl font-bold text-gray-900">{clubInfo.totalMembers}</p>
          <p className="text-xs text-green-600 mt-2">↑ 5 new this month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-600"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="text-blue-600" size={32} />
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Active Events</h3>
          <p className="text-3xl font-bold text-gray-900">{clubInfo.activeEvents}</p>
          <p className="text-xs text-blue-600 mt-2">2 upcoming this quarter</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-600"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="text-green-600" size={32} />
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Budget</h3>
          <p className="text-3xl font-bold text-gray-900">₹{(clubInfo.budget / 1000).toFixed(0)}K</p>
          <p className="text-xs text-green-600 mt-2">75% utilized</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-600"
        >
          <div className="flex items-center justify-between mb-4">
            <Award className="text-yellow-600" size={32} />
            <Bell className="text-orange-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Pending Approvals</h3>
          <p className="text-3xl font-bold text-gray-900">
            {clubData.eventRequests.filter(e => e.status === 'pending').length}
          </p>
          <p className="text-xs text-orange-600 mt-2">Awaiting principal review</p>
        </motion.div>
      </div>

      {/* Recent Events & Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="text-purple-600" size={24} />
              Recent Events
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.activityName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.programType}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                      <span>👥 {event.registeredCount || 0} registered</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'approved' ? 'bg-green-100 text-green-700' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {event.status.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-600" size={24} />
              Recent Members
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.department} • {member.role}</p>
                  </div>
                  <span className="text-xs text-gray-500">{member.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Department Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Department Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {clubData.clubDepartments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {dept.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{dept.name}</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600 mb-1">{dept.members}</p>
                <p className="text-xs text-gray-600">Head: {dept.head}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-center">
            <Calendar className="mx-auto text-purple-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Request Event</span>
          </button>
          <button className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-center">
            <Users className="mx-auto text-blue-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Add Member</span>
          </button>
          <button className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-center">
            <UserCheck className="mx-auto text-green-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Request Attendance</span>
          </button>
          <button className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-center">
            <Award className="mx-auto text-yellow-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">View Reports</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ClubDashboard;
