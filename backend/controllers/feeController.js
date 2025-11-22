import FeeStructure from '../models/FeeStructure.js';
import FeePayment from '../models/FeePayment.js';

// @desc    Get all fee structures
// @route   GET /api/fees/structures
// @access  Private (Admin/Faculty)
export const getFeeStructures = async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find().sort({ semester: 1 });
    res.status(200).json({
      success: true,
      count: feeStructures.length,
      data: feeStructures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fee structures',
      error: error.message
    });
  }
};

// @desc    Get single fee structure
// @route   GET /api/fees/structures/:id
// @access  Private
export const getFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findById(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feeStructure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fee structure',
      error: error.message
    });
  }
};

// @desc    Create fee structure
// @route   POST /api/fees/structures
// @access  Private (Admin only)
export const createFeeStructure = async (req, res) => {
  try {
    const { semester, tuition, development, exam, library, sports, lab, department, academicYear, dueDate } = req.body;

    // Check if fee structure already exists for this semester
    const existingFee = await FeeStructure.findOne({ semester });
    if (existingFee) {
      return res.status(400).json({
        success: false,
        message: 'Fee structure for this semester already exists'
      });
    }

    const feeStructure = await FeeStructure.create({
      semester,
      tuition,
      development,
      exam,
      library,
      sports,
      lab,
      department: department || 'All',
      academicYear: academicYear || '2024-2025',
      dueDate
    });

    res.status(201).json({
      success: true,
      message: 'Fee structure created successfully',
      data: feeStructure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating fee structure',
      error: error.message
    });
  }
};

// @desc    Update fee structure
// @route   PUT /api/fees/structures/:id
// @access  Private (Admin only)
export const updateFeeStructure = async (req, res) => {
  try {
    const { tuition, development, exam, library, sports, lab, dueDate, isActive } = req.body;

    const feeStructure = await FeeStructure.findById(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found'
      });
    }

    // Update fields
    if (tuition !== undefined) feeStructure.tuition = tuition;
    if (development !== undefined) feeStructure.development = development;
    if (exam !== undefined) feeStructure.exam = exam;
    if (library !== undefined) feeStructure.library = library;
    if (sports !== undefined) feeStructure.sports = sports;
    if (lab !== undefined) feeStructure.lab = lab;
    if (dueDate !== undefined) feeStructure.dueDate = dueDate;
    if (isActive !== undefined) feeStructure.isActive = isActive;

    await feeStructure.save();

    res.status(200).json({
      success: true,
      message: 'Fee structure updated successfully',
      data: feeStructure
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating fee structure',
      error: error.message
    });
  }
};

// @desc    Delete fee structure
// @route   DELETE /api/fees/structures/:id
// @access  Private (Admin only)
export const deleteFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findById(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found'
      });
    }

    // Check if there are any payments associated with this fee structure
    const paymentsCount = await FeePayment.countDocuments({ semester: feeStructure.semester });
    if (paymentsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete fee structure with existing payments'
      });
    }

    await feeStructure.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Fee structure deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting fee structure',
      error: error.message
    });
  }
};

// @desc    Get all fee payments
// @route   GET /api/fees/payments
// @access  Private (Admin/Faculty)
export const getFeePayments = async (req, res) => {
  try {
    const { semester, status } = req.query;

    let query = {};
    if (semester) query.semester = semester;
    if (status) query.status = status;

    const payments = await FeePayment.find(query)
      .populate('student', 'name email userId')
      .populate('feeStructure')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// @desc    Get single payment
// @route   GET /api/fees/payments/:id
// @access  Private
export const getFeePayment = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.id)
      .populate('student', 'name email userId')
      .populate('feeStructure');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};

// @desc    Create fee payment
// @route   POST /api/fees/payments
// @access  Private (Admin/Faculty)
export const createFeePayment = async (req, res) => {
  try {
    const {
      student,
      studentId,
      studentName,
      semester,
      totalAmount,
      paidAmount,
      paymentMethod,
      transactionId,
      paymentDate,
      dueDate,
      remarks
    } = req.body;

    const payment = await FeePayment.create({
      student,
      studentId,
      studentName,
      semester,
      totalAmount,
      paidAmount: paidAmount || 0,
      paymentMethod,
      transactionId,
      paymentDate: paymentDate || (paidAmount > 0 ? new Date() : null),
      dueDate,
      remarks
    });

    res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

// @desc    Update fee payment
// @route   PUT /api/fees/payments/:id
// @access  Private (Admin/Faculty)
export const updateFeePayment = async (req, res) => {
  try {
    const {
      paidAmount,
      paymentMethod,
      transactionId,
      paymentDate,
      remarks,
      status
    } = req.body;

    const payment = await FeePayment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update fields
    if (paidAmount !== undefined) payment.paidAmount = paidAmount;
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    if (transactionId) payment.transactionId = transactionId;
    if (paymentDate) payment.paymentDate = paymentDate;
    if (remarks !== undefined) payment.remarks = remarks;
    if (status) payment.status = status;

    // Generate receipt number if payment is being made
    if (paidAmount > 0 && !payment.receiptNumber) {
      payment.receiptNumber = `RCP${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment',
      error: error.message
    });
  }
};

// @desc    Delete fee payment
// @route   DELETE /api/fees/payments/:id
// @access  Private (Admin only)
export const deleteFeePayment = async (req, res) => {
  try {
    const payment = await FeePayment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    await payment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting payment',
      error: error.message
    });
  }
};

// @desc    Get fee statistics
// @route   GET /api/fees/stats
// @access  Private (Admin/Faculty)
export const getFeeStats = async (req, res) => {
  try {
    const totalCollected = await FeePayment.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } }
    ]);

    const totalPending = await FeePayment.aggregate([
      { $match: { status: { $in: ['Pending', 'Partial', 'Overdue'] } } },
      { $group: { _id: null, total: { $sum: '$pendingAmount' } } }
    ]);

    const paymentsByStatus = await FeePayment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$paidAmount' } } }
    ]);

    const paymentsBySemester = await FeePayment.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 }, collected: { $sum: '$paidAmount' } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCollected: totalCollected[0]?.total || 0,
        totalPending: totalPending[0]?.total || 0,
        byStatus: paymentsByStatus,
        bySemester: paymentsBySemester
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
