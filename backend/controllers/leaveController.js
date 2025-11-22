import Leave from '../models/Leave.js';
import User from '../models/User.js';

// @desc    Get all leave requests
// @route   GET /api/leaves
// @access  Private
export const getLeaves = async (req, res) => {
  try {
    const { status, userRole, department, startDate, endDate } = req.query;

    let query = {};
    if (status) query.status = status;
    if (userRole) query.userRole = userRole;
    if (department) query.department = department;

    // Date range filter
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    // If user is not admin/principal, only show their own leaves
    if (req.user.role !== 'Admin' && req.user.role !== 'Principal') {
      query.user = req.user._id;
    }

    const leaves = await Leave.find(query)
      .populate('user', 'name userId email role department')
      .populate('approvedBy', 'name role')
      .populate('handoverTo', 'name userId')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaves',
      error: error.message
    });
  }
};

// @desc    Get single leave request
// @route   GET /api/leaves/:id
// @access  Private
export const getLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('user', 'name userId email phone role department')
      .populate('approvedBy', 'name role')
      .populate('handoverTo', 'name userId email phone');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Check if user has permission to view this leave
    if (
      req.user.role !== 'Admin' &&
      req.user.role !== 'Principal' &&
      leave.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this leave request'
      });
    }

    res.status(200).json({
      success: true,
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave',
      error: error.message
    });
  }
};

// @desc    Create leave request
// @route   POST /api/leaves
// @access  Private
export const createLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
      documents,
      handoverTo,
      emergencyContact
    } = req.body;

    // Get user details
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get handover person details if provided
    let handoverToName = null;
    if (handoverTo) {
      const handoverUser = await User.findById(handoverTo);
      if (handoverUser) {
        handoverToName = handoverUser.name;
      }
    }

    const leave = await Leave.create({
      user: user._id,
      userName: user.name,
      userId: user.userId || user.employeeId,
      userRole: user.role,
      department: user.department || 'N/A',
      leaveType,
      startDate,
      endDate,
      reason,
      documents: documents || [],
      handoverTo,
      handoverToName,
      emergencyContact
    });

    await leave.populate('user', 'name userId email');

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating leave request',
      error: error.message
    });
  }
};

// @desc    Update leave request
// @route   PUT /api/leaves/:id
// @access  Private
export const updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Only allow updates if leave is pending and by the owner
    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update leave request that is not pending'
      });
    }

    if (leave.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this leave request'
      });
    }

    const { leaveType, startDate, endDate, reason, documents, handoverTo, emergencyContact } = req.body;

    // Update fields
    if (leaveType !== undefined) leave.leaveType = leaveType;
    if (startDate !== undefined) leave.startDate = startDate;
    if (endDate !== undefined) leave.endDate = endDate;
    if (reason !== undefined) leave.reason = reason;
    if (documents !== undefined) leave.documents = documents;
    if (handoverTo !== undefined) {
      leave.handoverTo = handoverTo;
      if (handoverTo) {
        const handoverUser = await User.findById(handoverTo);
        if (handoverUser) {
          leave.handoverToName = handoverUser.name;
        }
      }
    }
    if (emergencyContact !== undefined) leave.emergencyContact = emergencyContact;

    await leave.save();

    res.status(200).json({
      success: true,
      message: 'Leave request updated successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating leave request',
      error: error.message
    });
  }
};

// @desc    Delete leave request
// @route   DELETE /api/leaves/:id
// @access  Private
export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Only allow deletion if pending and by owner or admin
    if (
      req.user.role !== 'Admin' &&
      req.user.role !== 'Principal' &&
      leave.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this leave request'
      });
    }

    if (leave.status !== 'pending' && req.user.role !== 'Admin' && req.user.role !== 'Principal') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete leave request that is not pending'
      });
    }

    await leave.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Leave request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting leave request',
      error: error.message
    });
  }
};

// @desc    Approve leave request
// @route   PUT /api/leaves/:id/approve
// @access  Private (Principal/Admin)
export const approveLeave = async (req, res) => {
  try {
    const { remarks } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be approved'
      });
    }

    leave.status = 'approved';
    leave.approvedBy = req.user._id;
    leave.approvedByName = req.user.name;
    leave.approvedDate = new Date();
    if (remarks) leave.remarks = remarks;

    await leave.save();

    res.status(200).json({
      success: true,
      message: 'Leave request approved successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving leave request',
      error: error.message
    });
  }
};

// @desc    Reject leave request
// @route   PUT /api/leaves/:id/reject
// @access  Private (Principal/Admin)
export const rejectLeave = async (req, res) => {
  try {
    const { reason, remarks } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending leave requests can be rejected'
      });
    }

    leave.status = 'rejected';
    leave.approvedBy = req.user._id;
    leave.approvedByName = req.user.name;
    leave.approvedDate = new Date();
    leave.rejectionReason = reason;
    if (remarks) leave.remarks = remarks;

    await leave.save();

    res.status(200).json({
      success: true,
      message: 'Leave request rejected successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting leave request',
      error: error.message
    });
  }
};

// @desc    Cancel leave request
// @route   PUT /api/leaves/:id/cancel
// @access  Private
export const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Only owner can cancel
    if (leave.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this leave request'
      });
    }

    if (leave.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Leave request is already cancelled'
      });
    }

    leave.status = 'cancelled';
    await leave.save();

    res.status(200).json({
      success: true,
      message: 'Leave request cancelled successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling leave request',
      error: error.message
    });
  }
};

// @desc    Get leave statistics
// @route   GET /api/leaves/stats
// @access  Private (Principal/Admin)
export const getLeaveStats = async (req, res) => {
  try {
    const totalLeaves = await Leave.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
    const approvedLeaves = await Leave.countDocuments({ status: 'approved' });
    const rejectedLeaves = await Leave.countDocuments({ status: 'rejected' });

    const leavesByType = await Leave.aggregate([
      { $group: { _id: '$leaveType', count: { $sum: 1 } } }
    ]);

    const leavesByRole = await Leave.aggregate([
      { $group: { _id: '$userRole', count: { $sum: 1 } } }
    ]);

    const leavesByDepartment = await Leave.aggregate([
      { $match: { department: { $ne: 'N/A' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLeaves,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        leavesByType,
        leavesByRole,
        leavesByDepartment
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave statistics',
      error: error.message
    });
  }
};
