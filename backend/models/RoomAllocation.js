import mongoose from 'mongoose';

const roomAllocationSchema = new mongoose.Schema(
  {
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
    studentContact: {
      type: String,
      default: ''
    },
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HostelBlock',
      required: [true, 'Block is required']
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required']
    },
    bedNumber: {
      type: Number,
      min: 1,
      max: 4
    },
    allocationDate: {
      type: Date,
      default: Date.now
    },
    vacateDate: {
      type: Date,
      required: false
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required']
    },
    semester: {
      type: String,
      required: [true, 'Semester is required']
    },
    status: {
      type: String,
      enum: ['Active', 'Vacated', 'Transferred'],
      default: 'Active'
    },
    feesPaid: {
      type: Boolean,
      default: false
    },
    feesAmount: {
      type: Number,
      default: 0
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

// Ensure only one active allocation per student
roomAllocationSchema.index({ student: 1, status: 1 });

// Ensure unique bed allocation per room
roomAllocationSchema.index({ room: 1, bedNumber: 1, status: 1 });

const RoomAllocation = mongoose.model('RoomAllocation', roomAllocationSchema);

export default RoomAllocation;
