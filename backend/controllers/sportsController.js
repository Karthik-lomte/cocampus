import SportsFacility from '../models/SportsFacility.js';
import SportsBooking from '../models/SportsBooking.js';

// ============= FACILITY CONTROLLERS =============

// @desc    Get all sports facilities
// @route   GET /api/sports/facilities
// @access  Private
export const getFacilities = async (req, res) => {
  try {
    const { type, status } = req.query;

    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const facilities = await SportsFacility.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching facilities',
      error: error.message
    });
  }
};

// @desc    Get single facility
// @route   GET /api/sports/facilities/:id
// @access  Private
export const getFacility = async (req, res) => {
  try {
    const facility = await SportsFacility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Get booking statistics for this facility
    const bookingCount = await SportsBooking.countDocuments({
      facility: facility._id,
      status: { $in: ['approved', 'completed'] }
    });

    res.status(200).json({
      success: true,
      data: {
        ...facility.toObject(),
        totalBookings: bookingCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching facility',
      error: error.message
    });
  }
};

// @desc    Create facility
// @route   POST /api/sports/facilities
// @access  Private (Admin only)
export const createFacility = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      capacity,
      pricePerHour,
      status,
      facilities,
      availableFrom,
      availableTo,
      bookingDuration,
      maxBookingsPerDay,
      description
    } = req.body;

    // Check if facility already exists
    const existingFacility = await SportsFacility.findOne({ name });
    if (existingFacility) {
      return res.status(400).json({
        success: false,
        message: 'Facility with this name already exists'
      });
    }

    const facility = await SportsFacility.create({
      name,
      type,
      location,
      capacity,
      pricePerHour,
      status,
      facilities,
      availableFrom,
      availableTo,
      bookingDuration,
      maxBookingsPerDay,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: facility
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating facility',
      error: error.message
    });
  }
};

// @desc    Update facility
// @route   PUT /api/sports/facilities/:id
// @access  Private (Admin only)
export const updateFacility = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      capacity,
      pricePerHour,
      status,
      facilities,
      availableFrom,
      availableTo,
      bookingDuration,
      maxBookingsPerDay,
      description,
      isActive
    } = req.body;

    const facility = await SportsFacility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Update fields
    if (name !== undefined) facility.name = name;
    if (type !== undefined) facility.type = type;
    if (location !== undefined) facility.location = location;
    if (capacity !== undefined) facility.capacity = capacity;
    if (pricePerHour !== undefined) facility.pricePerHour = pricePerHour;
    if (status !== undefined) facility.status = status;
    if (facilities !== undefined) facility.facilities = facilities;
    if (availableFrom !== undefined) facility.availableFrom = availableFrom;
    if (availableTo !== undefined) facility.availableTo = availableTo;
    if (bookingDuration !== undefined) facility.bookingDuration = bookingDuration;
    if (maxBookingsPerDay !== undefined) facility.maxBookingsPerDay = maxBookingsPerDay;
    if (description !== undefined) facility.description = description;
    if (isActive !== undefined) facility.isActive = isActive;

    await facility.save();

    res.status(200).json({
      success: true,
      message: 'Facility updated successfully',
      data: facility
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating facility',
      error: error.message
    });
  }
};

// @desc    Delete facility
// @route   DELETE /api/sports/facilities/:id
// @access  Private (Admin only)
export const deleteFacility = async (req, res) => {
  try {
    const facility = await SportsFacility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    // Check for active bookings
    const activeBookings = await SportsBooking.countDocuments({
      facility: facility._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete facility with active bookings'
      });
    }

    await facility.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting facility',
      error: error.message
    });
  }
};

// ============= BOOKING CONTROLLERS =============

// @desc    Get all bookings
// @route   GET /api/sports/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    const { facility, status, studentId, startDate, endDate } = req.query;

    let query = {};
    if (facility) query.facility = facility;
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const bookings = await SportsBooking.find(query)
      .populate('facility', 'name type location')
      .populate('student', 'name userId email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/sports/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await SportsBooking.findById(req.params.id)
      .populate('facility', 'name type location pricePerHour')
      .populate('student', 'name userId email phone')
      .populate('approvedBy', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// @desc    Create booking
// @route   POST /api/sports/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      facility,
      facilityName,
      student,
      studentId,
      studentName,
      date,
      startTime,
      endTime,
      duration,
      amount,
      purpose,
      remarks
    } = req.body;

    // Check if facility exists and is available
    const facilityDoc = await SportsFacility.findById(facility);
    if (!facilityDoc) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    if (facilityDoc.status === 'maintenance' || facilityDoc.status === 'unavailable') {
      return res.status(400).json({
        success: false,
        message: 'Facility is not available for booking'
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await SportsBooking.findOne({
      facility,
      date: new Date(date),
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    const booking = await SportsBooking.create({
      facility,
      facilityName,
      student,
      studentId,
      studentName,
      date,
      startTime,
      endTime,
      duration,
      amount,
      purpose,
      remarks
    });

    await booking.populate('facility', 'name type location');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// @desc    Update booking
// @route   PUT /api/sports/bookings/:id
// @access  Private (Admin/Faculty)
export const updateBooking = async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      paymentMethod,
      transactionId,
      approvedBy,
      rejectionReason,
      remarks
    } = req.body;

    const booking = await SportsBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update fields
    if (status !== undefined) {
      booking.status = status;
      if (status === 'approved') {
        booking.approvedDate = new Date();
      }
    }
    if (paymentStatus !== undefined) booking.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) booking.paymentMethod = paymentMethod;
    if (transactionId !== undefined) booking.transactionId = transactionId;
    if (approvedBy !== undefined) booking.approvedBy = approvedBy;
    if (rejectionReason !== undefined) booking.rejectionReason = rejectionReason;
    if (remarks !== undefined) booking.remarks = remarks;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/sports/bookings/:id
// @access  Private (Admin only)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await SportsBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message
    });
  }
};

// @desc    Approve booking
// @route   PUT /api/sports/bookings/:id/approve
// @access  Private (Admin/Faculty)
export const approveBooking = async (req, res) => {
  try {
    const booking = await SportsBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be approved'
      });
    }

    booking.status = 'approved';
    booking.approvedBy = req.user._id;
    booking.approvedDate = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking approved successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving booking',
      error: error.message
    });
  }
};

// @desc    Reject booking
// @route   PUT /api/sports/bookings/:id/reject
// @access  Private (Admin/Faculty)
export const rejectBooking = async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await SportsBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be rejected'
      });
    }

    booking.status = 'rejected';
    booking.rejectionReason = reason;
    booking.approvedBy = req.user._id;
    booking.approvedDate = new Date();

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking rejected successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting booking',
      error: error.message
    });
  }
};

// @desc    Get sports statistics
// @route   GET /api/sports/stats
// @access  Private
export const getSportsStats = async (req, res) => {
  try {
    const totalFacilities = await SportsFacility.countDocuments();
    const availableFacilities = await SportsFacility.countDocuments({ status: 'available' });
    const totalBookings = await SportsBooking.countDocuments();
    const pendingBookings = await SportsBooking.countDocuments({ status: 'pending' });

    const bookingsByStatus = await SportsBooking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const bookingsByFacility = await SportsBooking.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      { $group: { _id: '$facility', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      { $lookup: { from: 'sportsfacilities', localField: '_id', foreignField: '_id', as: 'facility' } },
      { $unwind: '$facility' },
      { $project: { facilityName: '$facility.name', count: 1, revenue: 1 } }
    ]);

    const totalRevenue = await SportsBooking.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFacilities,
        availableFacilities,
        totalBookings,
        pendingBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        bookingsByStatus,
        bookingsByFacility
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
