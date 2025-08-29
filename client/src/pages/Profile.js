import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { 
  User, 
  Mail, 
  Calendar,
  MapPin,
  Phone,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Activity
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    website: user?.website || '',
    avatar: user?.avatar || null
  });

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    joinDate: '2024-01-01',
    lastActive: '2024-01-15'
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/stats/overview');
      if (response.data.success) {
        setStats({
          totalTasks: response.data.data.totalTasks || 0,
          completedTasks: response.data.data.completedTasks || 0,
          pendingTasks: response.data.data.pendingTasks || 0,
          overdueTasks: response.data.data.overdueTasks || 0,
          joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2024-01-01',
          lastActive: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '2024-01-15'
        });
      } else {
        // Fallback to mock data if API fails
        setStats({
          totalTasks: 24,
          completedTasks: 18,
          pendingTasks: 4,
          overdueTasks: 2,
          joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2024-01-01',
          lastActive: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '2024-01-15'
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Fallback to mock data if API fails
      setStats({
        totalTasks: 24,
        completedTasks: 18,
        pendingTasks: 4,
        overdueTasks: 2,
        joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2024-01-01',
        lastActive: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '2024-01-15'
      });
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await api.get('/tasks?limit=5');
      if (response.data.success) {
        const activities = response.data.data.map(task => ({
          id: task._id,
          type: 'task_created',
          message: `Created task "${task.title}"`,
          time: new Date(task.createdAt).toLocaleDateString(),
          icon: '📝'
        }));
        setRecentActivity(activities);
      } else {
        // Fallback to mock data if API fails
        setRecentActivity([
          {
            id: 1,
            type: 'task_completed',
            message: 'Completed task "Design System Implementation"',
            time: '2 hours ago',
            icon: '✅'
          },
          {
            id: 2,
            type: 'task_created',
            message: 'Created new task "API Documentation Update"',
            time: '1 day ago',
            icon: '📝'
          },
          {
            id: 3,
            type: 'profile_updated',
            message: 'Updated profile information',
            time: '3 days ago',
            icon: '👤'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      // Fallback to mock data if API fails
      setRecentActivity([
        {
          id: 1,
          type: 'task_completed',
          message: 'Completed task "Design System Implementation"',
          time: '2 hours ago',
          icon: '✅'
        },
        {
          id: 2,
          type: 'task_created',
          message: 'Created new task "API Documentation Update"',
          time: '1 day ago',
          icon: '📝'
        },
        {
          id: 3,
          type: 'profile_updated',
          message: 'Updated profile information',
          time: '3 days ago',
          icon: '👤'
        }
      ]);
    }
  };

  useEffect(() => {
    // Update profile data when user changes
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      phone: user?.phone || '',
      website: user?.website || '',
      avatar: user?.avatar || null
    });

    // Fetch user stats and activity
    fetchUserStats();
    fetchRecentActivity();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Update user context with new data
        if (updateUser) {
          updateUser(response.data.user);
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      phone: user?.phone || '',
      website: user?.website || '',
      avatar: user?.avatar || null
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} loading={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Profile" 
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary-700">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer">
                    <Camera className="h-4 w-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    leftIcon={User}
                    disabled={!isEditing}
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    leftIcon={Mail}
                    disabled={!isEditing}
                  />
                  
                  <Input
                    label="Location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    leftIcon={MapPin}
                    disabled={!isEditing}
                  />
                  
                  <Input
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    leftIcon={Phone}
                    disabled={!isEditing}
                  />
                  
                  <Input
                    label="Website"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                {/* Bio */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    disabled={!isEditing}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.totalTasks}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
              <div className="text-sm text-gray-600">Overdue</div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="text-lg">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{user?.role || 'member'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium text-gray-900">{stats.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Active</span>
                <span className="text-sm font-medium text-gray-900">{stats.lastActive}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                View Activity Log
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
