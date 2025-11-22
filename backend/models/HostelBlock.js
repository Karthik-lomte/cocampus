import mongoose from 'mongoose';

const hostelBlockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Block name is required'],
      unique: true,
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Block code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['Boys', 'Girls', 'Co-ed'],
      required: [true, 'Block type is required']
    },
    floors: {
      type: Number,
      required: [true, 'Number of floors is required'],
      min: 1
    },
    roomsPerFloor: {
      type: Number,
      required: [true, 'Rooms per floor is required'],
      min: 1
    },
    totalRooms: {
      type: Number,
      default: 0
    },
    warden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    wardenName: {
      type: String,
      default: 'Not Assigned'
    },
    wardenContact: {
      type: String,
      default: ''
    },
    facilities: [{
      type: String
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Calculate total rooms before saving
hostelBlockSchema.pre('save', function (next) {
  this.totalRooms = this.floors * this.roomsPerFloor;
  next();
});

const HostelBlock = mongoose.model('HostelBlock', hostelBlockSchema);

export default HostelBlock;
