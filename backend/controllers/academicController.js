import Semester from '../models/Semester.js';
import AcademicEvent from '../models/AcademicEvent.js';

// ============= SEMESTER CONTROLLERS =============

// @desc    Get all semesters
// @route   GET /api/academic/semesters
// @access  Private
export const getSemesters = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status) query.status = status;

    const semesters = await Semester.find(query).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: semesters.length,
      data: semesters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching semesters',
      error: error.message
    });
  }
};

// @desc    Get single semester
// @route   GET /api/academic/semesters/:id
// @access  Private
export const getSemester = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    res.status(200).json({
      success: true,
      data: semester
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching semester',
      error: error.message
    });
  }
};

// @desc    Create semester
// @route   POST /api/academic/semesters
// @access  Private (Admin only)
export const createSemester = async (req, res) => {
  try {
    const {
      academicYear,
      semester,
      startDate,
      endDate,
      status,
      registrationStartDate,
      registrationEndDate,
      examStartDate,
      examEndDate
    } = req.body;

    // Check if semester already exists
    const existingSemester = await Semester.findOne({ academicYear, semester });
    if (existingSemester) {
      return res.status(400).json({
        success: false,
        message: 'Semester already exists for this academic year'
      });
    }

    const newSemester = await Semester.create({
      academicYear,
      semester,
      startDate,
      endDate,
      status,
      registrationStartDate,
      registrationEndDate,
      examStartDate,
      examEndDate
    });

    res.status(201).json({
      success: true,
      message: 'Semester created successfully',
      data: newSemester
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating semester',
      error: error.message
    });
  }
};

// @desc    Update semester
// @route   PUT /api/academic/semesters/:id
// @access  Private (Admin only)
export const updateSemester = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      status,
      registrationStartDate,
      registrationEndDate,
      examStartDate,
      examEndDate,
      isActive
    } = req.body;

    const semester = await Semester.findById(req.params.id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    // Update fields
    if (startDate !== undefined) semester.startDate = startDate;
    if (endDate !== undefined) semester.endDate = endDate;
    if (status !== undefined) semester.status = status;
    if (registrationStartDate !== undefined) semester.registrationStartDate = registrationStartDate;
    if (registrationEndDate !== undefined) semester.registrationEndDate = registrationEndDate;
    if (examStartDate !== undefined) semester.examStartDate = examStartDate;
    if (examEndDate !== undefined) semester.examEndDate = examEndDate;
    if (isActive !== undefined) semester.isActive = isActive;

    await semester.save();

    res.status(200).json({
      success: true,
      message: 'Semester updated successfully',
      data: semester
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating semester',
      error: error.message
    });
  }
};

// @desc    Delete semester
// @route   DELETE /api/academic/semesters/:id
// @access  Private (Admin only)
export const deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    // Check if there are events linked to this semester
    const eventCount = await AcademicEvent.countDocuments({ semester: semester._id });
    if (eventCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete semester with linked events'
      });
    }

    await semester.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Semester deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting semester',
      error: error.message
    });
  }
};

// ============= EVENT CONTROLLERS =============

// @desc    Get all academic events
// @route   GET /api/academic/events
// @access  Private
export const getEvents = async (req, res) => {
  try {
    const { type, department, startDate, endDate } = req.query;

    let query = {};
    if (type) query.type = type;
    if (department) query.department = department;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const events = await AcademicEvent.find(query)
      .populate('semester', 'academicYear semester')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/academic/events/:id
// @access  Private
export const getEvent = async (req, res) => {
  try {
    const event = await AcademicEvent.findById(req.params.id)
      .populate('semester', 'academicYear semester');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// @desc    Create academic event
// @route   POST /api/academic/events
// @access  Private (Admin/Faculty)
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      date,
      endDate,
      semester,
      department,
      venue,
      organizer,
      isAllDay,
      startTime,
      endTime,
      notifyStudents,
      notifyFaculty
    } = req.body;

    const event = await AcademicEvent.create({
      title,
      description,
      type,
      date,
      endDate,
      semester,
      department: department || 'All',
      venue,
      organizer,
      isAllDay,
      startTime,
      endTime,
      notifyStudents,
      notifyFaculty
    });

    await event.populate('semester', 'academicYear semester');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// @desc    Update academic event
// @route   PUT /api/academic/events/:id
// @access  Private (Admin/Faculty)
export const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      date,
      endDate,
      semester,
      department,
      venue,
      organizer,
      isAllDay,
      startTime,
      endTime,
      notifyStudents,
      notifyFaculty,
      isActive
    } = req.body;

    const event = await AcademicEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Update fields
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (type !== undefined) event.type = type;
    if (date !== undefined) event.date = date;
    if (endDate !== undefined) event.endDate = endDate;
    if (semester !== undefined) event.semester = semester;
    if (department !== undefined) event.department = department;
    if (venue !== undefined) event.venue = venue;
    if (organizer !== undefined) event.organizer = organizer;
    if (isAllDay !== undefined) event.isAllDay = isAllDay;
    if (startTime !== undefined) event.startTime = startTime;
    if (endTime !== undefined) event.endTime = endTime;
    if (notifyStudents !== undefined) event.notifyStudents = notifyStudents;
    if (notifyFaculty !== undefined) event.notifyFaculty = notifyFaculty;
    if (isActive !== undefined) event.isActive = isActive;

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// @desc    Delete academic event
// @route   DELETE /api/academic/events/:id
// @access  Private (Admin only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await AcademicEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// @desc    Get academic statistics
// @route   GET /api/academic/stats
// @access  Private
export const getAcademicStats = async (req, res) => {
  try {
    const totalSemesters = await Semester.countDocuments();
    const activeSemesters = await Semester.countDocuments({ status: 'active' });
    const totalEvents = await AcademicEvent.countDocuments();

    const eventsByType = await AcademicEvent.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const upcomingEvents = await AcademicEvent.countDocuments({
      date: { $gte: new Date() }
    });

    res.status(200).json({
      success: true,
      data: {
        totalSemesters,
        activeSemesters,
        totalEvents,
        upcomingEvents,
        eventsByType
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
