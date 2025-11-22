import mongoose from 'mongoose';

const sportsFacilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      unique: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['indoor', 'outdoor'],
      required: [true, 'Facility type is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: 1
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: 0
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance', 'unavailable'],
      default: 'available'
    },
    facilities: [{
      type: String
    }],
    availableFrom: {
      type: String,
      default: '06:00'
    },
    availableTo: {
      type: String,
      default: '22:00'
    },
    bookingDuration: {
      type: Number,
      default: 1,
      min: 0.5
    },
    maxBookingsPerDay: {
      type: Number,
      default: 3
    },
    description: {
      type: String,
      maxlength: 500
    },
    image: {
      type: String
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

const SportsFacility = mongoose.model('SportsFacility', sportsFacilitySchema);

export default SportsFacility;
