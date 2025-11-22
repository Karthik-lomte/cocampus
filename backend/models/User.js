import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },

    // Role-based access control
    role: {
      type: String,
      enum: [
        'student',
        'faculty',
        'hod',
        'principal',
        'admin',
        'warden',
        'canteen_manager',
        'stall_owner',
        'club_admin',
        'guest',
      ],
      required: [true, 'Please specify a role'],
    },

    // Role-specific IDs
    userId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but enforces uniqueness when present
      trim: true,
    },
    rollNumber: {
      type: String,
      sparse: true,
      trim: true,
    },
    employeeId: {
      type: String,
      sparse: true,
      trim: true,
    },

    // Department and Academic Info
    department: {
      type: String,
      trim: true,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },
    year: {
      type: Number,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Additional metadata
    metadata: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ userId: 1 });
userSchema.index({ rollNumber: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ department: 1, role: 1 });

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user public profile (without password)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  return userObject;
};

// Static method to find user by email with password
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
