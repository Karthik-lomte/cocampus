const User = require('../models/User');
const { CampusCoinsWallet } = require('../models/AllModels');

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, role, department } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Generate userId based on role
    const userId = await generateUserId(role);

    // Create user
    const user = await User.create({
      userId,
      email,
      password,
      name,
      phone,
      role,
      department,
      status: 'active'
    });

    // Create Campus Coins wallet for student
    if (role === 'student') {
      await CampusCoinsWallet.create({
        walletId: `WALLET-${userId}`,
        userId: user._id,
        userType: 'student',
        balance: 0,
        stats: {
          totalEarned: 0,
          totalSpent: 0,
          monthlySpending: []
        },
        limits: {
          dailySpendingLimit: parseInt(process.env.DAILY_SPENDING_LIMIT) || 5000,
          monthlySpendingLimit: 15000
        }
      });
    }

    // Generate token
    const token = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password, userId } = req.body;

    // Validate input
    if ((!email && !userId) || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email/userId and password'
      });
    }

    // Find user by email or userId
    const query = email ? { email } : { userId };
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: 'Your account is not active. Please contact admin'
      });
    }

    // Generate tokens
    const token = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          profile: user.profile
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
  try {
    // In a real application, you would invalidate the token here
    // For now, we'll just send a success response
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide current password and new password'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Helper function to generate userId
async function generateUserId(role) {
  const prefixes = {
    student: 'STU',
    faculty: 'FAC',
    hod: 'HOD',
    principal: 'PRI',
    admin: 'ADMIN',
    warden: 'WRD',
    canteen: 'CAN',
    stall: 'STALL',
    sports: 'SPT',
    club: 'CLB'
  };

  const prefix = prefixes[role] || 'USR';
  const year = new Date().getFullYear();

  // Get count of users with this role
  const count = await User.countDocuments({ role });
  const sequence = String(count + 1).padStart(3, '0');

  return `${prefix}${year}${sequence}`;
}
