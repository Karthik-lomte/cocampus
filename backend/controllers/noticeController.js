import Notice from '../models/Notice.js';

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
export const getNotices = async (req, res) => {
  try {
    const { category, pinned } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (pinned === 'true') filter.pinned = true;

    const notices = await Notice.find(filter)
      .populate('postedBy', 'name role')
      .sort({ pinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notices',
      error: error.message,
    });
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Private
export const getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('postedBy', 'name role email');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    // Increment views
    notice.views += 1;
    await notice.save();

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notice',
      error: error.message,
    });
  }
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private (Admin/Faculty)
export const createNotice = async (req, res) => {
  try {
    const noticeData = {
      ...req.body,
      postedBy: req.user._id,
      postedByName: req.user.name,
    };

    const notice = await Notice.create(noticeData);

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notice',
      error: error.message,
    });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private (Admin/Faculty)
export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notice',
      error: error.message,
    });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin only)
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notice',
      error: error.message,
    });
  }
};

// @desc    Toggle notice pin status
// @route   PATCH /api/notices/:id/pin
// @access  Private (Admin only)
export const togglePin = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    notice.pinned = !notice.pinned;
    await notice.save();

    res.status(200).json({
      success: true,
      message: `Notice ${notice.pinned ? 'pinned' : 'unpinned'} successfully`,
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling pin status',
      error: error.message,
    });
  }
};

// @desc    Get notice stats
// @route   GET /api/notices/stats
// @access  Private
export const getNoticeStats = async (req, res) => {
  try {
    const total = await Notice.countDocuments({ isActive: true });
    const pinned = await Notice.countDocuments({ isActive: true, pinned: true });

    // Count notices created this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = await Notice.countDocuments({
      isActive: true,
      createdAt: { $gte: startOfMonth },
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        pinned,
        thisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notice stats',
      error: error.message,
    });
  }
};
