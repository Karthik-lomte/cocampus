import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    userName: {
      type: String,
      required: [true, 'User name is required']
    },
    userId: {
      type: String,
      required: [true, 'User ID is required']
    },
    userRole: {
      type: String,
      enum: ['Student', 'Faculty', 'Admin', 'HOD', 'Principal'],
      required: [true, 'User role is required']
    },
    department: {
      type: String,
      required: false
    },
    leaveType: {
      type: String,
      enum: ['Casual Leave', 'Sick Leave', 'Medical Leave', 'Maternity Leave', 'Paternity Leave', 'Vacation Leave', 'Emergency Leave', 'Other'],
      required: [true, 'Leave type is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    days: {
      type: Number,
      required: [true, 'Number of days is required'],
      min: 0.5
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      maxlength: 500
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedByName: {
      type: String
    },
    approvedDate: {
      type: Date
    },
    remarks: {
      type: String,
      maxlength: 500
    },
    rejectionReason: {
      type: String,
      maxlength: 500
    },
    documents: [{
      name: String,
      url: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }],
    handoverTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    handoverToName: {
      type: String
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  {
    timestamps: true
  }
);

// Calculate days before saving
leaveSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    this.days = diffDays;
  }
  next();
});

// Index for querying
leaveSchema.index({ user: 1, status: 1 });
leaveSchema.index({ appliedDate: -1 });
leaveSchema.index({ userRole: 1, status: 1 });

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
