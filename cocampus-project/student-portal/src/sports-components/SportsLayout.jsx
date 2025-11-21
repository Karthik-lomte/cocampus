import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  Dumbbell
} from 'lucide-react';

const SportsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/sports', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/sports/facilities', label: 'Facilities', icon: Trophy },
    { path: '/sports/book', label: 'Book Facility', icon: Calendar },
    { path: '/sports/my-bookings', label: 'My Bookings', icon: ClipboardList },
    { path: '/sports/profile', label: 'Profile', icon: User }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-64 flex flex-col"
          >
            <div className="flex flex-col flex-grow bg-gradient-to-b from-emerald-600 via-teal-600 to-emerald-700 overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-emerald-500/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Sports</h1>
                    <p className="text-xs text-emerald-100">Booking Portal</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-emerald-600 shadow-lg'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-emerald-600' : 'text-white'}`} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-emerald-500/30">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Guest User</span>
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SportsLayout;
