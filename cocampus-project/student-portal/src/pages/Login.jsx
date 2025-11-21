import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, GraduationCap, Briefcase, Eye, EyeOff, Crown, Award, Users, Home, ChefHat, Coffee, Dumbbell, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../components/Toast';

function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    idProofType: '',
    idProofNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);

  const roles = [
    {
      id: 'student',
      label: 'Student',
      icon: GraduationCap,
      color: 'from-blue-600 to-purple-600',
      description: 'Access student portal'
    },
    {
      id: 'faculty',
      label: 'Faculty',
      icon: Briefcase,
      color: 'from-green-600 to-teal-600',
      description: 'Access faculty portal'
    },
    {
      id: 'hod',
      label: 'HOD',
      icon: Crown,
      color: 'from-amber-600 to-orange-600',
      description: 'Head of Department'
    },
    {
      id: 'principal',
      label: 'Principal',
      icon: Award,
      color: 'from-purple-600 to-indigo-600',
      description: 'Principal portal'
    },
    {
      id: 'club',
      label: 'Club',
      icon: Users,
      color: 'from-purple-600 to-indigo-600',
      description: 'Club management'
    },
    {
      id: 'hostel',
      label: 'Hostel',
      icon: Home,
      color: 'from-orange-600 to-red-600',
      description: 'Hostel warden'
    },
    {
      id: 'canteen',
      label: 'Canteen',
      icon: ChefHat,
      color: 'from-amber-600 to-orange-600',
      description: 'Canteen manager'
    },
    {
      id: 'stall',
      label: 'Stall',
      icon: Coffee,
      color: 'from-yellow-600 to-amber-600',
      description: 'Stall owner'
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: Dumbbell,
      color: 'from-emerald-600 to-teal-600',
      description: 'Book facilities'
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Shield,
      color: 'from-indigo-600 to-blue-600',
      description: 'System administrator'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare credentials based on role
      let email = formData.username;

      // For roles that don't use email, we need to convert the username to email format
      // This is a temporary solution - backend should support username/ID login
      if (selectedRole !== 'sports' && !formData.username.includes('@')) {
        // For now, use a format like: username@role.cocampus.edu
        email = `${formData.username}@${selectedRole}.cocampus.edu`;
      }

      const { user } = await authService.login({
        email,
        password: formData.password
      });

      // Verify user role matches selected role
      if (user.role !== selectedRole) {
        toast.error(`Invalid credentials for ${selectedRole} role`);
        await authService.logout();
        return;
      }

      toast.success(`Welcome back, ${user.name || user.email}!`);

      // Navigate to appropriate dashboard based on role
      const roleRoutes = {
        student: '/student/dashboard',
        faculty: '/faculty/dashboard',
        hod: '/hod',
        principal: '/principal',
        club: '/club',
        warden: '/hostel',
        canteen: '/canteen',
        stall: '/stall',
        sports: '/sports',
        admin: '/admin'
      };

      navigate(roleRoutes[user.role] || '/login');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setIsLoading(true);

    try {
      await authService.register({
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        address: signupData.address,
        idProof: {
          type: signupData.idProofType,
          number: signupData.idProofNumber
        },
        password: signupData.password,
        role: 'sports'
      });

      toast.success('Registration successful! Please wait for admin approval.');
      setIsSignupMode(false);
      setSignupData({
        name: '',
        email: '',
        phone: '',
        address: '',
        idProofType: '',
        idProofNumber: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInputLabel = () => {
    switch (selectedRole) {
      case 'student': return 'Roll Number';
      case 'club': return 'Club ID';
      case 'hostel': return 'Warden ID';
      case 'canteen': return 'Manager ID';
      case 'stall': return 'Stall ID';
      case 'sports': return 'Email';
      case 'admin': return 'Admin ID';
      default: return 'Employee ID';
    }
  };

  const getInputPlaceholder = () => {
    switch (selectedRole) {
      case 'student': return 'Enter roll number';
      case 'club': return 'Enter club ID';
      case 'hostel': return 'Enter warden ID';
      case 'canteen': return 'Enter manager ID';
      case 'stall': return 'Enter stall ID';
      case 'sports': return 'Enter email';
      case 'admin': return 'Enter admin ID';
      default: return 'Enter employee ID';
    }
  };

  const getButtonText = () => {
    const roleLabels = {
      student: 'Student',
      faculty: 'Faculty',
      hod: 'HOD',
      principal: 'Principal',
      club: 'Club',
      hostel: 'Hostel',
      canteen: 'Canteen',
      stall: 'Stall',
      sports: 'Sports',
      admin: 'Admin'
    };
    return `Login as ${roleLabels[selectedRole]}`;
  };

  const getButtonGradient = () => {
    const gradients = {
      student: 'from-blue-600 to-purple-600',
      faculty: 'from-green-600 to-teal-600',
      hod: 'from-amber-600 to-orange-600',
      principal: 'from-purple-600 to-indigo-600',
      club: 'from-purple-600 to-indigo-600',
      hostel: 'from-orange-600 to-red-600',
      canteen: 'from-amber-600 to-orange-600',
      stall: 'from-yellow-600 to-amber-600',
      sports: 'from-emerald-600 to-teal-600',
      admin: 'from-indigo-600 to-blue-600'
    };
    return gradients[selectedRole] || 'from-blue-600 to-purple-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <span className="text-white font-bold text-3xl">C</span>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Co-Campus
          </h1>
          <p className="text-gray-600">Campus Management System</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setIsSignupMode(false);
                    }}
                    className={`relative p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedRole === role.id
                        ? 'border-blue-600 bg-blue-50 shadow-lg transform scale-105'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${role.color} flex items-center justify-center mx-auto mb-2 shadow-md`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div className="text-xs font-bold text-gray-900">{role.label}</div>
                    {selectedRole === role.id && (
                      <motion.div
                        layoutId="selected-role"
                        className="absolute inset-0 border-2 border-blue-600 rounded-xl"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sports Signup/Login Toggle */}
          {selectedRole === 'sports' && (
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                <button
                  type="button"
                  onClick={() => setIsSignupMode(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !isSignupMode ? 'bg-white text-emerald-600 shadow' : 'text-gray-600'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignupMode(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isSignupMode ? 'bg-white text-emerald-600 shadow' : 'text-gray-600'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Login Form */}
          {!isSignupMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getInputLabel()}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={selectedRole === 'sports' ? 'email' : 'text'}
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder={getInputPlaceholder()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r ${getButtonGradient()} hover:shadow-lg ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  getButtonText()
                )}
              </button>
            </form>
          ) : (
            /* Signup Form for Sports */
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      required
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      required
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="Enter email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      required
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Proof Type *
                  </label>
                  <select
                    required
                    value={signupData.idProofType}
                    onChange={(e) => setSignupData({ ...signupData, idProofType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select ID type</option>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="driving">Driving License</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Proof Number *
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      required
                      value={signupData.idProofNumber}
                      onChange={(e) => setSignupData({ ...signupData, idProofNumber: e.target.value })}
                      placeholder="Enter ID number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      required
                      value={signupData.address}
                      onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                      placeholder="Enter address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="Min 8 characters"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      required
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact{' '}
              <a href="mailto:support@cocampus.edu" className="text-blue-600 hover:text-blue-700 font-medium">
                support@cocampus.edu
              </a>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          © 2025 Co-Campus. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
