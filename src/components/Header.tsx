import React, { useState } from 'react';
import { Bell, Search, Settings, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { User as UserType } from '../types/auth';

interface HeaderProps {
  user: UserType | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 fixed w-full top-0 z-50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">ExpenseFlow</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {!user?.emailVerified && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Shield className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600">Email not verified</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};