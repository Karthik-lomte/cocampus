import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Notice content is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Academic', 'Exam', 'Fee', 'Event', 'Placement', 'General', 'Holiday', 'Emergency'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postedByName: {
      type: String,
      default: 'Admin',
    },
    attachment: {
      type: String,
      default: null,
    },
    attachmentName: {
      type: String,
      default: null,
    },
    targetAudience: {
      type: [String],
      default: ['all'], // can be 'all', 'student', 'faculty', 'hod', etc.
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
noticeSchema.index({ category: 1 });
noticeSchema.index({ pinned: -1, createdAt: -1 });
noticeSchema.index({ expiresAt: 1 });

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
