import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HostelBlock',
      required: [true, 'Block is required']
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required'],
      min: 1
    },
    capacity: {
      type: Number,
      required: [true, 'Room capacity is required'],
      min: 1,
      max: 4
    },
    type: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Four-Bed'],
      required: [true, 'Room type is required']
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Full', 'Maintenance', 'Reserved'],
      default: 'Available'
    },
    facilities: [{
      type: String
    }],
    remarks: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Update status based on occupancy before saving
roomSchema.pre('save', function (next) {
  if (this.currentOccupancy === 0) {
    if (this.status !== 'Maintenance' && this.status !== 'Reserved') {
      this.status = 'Available';
    }
  } else if (this.currentOccupancy < this.capacity) {
    this.status = 'Occupied';
  } else if (this.currentOccupancy >= this.capacity) {
    this.status = 'Full';
  }
  next();
});

// Create compound index for block and room number
roomSchema.index({ block: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);

export default Room;
