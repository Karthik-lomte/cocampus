import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    hodName: {
      type: String,
      default: '',
    },
    facultyCount: {
      type: Number,
      default: 0,
    },
    studentCount: {
      type: Number,
      default: 0,
    },
    performance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    yearEstablished: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: '',
    },
    vision: {
      type: String,
      default: '',
    },
    mission: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
departmentSchema.index({ code: 1 });
departmentSchema.index({ name: 1 });

const Department = mongoose.model('Department', departmentSchema);

export default Department;
