import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  ClipboardCheck,
  FileEdit,
  BookOpen,
  Calendar,
  Briefcase,
  DollarSign,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { facultyData } from '../faculty-data/facultyData';

const FacultyLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/faculty/dashboard', icon: Home, label: 'Dashboard', color: 'text-green-500' },
    { path: '/faculty/attendance', icon: ClipboardCheck, label: 'Attendance', color: 'text-blue-500' },
    { path: '/faculty/marks', icon: FileEdit, label: 'Marks Upload', color: 'text-purple-500' },
    { path: '/faculty/assignments', icon: BookOpen, label: 'Assignments', color: 'text-orange-500' },
    { path: '/faculty/achievements', icon: Trophy, label: 'Achievements', color: 'text-yellow-500' },
    { path: '/faculty/timetable', icon: Calendar, label: 'Timetable', color: 'text-indigo-500' },
    { path: '/faculty/leave', icon: Briefcase, label: 'Leave', color: 'text-red-500' },
    { path: '/faculty/payroll', icon: DollarSign, label: 'Payroll', color: 'text-emerald-500' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-teal-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`lg:hidden fixed top-4 z-[60] p-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all ${
          mobileMenuOpen ? 'left-[220px]' : 'left-4'
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
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                {sidebarOpen && (
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                      Co-Campus
                    </h1>
                    <p className="text-xs text-gray-500">Faculty Portal</p>
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
                <Link to="/faculty/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={facultyData.profileImage}
                    alt={facultyData.name}
                    className="w-12 h-12 rounded-full ring-2 ring-green-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {facultyData.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {facultyData.employeeId}
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
                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg transform scale-105'
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
            {sidebarOpen && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-6 pt-20 lg:pt-6">
          <Outlet />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default FacultyLayout;
