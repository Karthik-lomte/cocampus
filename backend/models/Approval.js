import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Approval type is required'],
      enum: ['leave', 'certificate', 'gate_pass', 'sports_booking', 'club_event', 'other'],
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedByName: {
      type: String,
      required: true,
    },
    requestedByRole: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedByName: {
      type: String,
      default: '',
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    attachments: [{
      name: String,
      url: String,
    }],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
approvalSchema.index({ status: 1, createdAt: -1 });
approvalSchema.index({ type: 1 });
approvalSchema.index({ requestedBy: 1 });

const Approval = mongoose.model('Approval', approvalSchema);

export default Approval;
