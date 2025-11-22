import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema(
  {
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 8,
      unique: true
    },
    department: {
      type: String,
      required: false,
      default: 'All' // Can be specific to department or 'All'
    },
    academicYear: {
      type: String,
      required: false,
      default: '2024-2025'
    },
    tuition: {
      type: Number,
      required: [true, 'Tuition fee is required'],
      min: 0
    },
    development: {
      type: Number,
      required: [true, 'Development fee is required'],
      min: 0
    },
    exam: {
      type: Number,
      required: [true, 'Exam fee is required'],
      min: 0
    },
    library: {
      type: Number,
      required: [true, 'Library fee is required'],
      min: 0
    },
    sports: {
      type: Number,
      required: [true, 'Sports fee is required'],
      min: 0
    },
    lab: {
      type: Number,
      required: [true, 'Lab fee is required'],
      min: 0
    },
    other: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    dueDate: {
      type: Date,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Calculate total before saving
feeStructureSchema.pre('save', function (next) {
  this.totalAmount =
    this.tuition +
    this.development +
    this.exam +
    this.library +
    this.sports +
    this.lab +
    (this.other || 0);
  next();
});

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

export default FeeStructure;
