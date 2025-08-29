

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [usingFallbackUsers, setUsingFallbackUsers] = useState(false);

  useEffect(() => {
    fetchUsers();
    
    if (isEditing) {
      fetchTask();
    }
  }, [isEditing, id]);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    setUsingFallbackUsers(false);
    try {
      console.log('Fetching users...');
      const response = await api.get('/users');
      console.log('Users API response:', response.data);
      if (response.data.success) {
        setUsers(response.data.data);
        console.log('Fetched users:', response.data.data);
      } else {
        console.error('Users API returned success: false');
        // Fallback to known users from the database
        setUsers([
          { _id: '68b0472d4019e3250a3cce5b', name: 'isha', email: 'admin@example.com' },
          { _id: '68b0473e4019e3250a3cce5f', name: 'Member User', email: 'member@example.com' },
          { _id: '68b044fd4019e3250a3cce0b', name: 'xyz', email: 'ashaben00007@gmail.com' },
          { _id: '68b03a0f88fe68758770708e', name: 'usha teli', email: 'abc@gmail.com' }
        ]);
        setUsingFallbackUsers(true);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error response:', error.response?.data);
      // Fallback to known users from the database
      setUsers([
        { _id: '68b0472d4019e3250a3cce5b', name: 'isha', email: 'admin@example.com' },
        { _id: '68b0473e4019e3250a3cce5f', name: 'Member User', email: 'member@example.com' },
        { _id: '68b044fd4019e3250a3cce0b', name: 'xyz', email: 'ashaben00007@gmail.com' },
        { _id: '68b03a0f88fe68758770708e', name: 'usha teli', email: 'abc@gmail.com' }
      ]);
      setUsingFallbackUsers(true);
    } finally {
      setFetchingUsers(false);
    }
  };

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      if (response.data.success) {
        const task = response.data.data;
        setFormData({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          assignee: task.assignee._id,
          tags: task.tags || []
        });
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      // Don't set fallback data - let the user see the error
      setErrors({ submit: 'Failed to load task details' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.assignee) {
      newErrors.assignee = 'Assignee is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      let response;
      if (isEditing) {
        response = await api.put(`/tasks/${id}`, taskData);
      } else {
        response = await api.post('/tasks', taskData);
      }
      
      if (response.data.success) {
        navigate('/tasks');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save task';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/tasks')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Update task details and information' : 'Add a new task to your project'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Task Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            error={errors.title}
            required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-opacity-20 focus:outline-none ${
                errors.description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
              placeholder="Describe the task in detail..."
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Due Date and Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Due Date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              leftIcon={Calendar}
              error={errors.dueDate}
              required
            />

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <select
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                disabled={fetchingUsers}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-opacity-20 focus:outline-none ${
                  errors.assignee 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
                required
              >
                <option value="">{fetchingUsers ? 'Loading users...' : 'Select assignee'}</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
                             {errors.assignee && (
                 <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>
               )}
               {usingFallbackUsers && (
                 <p className="mt-1 text-sm text-yellow-600">
                   ⚠️ Using fallback user data. Some users may not be available.
                 </p>
               )}
             </div> 

          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              <Input
                placeholder="Type a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                leftIcon={Tag}
              />
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/tasks')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TaskForm;
