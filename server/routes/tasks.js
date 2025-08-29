const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(auth);

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort || '-createdAt';
    const search = req.query.search || '';
    const status = req.query.status || '';
    const priority = req.query.priority || '';

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Build query
    let query = {};

    // Role-based filtering: Members can only see their own tasks
    if (req.user.role === 'member') {
      query.assignee = req.user.id;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Execute query
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort(sort)
      .limit(limit)
      .skip(startIndex);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination,
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignee, tags } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate || !assignee) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if assignee exists
    const assigneeUser = await User.findById(assignee);
    if (!assigneeUser) {
      return res.status(400).json({
        success: false,
        message: 'Assignee not found'
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      assignee,
      createdBy: req.user.id,
      tags: tags || []
    });

    // Populate assignee and createdBy
    await task.populate('assignee', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user has access to this task
    if (req.user.role === 'member' && task.assignee._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user has access to update this task
    if (req.user.role === 'member' && task.assignee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    // Prepare update data - exclude createdBy to prevent it from being changed
    const updateData = { ...req.body };
    delete updateData.createdBy; // Ensure createdBy cannot be modified

    // If assignee is being updated, validate it exists
    if (updateData.assignee) {
      const assigneeUser = await User.findById(updateData.assignee);
      if (!assigneeUser) {
        return res.status(400).json({
          success: false,
          message: 'Assignee not found'
        });
      }
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id, 
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('assignee', 'name email').populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user has access to delete this task
    if (req.user.role === 'member' && task.assignee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
