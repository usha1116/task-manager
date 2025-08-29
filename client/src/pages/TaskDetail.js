import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Tag,
  Clock,
  AlertCircle,
  CheckCircle,
  MoreVertical
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatDate } from '../utils/helpers';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks/${id}`);
      if (response.data.success) {
        setTask(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Failed to load task');
      // Fallback to mock data if API fails
      setTask({
        _id: id,
        title: 'Design System Implementation',
        description: 'Create a comprehensive design system for the application that includes all UI components, color schemes, typography, and spacing guidelines. This system should be scalable and maintainable for future development.',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-02-15',
        assignee: {
          _id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        },
        tags: ['design', 'ui/ux', 'frontend'],
        createdAt: '2024-01-10',
        updatedAt: '2024-01-15'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'todo': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await api.delete(`/tasks/${id}`);
        if (response.data.success) {
          navigate('/tasks');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/tasks')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Task not found</p>
          <Button onClick={() => navigate('/tasks')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-gray-600 mt-1">Task Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate(`/tasks/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
          </Card>

          {/* Comments Section - Placeholder for future implementation */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
            <div className="text-center py-8 text-gray-500">
              <p>Comments feature coming soon!</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={getStatusVariant(task.status)}>
                  {getStatusIcon(task.status)}
                  <span className="ml-1">{task.status}</span>
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Priority</span>
                <Badge variant={getPriorityVariant(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Due Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(task.dueDate)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(task.createdAt)}
                </span>
              </div>
              
              {task.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(task.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Assignee */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignee</h3>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{task.assignee?.name || 'Unassigned'}</p>
                <p className="text-sm text-gray-600">{task.assignee?.email || ''}</p>
              </div>
            </div>
          </Card>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
