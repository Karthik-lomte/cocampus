import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, UserCheck, Building2,
  LogOut, Menu, X, User
} from 'lucide-react';

function ClubLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/club', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/club/events', label: 'Event Management', icon: Calendar },
    { path: '/club/members', label: 'Member Management', icon: Users },
    { path: '/club/attendance', label: 'Attendance Requests', icon: UserCheck },
    { path: '/club/departments', label: 'Departments', icon: Building2 },
    { path: '/club/profile', label: 'Profile', icon: User }
  ];

  const isActive = (path) => {
    if (path === '/club') {
      return location.pathname === '/club';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-purple-700 via-indigo-700 to-purple-800 overflow-y-auto shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 flex-shrink-0 px-4 bg-white/10 backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-white">Club Portal</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="flex-shrink-0 p-4 bg-white/10 backdrop-blur-sm">
            <Link
              to="/"
              className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`lg:hidden fixed top-4 z-[60] p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
          mobileMenuOpen ? 'left-[268px]' : 'left-4'
        }`}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-purple-700 via-indigo-700 to-purple-800 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Logo */}
              <div className="flex items-center justify-center h-20 px-4 bg-white/10 backdrop-blur-sm">
                <h1 className="text-2xl font-bold text-white">Club Portal</h1>
              </div>

              {/* Navigation */}
              <nav className="px-4 py-6 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        active
                          ? 'bg-white text-purple-700 shadow-lg'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="p-4 bg-white/10 backdrop-blur-sm">
                <Link
                  to="/"
                  className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ClubLayout;
