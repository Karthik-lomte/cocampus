import mongoose from 'mongoose';

const sportsBookingSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SportsFacility',
      required: [true, 'Facility is required']
    },
    facilityName: {
      type: String,
      required: [true, 'Facility name is required']
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required']
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required']
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required']
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 0.5
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0
    },
    purpose: {
      type: String,
      enum: ['Practice', 'Tournament', 'Event', 'Training', 'Recreation', 'Other'],
      default: 'Recreation'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Online', 'UPI', 'Card'],
      required: false
    },
    transactionId: {
      type: String,
      required: false
    },
    requestDate: {
      type: Date,
      default: Date.now
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedDate: {
      type: Date
    },
    rejectionReason: {
      type: String,
      maxlength: 500
    },
    remarks: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Index for querying by date and facility
sportsBookingSchema.index({ facility: 1, date: 1 });
sportsBookingSchema.index({ student: 1, status: 1 });

const SportsBooking = mongoose.model('SportsBooking', sportsBookingSchema);

export default SportsBooking;
