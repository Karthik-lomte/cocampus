import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: 1,
      max: 10,
    },
    type: {
      type: String,
      required: [true, 'Subject type is required'],
      enum: ['Theory', 'Lab', 'Elective', 'Project'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 8,
    },
    description: {
      type: String,
      default: '',
    },
    syllabus: {
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
subjectSchema.index({ code: 1 });
subjectSchema.index({ department: 1 });
subjectSchema.index({ semester: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
