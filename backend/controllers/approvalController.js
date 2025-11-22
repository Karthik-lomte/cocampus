import Approval from '../models/Approval.js';

// @desc    Get all approvals
// @route   GET /api/approvals
// @access  Private (Admin/HoD/Principal)
export const getApprovals = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

    const approvals = await Approval.find(filter)
      .populate('requestedBy', 'name email role')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: approvals.length,
      data: approvals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching approvals',
      error: error.message,
    });
  }
};

// @desc    Get single approval
// @route   GET /api/approvals/:id
// @access  Private
export const getApproval = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id)
      .populate('requestedBy', 'name email role phone')
      .populate('approvedBy', 'name email');

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found',
      });
    }

    res.status(200).json({
      success: true,
      data: approval,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching approval',
      error: error.message,
    });
  }
};

// @desc    Create approval request
// @route   POST /api/approvals
// @access  Private
export const createApproval = async (req, res) => {
  try {
    const approvalData = {
      ...req.body,
      requestedBy: req.user._id,
      requestedByName: req.user.name,
      requestedByRole: req.user.role,
    };

    const approval = await Approval.create(approvalData);

    res.status(201).json({
      success: true,
      message: 'Approval request created successfully',
      data: approval,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating approval request',
      error: error.message,
    });
  }
};

// @desc    Approve request
// @route   PUT /api/approvals/:id/approve
// @access  Private (Admin/HoD/Principal)
export const approveRequest = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found',
      });
    }

    if (approval.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${approval.status}`,
      });
    }

    approval.status = 'approved';
    approval.approvedBy = req.user._id;
    approval.approvedByName = req.user.name;
    approval.approvedAt = new Date();

    await approval.save();

    res.status(200).json({
      success: true,
      message: 'Request approved successfully',
      data: approval,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving request',
      error: error.message,
    });
  }
};

// @desc    Reject request
// @route   PUT /api/approvals/:id/reject
// @access  Private (Admin/HoD/Principal)
export const rejectRequest = async (req, res) => {
  try {
    const { reason } = req.body;

    const approval = await Approval.findById(req.params.id);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found',
      });
    }

    if (approval.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${approval.status}`,
      });
    }

    approval.status = 'rejected';
    approval.approvedBy = req.user._id;
    approval.approvedByName = req.user.name;
    approval.approvedAt = new Date();
    approval.rejectionReason = reason || 'No reason provided';

    await approval.save();

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      data: approval,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting request',
      error: error.message,
    });
  }
};

// @desc    Get approval stats
// @route   GET /api/approvals/stats
// @access  Private
export const getApprovalStats = async (req, res) => {
  try {
    const pending = await Approval.countDocuments({ status: 'pending' });
    const approved = await Approval.countDocuments({ status: 'approved' });
    const rejected = await Approval.countDocuments({ status: 'rejected' });

    const byType = await Approval.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: pending + approved + rejected,
        pending,
        approved,
        rejected,
        byType,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching approval stats',
      error: error.message,
    });
  }
};
