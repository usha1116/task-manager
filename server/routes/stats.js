const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(auth);

// @desc    Get overview stats
// @route   GET /api/stats/overview
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Stats endpoint - coming soon',
      data: {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
