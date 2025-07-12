import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Settings, Shirt, Leaf } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  // Don't show regular nav on admin pages
  if (isAdmin && location.pathname.startsWith('/admin')) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Admin Logo */}
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="bg-green-500 text-white p-2 rounded-lg relative">
                <Shirt className="h-6 w-6" />
                <Leaf className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
              </div>
              <span className="text-2xl font-bold text-gray-900">ReWear Admin</span>
            </Link>

            {/* Admin Navigation */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/admin" 
                className={`text-gray-700 hover:text-green-600 transition-colors ${
                  location.pathname === '/admin' ? 'text-green-600 font-medium' : ''
                }`}
              >
                Manage Listings
              </Link>
              <Link 
                to="/admin/users" 
                className={`text-gray-700 hover:text-green-600 transition-colors ${
                  location.pathname === '/admin/users' ? 'text-green-600 font-medium' : ''
                }`}
              >
                Manage Users
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-green-500 text-white p-2 rounded-lg relative">
              <Shirt className="h-6 w-6" />
              <Leaf className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ReWear</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/listings" className="text-gray-700 hover:text-green-600 transition-colors">
              Browse Items
            </Link>
            {isAuthenticated && (
              <Link to="/add-item" className="text-gray-700 hover:text-green-600 transition-colors">
                List Item
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">{user?.username}</span>
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {user?.points}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Dashboard</span>
                          </div>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}