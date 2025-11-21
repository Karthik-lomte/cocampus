const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'hod', 'principal', 'admin', 'warden', 'canteen', 'stall', 'sports', 'club'],
    required: [true, 'Role is required']
  },
  department: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },

  // Student-specific fields
  rollNumber: String,
  semester: Number,
  section: String,
  batch: String,
  cgpa: Number,
  currentSemesterGPA: Number,
  address: {
    room: String,
    hostel: String,
    permanent: String
  },
  parentInfo: {
    fatherName: String,
    fatherPhone: String,
    motherName: String,
    motherPhone: String
  },

  // Faculty/HoD specific fields
  employeeId: String,
  designation: String,
  qualification: String,
  specialization: String,
  experience: Number,
  joiningDate: Date,
  subjects: [String],

  // Warden specific
  assignedBlock: String,

  // Canteen/Stall specific
  businessName: String,
  licenseNumber: String,
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    upiId: String
  },

  // Common fields
  profile: {
    avatar: String,
    bio: String,
    achievements: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    }]
  },

  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    emailAlerts: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },

  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date

}, {
  timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
};

// Generate refresh token
UserSchema.methods.getRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '90d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
