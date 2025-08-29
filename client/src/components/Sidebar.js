import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { 
  Home, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  LogOut,
  X
} from 'lucide-react';
import Button from './ui/Button';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview and analytics' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, description: 'Manage your tasks' },
    { name: 'Users', href: '/users', icon: Users, description: 'Team management', adminOnly: true },
    { name: 'Statistics', href: '/statistics', icon: BarChart3, description: 'Reports and insights' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full sidebar">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">TaskFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${
                isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              <div className="flex-1">
                <div>{item.name}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="px-4 py-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Button as={Link} to="/tasks/new" className="w-full justify-start">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <Button as={Link} to="/settings" variant="outline" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || 'member'}
            </p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:z-30">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <SidebarContent />
        </div>
      )}
    </>
  );
};

export default Sidebar;
