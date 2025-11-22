import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true
    },
    semester: {
      type: String,
      enum: ['Odd', 'Even', 'Summer'],
      required: [true, 'Semester type is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'upcoming'
    },
    registrationStartDate: {
      type: Date
    },
    registrationEndDate: {
      type: Date
    },
    examStartDate: {
      type: Date
    },
    examEndDate: {
      type: Date
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

// Create compound index for academic year and semester
semesterSchema.index({ academicYear: 1, semester: 1 }, { unique: true });

// Validate that end date is after start date
semesterSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

const Semester = mongoose.model('Semester', semesterSchema);

export default Semester;
