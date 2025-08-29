import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import {  useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Activity,
  Plus,
  Eye,
  BarChart,
  Settings,
  Crown,
  Target,
  Award
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0,
    productivityScore: 0
  });

  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    teamPerformance: 0
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await api.get('/stats/overview');
      if (statsResponse.data.success) {
        const data = statsResponse.data.data;
        setStats({
          totalTasks: data.totalTasks || 0,
          completed: data.completedTasks || 0,
          pending: data.pendingTasks || 0,
          overdue: data.overdueTasks || 0,
          completionRate: data.totalTasks > 0 ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0,
          productivityScore: data.productivityScore || 85
        });
      }

      // Fetch recent tasks
      const tasksResponse = await api.get('/tasks?limit=5&sort=-createdAt');
      if (tasksResponse.data.success) {
        setRecentTasks(tasksResponse.data.data.map(task => ({
          id: task._id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
          assignee: task.assignee?.name || 'Unassigned'
        })));
      }

      // Fetch admin stats if user is admin
      if (user?.role === 'admin') {
        const usersResponse = await api.get('/users');
        if (usersResponse.data.success) {
          const users = usersResponse.data.data;
          setAdminStats({
            totalUsers: users.length,
            activeUsers: users.filter(u => u.status === 'active').length,
            totalProjects: Math.floor(users.length * 1.5), // Mock calculation
            teamPerformance: Math.round((stats.completed / Math.max(stats.totalTasks, 1)) * 100)
          });
        }
      }

      // Generate recent activities from tasks
      if (tasksResponse.data.success) {
        const activities = tasksResponse.data.data.slice(0, 3).map(task => ({
          id: task._id,
          type: 'task_created',
          message: `Task "${task.title}" was created`,
          time: new Date(task.createdAt).toLocaleDateString(),
          user: task.assignee?.name || 'System'
        }));
        setRecentActivities(activities);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Fallback to mock data
      setStats({
        totalTasks: 24,
        completed: 18,
        pending: 4,
        overdue: 2,
        completionRate: 75,
        productivityScore: 85
      });

      setRecentTasks([
        {
          id: 1,
          title: 'Design System Implementation',
          status: 'completed',
          priority: 'high',
          dueDate: '2024-01-15',
          assignee: 'John Doe'
        },
        {
          id: 2,
          title: 'API Documentation Update',
          status: 'in-progress',
          priority: 'medium',
          dueDate: '2024-01-20',
          assignee: 'Jane Smith'
        },
        {
          id: 3,
          title: 'User Testing Session',
          status: 'todo',
          priority: 'low',
          dueDate: '2024-01-25',
          assignee: 'Mike Johnson'
        }
      ]);

      setRecentActivities([
        {
          id: 1,
          type: 'task_completed',
          message: 'John Doe completed "Design System Implementation"',
          time: '2 hours ago',
          user: 'John Doe'
        },
        {
          id: 2,
          type: 'task_created',
          message: 'New task "User Testing Session" created',
          time: '4 hours ago',
          user: 'Jane Smith'
        },
        {
          id: 3,
          type: 'user_joined',
          message: 'Mike Johnson joined the team',
          time: '1 day ago',
          user: 'Mike Johnson'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'todo': return 'default';
      default: return 'default';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, trendDirection = 'up' }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Icon className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendDirection === 'up' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {trendValue}
          </div>
        )}
      </div>
    </Card>
  );

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Loading dashboard data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}! Here's what's happening today.
            {isAdmin && <span className="ml-2 text-primary-600">👑 Admin Dashboard</span>}
          </p>
        </div>
        <Button onClick={() => navigate('/tasks/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={BarChart3}
          trend={true}
          trendValue="+12%"
          trendDirection="up"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          trend={true}
          trendValue="+8%"
          trendDirection="up"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          trend={true}
          trendValue="-3%"
          trendDirection="down"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          trend={true}
          trendValue="-5%"
          trendDirection="down"
        />
      </div>

      {/* Admin-specific stats */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={adminStats.totalUsers}
            icon={Users}
            trend={true}
            trendValue="+2"
            trendDirection="up"
          />
          <StatCard
            title="Active Users"
            value={adminStats.activeUsers}
            icon={Crown}
            trend={true}
            trendValue="+1"
            trendDirection="up"
          />
          <StatCard
            title="Projects"
            value={adminStats.totalProjects}
            icon={Target}
            trend={true}
            trendValue="+3"
            trendDirection="up"
          />
          <StatCard
            title="Team Performance"
            value={`${adminStats.teamPerformance}%`}
            icon={Award}
            trend={true}
            trendValue="+5%"
            trendDirection="up"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
              <Button variant="outline" as={Link} to="/tasks" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={getStatusVariant(task.status)} size="sm">
                        {task.status}
                      </Badge>
                      <Badge variant={getPriorityVariant(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                      <span className="text-sm text-gray-500">Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{task.assignee}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Completion Rate */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate</h3>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.completionRate / 100)}`}
                    className="text-primary-600"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xl font-bold text-gray-900">{stats.completionRate}%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Tasks completed this month</p>
            </div>
          </Card>

          {/* Productivity Score */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Score</h3>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.productivityScore}</p>
                <p className="text-sm text-gray-600">Excellent performance</p>
              </div>
            </div>
          </Card>

          {/* Recent Activities - Admin Only */}
          {isAdmin && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          {/* <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" as={Link} to="/tasks" className="w-full justify-start">
                <BarChart className="h-4 w-4 mr-2" />
                View All Tasks
              </Button>
              <Button variant="outline" as={Link} to="/statistics" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              {isAdmin && (
                <Button variant="outline" as={Link} to="/users" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              )}
            </div>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
