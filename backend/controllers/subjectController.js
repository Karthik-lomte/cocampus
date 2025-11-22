import Subject from '../models/Subject.js';

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req, res) => {
  try {
    const { department, semester, type } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);
    if (type) filter.type = type;

    const subjects = await Subject.find(filter).sort({ semester: 1, code: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message,
    });
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Private
export const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subject',
      error: error.message,
    });
  }
};

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private (Admin only)
export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Subject with this code already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating subject',
      error: error.message,
    });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin only)
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subject',
      error: error.message,
    });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin only)
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subject',
      error: error.message,
    });
  }
};

// @desc    Get subject stats
// @route   GET /api/subjects/stats
// @access  Private
export const getSubjectStats = async (req, res) => {
  try {
    const subjects = await Subject.find();
    const theoryCount = subjects.filter(s => s.type === 'Theory').length;
    const labCount = subjects.filter(s => s.type === 'Lab').length;
    const electiveCount = subjects.filter(s => s.type === 'Elective').length;

    res.status(200).json({
      success: true,
      data: {
        total: subjects.length,
        theory: theoryCount,
        lab: labCount,
        elective: electiveCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subject stats',
      error: error.message,
    });
  }
};
