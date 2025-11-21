import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  Calendar,
  Award,
  PartyPopper,
  UtensilsCrossed,
  Coins,
  Clock,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
  FileText,
  MessageSquare,
  DollarSign,
  Building,
  KeyRound,
  Trophy
} from 'lucide-react';
import { studentData } from '../data/studentData';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/student/dashboard', icon: Home, label: 'Dashboard', color: 'text-blue-500' },
    { path: '/student/assignments', icon: BookOpen, label: 'Assignments', color: 'text-purple-500' },
    { path: '/student/attendance', icon: Calendar, label: 'Attendance', color: 'text-green-500' },
    { path: '/student/results', icon: Award, label: 'Results', color: 'text-yellow-500' },
    { path: '/student/academic-calendar', icon: Calendar, label: 'Calendar', color: 'text-teal-500' },
    { path: '/student/events', icon: PartyPopper, label: 'Events', color: 'text-pink-500' },
    { path: '/student/canteen', icon: UtensilsCrossed, label: 'Canteen', color: 'text-orange-500' },
    { path: '/student/campus-coins', icon: Coins, label: 'Campus Coins', color: 'text-amber-500' },
    { path: '/student/timetable', icon: Clock, label: 'Timetable', color: 'text-indigo-500' },
    { path: '/student/notices', icon: Bell, label: 'Notices', color: 'text-red-500' },
    { path: '/student/certificates', icon: FileText, label: 'Certificates', color: 'text-cyan-500' },
    { path: '/student/feedback', icon: MessageSquare, label: 'Feedback', color: 'text-violet-500' },
    { path: '/student/fee-management', icon: DollarSign, label: 'Fee Management', color: 'text-emerald-500' },
    { path: '/student/hostel', icon: Building, label: 'Hostel', color: 'text-rose-500' },
    { path: '/student/gate-pass', icon: KeyRound, label: 'Gate Pass', color: 'text-fuchsia-500' },
    { path: '/student/achievements', icon: Trophy, label: 'Achievements', color: 'text-lime-500' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`lg:hidden fixed top-4 z-[60] p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
          mobileMenuOpen ? 'left-[268px]' : 'left-4'
        }`}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || mobileMenuOpen) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`
              fixed left-0 top-0 h-screen bg-white shadow-2xl z-50
              ${sidebarOpen ? 'w-64' : 'w-20'}
              ${mobileMenuOpen ? 'block' : 'hidden lg:block'}
            `}
          >
            {/* Logo and Brand */}
            <div className="p-6 border-b border-gray-100">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                {sidebarOpen && (
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Co-Campus
                    </h1>
                    <p className="text-xs text-gray-500">Student Portal</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Profile Section */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 border-b border-gray-100"
              >
                <Link to="/student/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={studentData.profileImage}
                    alt={studentData.name}
                    className="w-12 h-12 rounded-full ring-2 ring-blue-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {studentData.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {studentData.rollNumber}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              </motion.div>
            )}

            {/* Navigation */}
            <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-300px)]">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon size={20} className={isActive(item.path) ? 'text-white' : item.color} />
                    {sidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {isActive(item.path) && sidebarOpen && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
              <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full">
                <LogOut size={20} />
                {sidebarOpen && <span className="font-medium">Logout</span>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {menuItems.find(item => item.path === location.pathname)?.label || 'Co-Campus'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  to="/notices"
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </Link>
                <Link to="/profile" className="hidden lg:block">
                  <img
                    src={studentData.profileImage}
                    alt={studentData.name}
                    className="w-10 h-10 rounded-full ring-2 ring-gray-200 hover:ring-blue-500 transition-all cursor-pointer"
                  />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </div>
  );
};

export default Layout;
