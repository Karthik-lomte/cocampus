import mongoose from 'mongoose';

const academicEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      maxlength: 1000
    },
    type: {
      type: String,
      enum: ['exam', 'holiday', 'academic', 'cultural', 'sports', 'other'],
      required: [true, 'Event type is required']
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Event end date is required']
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester'
    },
    department: {
      type: String,
      default: 'All'
    },
    venue: {
      type: String,
      trim: true
    },
    organizer: {
      type: String,
      trim: true
    },
    isAllDay: {
      type: Boolean,
      default: true
    },
    startTime: {
      type: String
    },
    endTime: {
      type: String
    },
    notifyStudents: {
      type: Boolean,
      default: false
    },
    notifyFaculty: {
      type: Boolean,
      default: false
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

// Index for querying by date range
academicEventSchema.index({ date: 1, endDate: 1 });

// Validate that end date is not before start date
academicEventSchema.pre('save', function (next) {
  if (this.endDate < this.date) {
    next(new Error('End date cannot be before start date'));
  }
  next();
});

const AcademicEvent = mongoose.model('AcademicEvent', academicEventSchema);

export default AcademicEvent;
