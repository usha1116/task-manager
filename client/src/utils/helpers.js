import { format, formatDistanceToNow, isOverdue } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Class name utility function
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

// Date formatting helpers
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isTaskOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false;
  return new Date(dueDate) < new Date();
};

// Status helpers
export const getStatusColor = (status) => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 text-gray-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'done':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in-progress':
      return 'In Progress';
    case 'done':
      return 'Done';
    default:
      return status;
  }
};

// Priority helpers
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'low':
      return 'Low';
    case 'medium':
      return 'Medium';
    case 'high':
      return 'High';
    case 'urgent':
      return 'Urgent';
    default:
      return priority;
  }
};

// Role helpers
export const getRoleLabel = (role) => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'member':
      return 'Member';
    default:
      return role;
  }
};

export const getRoleColor = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    case 'member':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Search and filter helpers
export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (task.status !== filters.status) return false;
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      if (task.priority !== filters.priority) return false;
    }

    // Assignee filter
    if (filters.assignee && filters.assignee !== 'all') {
      if (task.assignee._id !== filters.assignee) return false;
    }

    // Overdue filter
    if (filters.overdue) {
      if (!isTaskOverdue(task.dueDate, task.status)) return false;
    }

    return true;
  });
};

export const sortTasks = (tasks, sortBy, sortOrder = 'asc') => {
  return [...tasks].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'priority':
        aValue = a.priority;
        bValue = b.priority;
        break;
      case 'dueDate':
        aValue = new Date(a.dueDate);
        bValue = new Date(b.dueDate);
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'assignee':
        aValue = a.assignee.name.toLowerCase();
        bValue = b.assignee.name.toLowerCase();
        break;
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
    }

    if (sortOrder === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  });
};

// Pagination helper
export const paginateData = (data, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalItems: data.length,
      hasNextPage: endIndex < data.length,
      hasPrevPage: page > 1,
    },
  };
};

// Form validation helpers
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

// Local storage helpers
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};
