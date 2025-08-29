const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a task description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date'],
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide an assignee'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isOverdue: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for better query performance
taskSchema.index({ assignee: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdBy: 1 });

// Text index for search functionality
taskSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware to check if task is overdue
taskSchema.pre('save', function(next) {
  if (this.dueDate && this.status !== 'completed') {
    this.isOverdue = new Date() > this.dueDate;
  }
  next();
});

// Virtual for formatted due date
taskSchema.virtual('formattedDueDate').get(function() {
  return this.dueDate ? this.dueDate.toLocaleDateString() : '';
});

// Ensure virtual fields are serialized
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
