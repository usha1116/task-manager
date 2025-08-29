import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import TaskForm from './pages/TaskForm';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Users from './pages/Users';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/new" element={<TaskForm />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="tasks/:id/edit" element={<TaskForm />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="users" element={
          <ProtectedRoute adminOnly>
            <Users />
          </ProtectedRoute>
        } />
        
        {/* Placeholder routes for future implementation */}
        <Route path="calendar" element={
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendar</h2>
              <p className="text-gray-600">Calendar view coming soon...</p>
            </div>
          </div>
        } />
        <Route path="statistics" element={
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Statistics</h2>
              <p className="text-gray-600">Detailed statistics coming soon...</p>
            </div>
          </div>
        } />
        <Route path="activity" element={
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity</h2>
              <p className="text-gray-600">Activity log coming soon...</p>
            </div>
          </div>
        } />
        <Route path="notifications" element={
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
              <p className="text-gray-600">All notifications coming soon...</p>
            </div>
          </div>
        } />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
