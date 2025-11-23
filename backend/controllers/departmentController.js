import Department from '../models/Department.js';
import User from '../models/User.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('hod', 'name email phone employeeId department role');

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message,
    });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private
export const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('hod', 'name email phone employeeId department role');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching department',
      error: error.message,
    });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private (Admin only)
export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Department with this code or name already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating department',
      error: error.message,
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin only)
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating department',
      error: error.message,
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting department',
      error: error.message,
    });
  }
};

// @desc    Get department stats
// @route   GET /api/departments/stats
// @access  Private
export const getDepartmentStats = async (req, res) => {
  try {
    const departments = await Department.find();
    const totalStudents = departments.reduce((acc, dept) => acc + dept.studentCount, 0);
    const totalFaculty = departments.reduce((acc, dept) => acc + dept.facultyCount, 0);
    const avgPerformance = departments.reduce((acc, dept) => acc + dept.performance, 0) / departments.length;

    res.status(200).json({
      success: true,
      data: {
        totalDepartments: departments.length,
        totalStudents,
        totalFaculty,
        avgPerformance: avgPerformance.toFixed(2),
        departments: departments.map(d => ({
          name: d.name,
          code: d.code,
          students: d.studentCount,
          faculty: d.facultyCount,
          performance: d.performance,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching department stats',
      error: error.message,
    });
  }
};
