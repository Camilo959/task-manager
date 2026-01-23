// src/components/layout/Header.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'EDITOR':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor()}`}>
              {user?.role}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <button
                onClick={() => navigate('/users')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Manage Users
              </button>
            )}
            <button
              onClick={() => navigate('/tasks')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Tasks
            </button>
            <div className="text-sm text-gray-600">
              {user?.name}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};