import User from '../models/User.js';
import Department from '../models/Department.js';
import Notice from '../models/Notice.js';
import Approval from '../models/Approval.js';
import Subject from '../models/Subject.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
export const getAdminDashboard = async (req, res) => {
  try {
    // Get user stats
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalFaculty = await User.countDocuments({ role: 'faculty', isActive: true });

    // Get department stats
    const departments = await Department.find();
    const totalDepartments = departments.length;

    // Get fee collected (mock data for now - replace with actual fee collection model)
    const feeCollected = 2.8; // In crores

    // Get pending approvals
    const pendingApprovals = await Approval.countDocuments({ status: 'pending' });

    // Get active events (mock for now)
    const activeEvents = 6;

    // Get recent activities
    const recentNotices = await Notice.find({ isActive: true })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApprovals = await Approval.find()
      .populate('requestedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(3);

    const recentActivities = [
      ...recentNotices.map(n => ({
        id: n._id,
        type: 'notice',
        message: `New notice published: ${n.title}`,
        time: getTimeAgo(n.createdAt),
        status: 'info',
      })),
      ...recentApprovals.map(a => ({
        id: a._id,
        type: 'approval',
        message: `${a.type} request ${a.status === 'pending' ? 'pending' : a.status} from ${a.requestedByName}`,
        time: getTimeAgo(a.createdAt),
        status: a.status === 'pending' ? 'warning' : a.status === 'approved' ? 'success' : 'danger',
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    // Get pending tasks
    const pendingLeaves = await Approval.countDocuments({ type: 'leave', status: 'pending' });
    const pendingCertificates = await Approval.countDocuments({ type: 'certificate', status: 'pending' });
    const pendingSportsBookings = await Approval.countDocuments({ type: 'sports_booking', status: 'pending' });

    const pendingTasks = [
      pendingLeaves > 0 && { id: 1, task: `Approve ${pendingLeaves} leave request${pendingLeaves > 1 ? 's' : ''}`, priority: 'high', link: '/admin/approvals' },
      pendingCertificates > 0 && { id: 2, task: `Process ${pendingCertificates} certificate request${pendingCertificates > 1 ? 's' : ''}`, priority: 'medium', link: '/admin/approvals' },
      pendingSportsBookings > 0 && { id: 3, task: `Review ${pendingSportsBookings} sports booking request${pendingSportsBookings > 1 ? 's' : ''}`, priority: 'medium', link: '/admin/approvals' },
    ].filter(Boolean);

    // Get department stats
    const departmentStats = departments.map(d => ({
      name: d.name,
      students: d.studentCount,
      faculty: d.facultyCount,
      performance: d.performance,
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalFaculty,
          departments: totalDepartments,
          feeCollected,
          pendingApprovals,
          activeEvents,
        },
        recentActivities,
        pendingTasks,
        departmentStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message,
    });
  }
};

// Helper function to get relative time
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}
