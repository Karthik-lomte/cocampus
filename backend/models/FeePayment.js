import mongoose from 'mongoose';

const feePaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required']
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required']
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required']
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 8
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeStructure',
      required: false
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    pendingAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
      default: 'Pending'
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Online', 'Bank Transfer', 'Cheque', 'UPI', 'Card'],
      required: false
    },
    transactionId: {
      type: String,
      required: false
    },
    paymentDate: {
      type: Date,
      required: false
    },
    dueDate: {
      type: Date,
      required: false
    },
    remarks: {
      type: String,
      maxlength: 500
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

// Calculate pending amount and update status before saving
feePaymentSchema.pre('save', function (next) {
  this.pendingAmount = this.totalAmount - this.paidAmount;

  if (this.paidAmount === 0) {
    this.status = 'Pending';
  } else if (this.paidAmount < this.totalAmount) {
    this.status = 'Partial';
  } else if (this.paidAmount >= this.totalAmount) {
    this.status = 'Paid';
  }

  // Check if overdue
  if (this.dueDate && new Date() > this.dueDate && this.status !== 'Paid') {
    this.status = 'Overdue';
  }

  next();
});

const FeePayment = mongoose.model('FeePayment', feePaymentSchema);

export default FeePayment;
