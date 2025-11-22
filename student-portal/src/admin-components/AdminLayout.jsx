import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  GraduationCap,
  DollarSign,
  Home,
  Trophy,
  CheckSquare,
  Bell,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/departments', label: 'Departments', icon: Building2 },
    { path: '/admin/subjects', label: 'Subjects', icon: BookOpen },
    { path: '/admin/academic', label: 'Academic', icon: GraduationCap },
    { path: '/admin/fees', label: 'Fee Management', icon: DollarSign },
    { path: '/admin/hostel', label: 'Hostel', icon: Home },
    { path: '/admin/sports', label: 'Sports & Infra', icon: Trophy },
    { path: '/admin/approvals', label: 'Approvals', icon: CheckSquare },
    { path: '/admin/notices', label: 'Notices', icon: Bell },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/profile', label: 'Profile', icon: User }
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-gradient-to-b from-indigo-900 via-indigo-800 to-blue-900 text-white">
        <div className="flex items-center gap-3 p-6 border-b border-indigo-700">
          <div className="p-2 bg-white/10 rounded-lg">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Portal</h1>
            <p className="text-xs text-indigo-300">System Administrator</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-white text-indigo-900 shadow-lg transform scale-105'
                    : 'text-indigo-100 hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-indigo-100 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-indigo-900 to-blue-900 text-white px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-semibold">Admin Portal</span>
        <div className="p-2 bg-white/10 rounded-full">
          <User size={20} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-indigo-900 via-indigo-800 to-blue-900 text-white z-50 overflow-y-auto"
            >
              <div className="flex items-center gap-3 p-6 border-b border-indigo-700">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Admin Portal</h1>
                  <p className="text-xs text-indigo-300">System Administrator</p>
                </div>
              </div>

              <nav className="py-4 px-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                        isActive
                          ? 'bg-white text-indigo-900 shadow-lg'
                          : 'text-indigo-100 hover:bg-white/10'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-indigo-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-indigo-100 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
