import HostelBlock from '../models/HostelBlock.js';
import Room from '../models/Room.js';
import RoomAllocation from '../models/RoomAllocation.js';
import User from '../models/User.js';

// @desc    Get all hostel blocks
// @route   GET /api/hostels/blocks
// @access  Private
export const getBlocks = async (req, res) => {
  try {
    const blocks = await HostelBlock.find()
      .populate('warden', 'name email phone')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: blocks.length,
      data: blocks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hostel blocks',
      error: error.message
    });
  }
};

// @desc    Get single hostel block
// @route   GET /api/hostels/blocks/:id
// @access  Private
export const getBlock = async (req, res) => {
  try {
    const block = await HostelBlock.findById(req.params.id)
      .populate('warden', 'name email phone');

    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Hostel block not found'
      });
    }

    res.status(200).json({
      success: true,
      data: block
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hostel block',
      error: error.message
    });
  }
};

// @desc    Create hostel block
// @route   POST /api/hostels/blocks
// @access  Private (Admin only)
export const createBlock = async (req, res) => {
  try {
    const { name, code, type, floors, roomsPerFloor, warden, facilities } = req.body;

    // Check if block already exists
    const existingBlock = await HostelBlock.findOne({ $or: [{ name }, { code }] });
    if (existingBlock) {
      return res.status(400).json({
        success: false,
        message: 'Hostel block with this name or code already exists'
      });
    }

    // Get warden details if provided
    let wardenName = 'Not Assigned';
    let wardenContact = '';
    if (warden) {
      const wardenUser = await User.findById(warden);
      if (wardenUser) {
        wardenName = wardenUser.name;
        wardenContact = wardenUser.phone || '';
      }
    }

    const block = await HostelBlock.create({
      name,
      code,
      type,
      floors,
      roomsPerFloor,
      warden,
      wardenName,
      wardenContact,
      facilities: facilities || []
    });

    res.status(201).json({
      success: true,
      message: 'Hostel block created successfully',
      data: block
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating hostel block',
      error: error.message
    });
  }
};

// @desc    Update hostel block
// @route   PUT /api/hostels/blocks/:id
// @access  Private (Admin only)
export const updateBlock = async (req, res) => {
  try {
    const { name, type, floors, roomsPerFloor, warden, facilities, isActive } = req.body;

    const block = await HostelBlock.findById(req.params.id);

    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Hostel block not found'
      });
    }

    // Update fields
    if (name !== undefined) block.name = name;
    if (type !== undefined) block.type = type;
    if (floors !== undefined) block.floors = floors;
    if (roomsPerFloor !== undefined) block.roomsPerFloor = roomsPerFloor;
    if (facilities !== undefined) block.facilities = facilities;
    if (isActive !== undefined) block.isActive = isActive;

    // Update warden if provided
    if (warden !== undefined) {
      block.warden = warden;
      if (warden) {
        const wardenUser = await User.findById(warden);
        if (wardenUser) {
          block.wardenName = wardenUser.name;
          block.wardenContact = wardenUser.phone || '';
        }
      } else {
        block.wardenName = 'Not Assigned';
        block.wardenContact = '';
      }
    }

    await block.save();

    res.status(200).json({
      success: true,
      message: 'Hostel block updated successfully',
      data: block
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hostel block',
      error: error.message
    });
  }
};

// @desc    Delete hostel block
// @route   DELETE /api/hostels/blocks/:id
// @access  Private (Admin only)
export const deleteBlock = async (req, res) => {
  try {
    const block = await HostelBlock.findById(req.params.id);

    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Hostel block not found'
      });
    }

    // Check if there are any rooms in this block
    const roomCount = await Room.countDocuments({ block: block._id });
    if (roomCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete block with existing rooms'
      });
    }

    await block.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hostel block deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting hostel block',
      error: error.message
    });
  }
};

// @desc    Get all rooms
// @route   GET /api/hostels/rooms
// @access  Private
export const getRooms = async (req, res) => {
  try {
    const { block, status } = req.query;

    let query = {};
    if (block) query.block = block;
    if (status) query.status = status;

    const rooms = await Room.find(query)
      .populate('block', 'name code type')
      .sort({ block: 1, floor: 1, roomNumber: 1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: error.message
    });
  }
};

// @desc    Get single room
// @route   GET /api/hostels/rooms/:id
// @access  Private
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('block', 'name code type');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Get current allocations
    const allocations = await RoomAllocation.find({
      room: room._id,
      status: 'Active'
    }).populate('student', 'name userId');

    res.status(200).json({
      success: true,
      data: {
        ...room.toObject(),
        allocations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching room',
      error: error.message
    });
  }
};

// @desc    Create room
// @route   POST /api/hostels/rooms
// @access  Private (Admin only)
export const createRoom = async (req, res) => {
  try {
    const { block, roomNumber, floor, capacity, type, facilities } = req.body;

    // Check if room already exists in this block
    const existingRoom = await Room.findOne({ block, roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room with this number already exists in the block'
      });
    }

    const room = await Room.create({
      block,
      roomNumber,
      floor,
      capacity,
      type,
      facilities: facilities || []
    });

    await room.populate('block', 'name code type');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating room',
      error: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/hostels/rooms/:id
// @access  Private (Admin only)
export const updateRoom = async (req, res) => {
  try {
    const { capacity, type, status, facilities, remarks } = req.body;

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Update fields
    if (capacity !== undefined) room.capacity = capacity;
    if (type !== undefined) room.type = type;
    if (status !== undefined) room.status = status;
    if (facilities !== undefined) room.facilities = facilities;
    if (remarks !== undefined) room.remarks = remarks;

    await room.save();

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating room',
      error: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/hostels/rooms/:id
// @access  Private (Admin only)
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if there are any active allocations
    const activeAllocations = await RoomAllocation.countDocuments({
      room: room._id,
      status: 'Active'
    });

    if (activeAllocations > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active allocations'
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: error.message
    });
  }
};

// @desc    Get all room allocations
// @route   GET /api/hostels/allocations
// @access  Private
export const getAllocations = async (req, res) => {
  try {
    const { block, status } = req.query;

    let query = {};
    if (block) query.block = block;
    if (status) query.status = status;

    const allocations = await RoomAllocation.find(query)
      .populate('student', 'name userId email phone')
      .populate('block', 'name code type')
      .populate('room', 'roomNumber floor')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: allocations.length,
      data: allocations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching allocations',
      error: error.message
    });
  }
};

// @desc    Create room allocation
// @route   POST /api/hostels/allocations
// @access  Private (Admin only)
export const createAllocation = async (req, res) => {
  try {
    const {
      student,
      studentId,
      studentName,
      studentContact,
      block,
      room,
      bedNumber,
      academicYear,
      semester,
      feesAmount
    } = req.body;

    // Check if student already has an active allocation
    const existingAllocation = await RoomAllocation.findOne({
      student,
      status: 'Active'
    });

    if (existingAllocation) {
      return res.status(400).json({
        success: false,
        message: 'Student already has an active room allocation'
      });
    }

    // Check if room exists and has capacity
    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (roomDoc.currentOccupancy >= roomDoc.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Room is already full'
      });
    }

    // Check if bed is already occupied
    if (bedNumber) {
      const bedOccupied = await RoomAllocation.findOne({
        room,
        bedNumber,
        status: 'Active'
      });

      if (bedOccupied) {
        return res.status(400).json({
          success: false,
          message: 'Bed number is already occupied'
        });
      }
    }

    const allocation = await RoomAllocation.create({
      student,
      studentId,
      studentName,
      studentContact,
      block,
      room,
      bedNumber,
      academicYear,
      semester,
      feesAmount: feesAmount || 0
    });

    // Update room occupancy
    roomDoc.currentOccupancy += 1;
    await roomDoc.save();

    await allocation.populate('student', 'name userId email');
    await allocation.populate('block', 'name code');
    await allocation.populate('room', 'roomNumber floor');

    res.status(201).json({
      success: true,
      message: 'Room allocation created successfully',
      data: allocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating allocation',
      error: error.message
    });
  }
};

// @desc    Update room allocation
// @route   PUT /api/hostels/allocations/:id
// @access  Private (Admin only)
export const updateAllocation = async (req, res) => {
  try {
    const { status, feesPaid, feesAmount, remarks, vacateDate } = req.body;

    const allocation = await RoomAllocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: 'Allocation not found'
      });
    }

    const oldStatus = allocation.status;

    // Update fields
    if (status !== undefined) allocation.status = status;
    if (feesPaid !== undefined) allocation.feesPaid = feesPaid;
    if (feesAmount !== undefined) allocation.feesAmount = feesAmount;
    if (remarks !== undefined) allocation.remarks = remarks;
    if (vacateDate !== undefined) allocation.vacateDate = vacateDate;

    await allocation.save();

    // Update room occupancy if status changed
    if (oldStatus === 'Active' && (status === 'Vacated' || status === 'Transferred')) {
      const room = await Room.findById(allocation.room);
      if (room) {
        room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
        await room.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Allocation updated successfully',
      data: allocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating allocation',
      error: error.message
    });
  }
};

// @desc    Delete room allocation
// @route   DELETE /api/hostels/allocations/:id
// @access  Private (Admin only)
export const deleteAllocation = async (req, res) => {
  try {
    const allocation = await RoomAllocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: 'Allocation not found'
      });
    }

    // Update room occupancy if allocation was active
    if (allocation.status === 'Active') {
      const room = await Room.findById(allocation.room);
      if (room) {
        room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
        await room.save();
      }
    }

    await allocation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Allocation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting allocation',
      error: error.message
    });
  }
};

// @desc    Get hostel statistics
// @route   GET /api/hostels/stats
// @access  Private
export const getHostelStats = async (req, res) => {
  try {
    const totalBlocks = await HostelBlock.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalAllocations = await RoomAllocation.countDocuments({ status: 'Active' });

    const roomsByStatus = await Room.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const allocationsByBlock = await RoomAllocation.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$block', count: { $sum: 1 } } },
      { $lookup: { from: 'hostelblocks', localField: '_id', foreignField: '_id', as: 'block' } },
      { $unwind: '$block' },
      { $project: { blockName: '$block.name', count: 1 } }
    ]);

    const totalCapacity = await Room.aggregate([
      { $group: { _id: null, total: { $sum: '$capacity' } } }
    ]);

    const occupancyRate = totalCapacity[0]
      ? ((totalAllocations / totalCapacity[0].total) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalBlocks,
        totalRooms,
        totalAllocations,
        totalCapacity: totalCapacity[0]?.total || 0,
        availableSpace: (totalCapacity[0]?.total || 0) - totalAllocations,
        occupancyRate: parseFloat(occupancyRate),
        roomsByStatus,
        allocationsByBlock
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
