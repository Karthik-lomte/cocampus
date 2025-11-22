const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const {
  Department,
  Subject,
  Semester,
  AcademicCalendar,
  FeeStructure,
  Payment,
  HostelBlock,
  Room,
  SportsFacility,
  SportsBooking,
  Notice,
  LeaveRequest,
  CertificateRequest,
  GatePass
} = require('../models/AllModels');

const router = express.Router();

// Apply authentication and authorization middleware
router.use(protect);
router.use(authorize('admin'));

// ============================================
// DASHBOARD
// ============================================
router.get('/dashboard', async (req, res) => {
  try {
    const stats = {
      totalStudents: await User.countDocuments({ role: 'student' }),
      totalFaculty: await User.countDocuments({ role: 'faculty' }),
      totalDepartments: await Department.countDocuments(),
      totalSubjects: await Subject.countDocuments(),
      pendingApprovals: {
        leaves: await LeaveRequest.countDocuments({ status: 'pending' }),
        certificates: await CertificateRequest.countDocuments({ status: 'pending' }),
        gatePasses: await GatePass.countDocuments({ status: 'pending' })
      }
    };

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, department, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Reset user password
router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Bulk upload users
router.post('/users/bulk-upload', async (req, res) => {
  try {
    const { users } = req.body;
    const createdUsers = await User.insertMany(users);

    res.status(201).json({
      status: 'success',
      data: {
        count: createdUsers.length,
        users: createdUsers
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// DEPARTMENT MANAGEMENT
// ============================================

// Get all departments
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('hodId', 'name email')
      .sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create department
router.post('/departments', async (req, res) => {
  try {
    const department = await Department.create(req.body);

    res.status(201).json({
      status: 'success',
      data: department
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update department
router.put('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        status: 'error',
        message: 'Department not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: department
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete department
router.delete('/departments/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        status: 'error',
        message: 'Department not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Department deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// SUBJECT MANAGEMENT
// ============================================

// Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    const { department, semester } = req.query;
    const query = {};

    if (department) query.department = department;
    if (semester) query.semester = semester;

    const subjects = await Subject.find(query)
      .populate('department', 'name code')
      .populate('assignedFaculty', 'name email')
      .sort({ subjectCode: 1 });

    res.status(200).json({
      status: 'success',
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Create subject
router.post('/subjects', async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      status: 'success',
      data: subject
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update subject
router.put('/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        status: 'error',
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: subject
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Delete subject
router.delete('/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({
        status: 'error',
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// ACADEMIC MANAGEMENT
// ============================================

// Semesters
router.get('/academic/semesters', async (req, res) => {
  try {
    const semesters = await Semester.find().sort({ startDate: -1 });

    res.status(200).json({
      status: 'success',
      data: semesters
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/academic/semesters', async (req, res) => {
  try {
    const semester = await Semester.create(req.body);

    res.status(201).json({
      status: 'success',
      data: semester
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/academic/semesters/:id', async (req, res) => {
  try {
    const semester = await Semester.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: semester
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/academic/semesters/:id', async (req, res) => {
  try {
    await Semester.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Semester deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Academic Calendar
router.get('/academic/calendar', async (req, res) => {
  try {
    const events = await AcademicCalendar.find().sort({ date: 1 });

    res.status(200).json({
      status: 'success',
      data: events
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/academic/calendar', async (req, res) => {
  try {
    const event = await AcademicCalendar.create(req.body);

    res.status(201).json({
      status: 'success',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/academic/calendar/:id', async (req, res) => {
  try {
    const event = await AcademicCalendar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/academic/calendar/:id', async (req, res) => {
  try {
    await AcademicCalendar.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Calendar event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// External Marks
router.get('/academic/marks', async (req, res) => {
  try {
    // Mock implementation - would query exam results
    res.status(200).json({
      status: 'success',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/academic/marks', async (req, res) => {
  try {
    // Mock implementation - would save marks
    res.status(201).json({
      status: 'success',
      data: req.body
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/academic/marks/bulk-upload', async (req, res) => {
  try {
    // Mock implementation - would bulk upload marks
    res.status(201).json({
      status: 'success',
      message: 'Marks uploaded successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// FEE MANAGEMENT
// ============================================

router.get('/fees/structures', async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find()
      .populate('department', 'name code')
      .sort({ academicYear: -1 });

    res.status(200).json({
      status: 'success',
      data: feeStructures
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/fees/structures', async (req, res) => {
  try {
    const feeStructure = await FeeStructure.create(req.body);

    res.status(201).json({
      status: 'success',
      data: feeStructure
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/fees/structures/:id', async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: feeStructure
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/fees/structures/:id', async (req, res) => {
  try {
    await FeeStructure.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Fee structure deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/fees/payments', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('student', 'name rollNo email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      status: 'success',
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// HOSTEL MANAGEMENT
// ============================================

router.get('/hostel/blocks', async (req, res) => {
  try {
    const blocks = await HostelBlock.find()
      .populate('warden', 'name email phone')
      .sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      data: blocks
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/hostel/blocks', async (req, res) => {
  try {
    const block = await HostelBlock.create(req.body);

    res.status(201).json({
      status: 'success',
      data: block
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/hostel/blocks/:id', async (req, res) => {
  try {
    const block = await HostelBlock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: block
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/hostel/blocks/:id', async (req, res) => {
  try {
    await HostelBlock.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Hostel block deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/hostel/wardens', async (req, res) => {
  try {
    const wardens = await User.find({ role: 'hostel_warden' })
      .select('name email phone');

    res.status(200).json({
      status: 'success',
      data: wardens
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/hostel/blocks/:blockId/assign-warden', async (req, res) => {
  try {
    const { wardenId } = req.body;
    const block = await HostelBlock.findByIdAndUpdate(
      req.params.blockId,
      { warden: wardenId },
      { new: true }
    ).populate('warden', 'name email');

    res.status(200).json({
      status: 'success',
      data: block
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// SPORTS MANAGEMENT
// ============================================

router.get('/sports/facilities', async (req, res) => {
  try {
    const facilities = await SportsFacility.find().sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      data: facilities
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/sports/facilities', async (req, res) => {
  try {
    const facility = await SportsFacility.create(req.body);

    res.status(201).json({
      status: 'success',
      data: facility
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/sports/facilities/:id', async (req, res) => {
  try {
    const facility = await SportsFacility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: facility
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/sports/facilities/:id', async (req, res) => {
  try {
    await SportsFacility.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Sports facility deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/sports/bookings', async (req, res) => {
  try {
    const { status, facility } = req.query;
    const query = {};

    if (status) query.status = status;
    if (facility) query.facility = facility;

    const bookings = await SportsBooking.find(query)
      .populate('facility', 'name')
      .populate('bookedBy', 'name email')
      .sort({ bookingDate: -1 })
      .limit(100);

    res.status(200).json({
      status: 'success',
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/sports/bookings/:id/approve', async (req, res) => {
  try {
    const booking = await SportsBooking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/sports/bookings/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await SportsBooking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: reason,
        rejectedBy: req.user._id,
        rejectedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// APPROVAL MANAGEMENT
// ============================================

router.get('/approvals/pending', async (req, res) => {
  try {
    const [leaves, certificates, gatePasses, sportsBookings] = await Promise.all([
      LeaveRequest.find({ status: 'pending' })
        .populate('userId', 'name email rollNo')
        .limit(20),
      CertificateRequest.find({ status: 'pending' })
        .populate('student', 'name rollNo')
        .limit(20),
      GatePass.find({ status: 'pending' })
        .populate('student', 'name rollNo')
        .limit(20),
      SportsBooking.find({ status: 'pending' })
        .populate('bookedBy', 'name email')
        .populate('facility', 'name')
        .limit(20)
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        leaves,
        certificates,
        gatePasses,
        sportsBookings,
        total: leaves.length + certificates.length + gatePasses.length + sportsBookings.length
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/approvals/leave/:id/approve', async (req, res) => {
  try {
    const { remarks } = req.body;
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvalRemarks: remarks,
        approvedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: leave
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/approvals/leave/:id/reject', async (req, res) => {
  try {
    const { remarks } = req.body;
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectedBy: req.user._id,
        rejectionRemarks: remarks,
        rejectedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: leave
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/approvals/certificate/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const certificate = await CertificateRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: certificate
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/approvals/sports/:id/approve', async (req, res) => {
  try {
    const { remarks } = req.body;
    const booking = await SportsBooking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvalRemarks: remarks
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/approvals/sports/:id/reject', async (req, res) => {
  try {
    const { remarks } = req.body;
    const booking = await SportsBooking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectedBy: req.user._id,
        rejectionRemarks: remarks
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// NOTICE MANAGEMENT
// ============================================

router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: notices
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/notices', async (req, res) => {
  try {
    const notice = await Notice.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: notice
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/notices/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: notice
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/notices/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// REPORTS & ANALYTICS
// ============================================

router.get('/reports', async (req, res) => {
  try {
    // Mock implementation - would generate comprehensive reports
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Reports will be generated here'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// SYSTEM SETTINGS
// ============================================

router.get('/settings', async (req, res) => {
  try {
    // Mock implementation - would fetch system settings
    res.status(200).json({
      status: 'success',
      data: {
        academicYear: '2024-2025',
        currentSemester: 'Odd',
        campusName: 'Co-Campus',
        campusCoinsEnabled: true
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/settings', async (req, res) => {
  try {
    // Mock implementation - would update system settings
    res.status(200).json({
      status: 'success',
      data: req.body
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// ============================================
// PROFILE MANAGEMENT
// ============================================

router.get('/profile', async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select('-password');

    res.status(200).json({
      status: 'success',
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const { password, role, ...updateData } = req.body;

    const admin = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: admin
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await User.findById(req.user._id);

    const isPasswordCorrect = await admin.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
