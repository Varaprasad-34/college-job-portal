import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/jobs" className="text-white text-xl font-bold">
            Elevate Box Job Portal
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/jobs"
                  className="text-white hover:text-blue-200 transition duration-200"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/create-job"
                  className="text-white hover:text-blue-200 transition duration-200"
                >
                  Post Job
                </Link>
                <Link
                  to="/my-jobs"
                  className="text-white hover:text-blue-200 transition duration-200"
                >
                  Posted by Me
                </Link>
                <Link
                  to="/my-applications"
                  className="text-white hover:text-blue-200 transition duration-200"
                >
                  My Applications
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/profile"
                      className="text-white hover:text-white-200 transition duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <span className="hidden md:block">{user?.name}</span>
                        <span className="hidden md:block text-white-600 text-sm">
                          ({user?.role.charAt(0).toUpperCase() + user?.role.slice(1)})
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 bg-gray-700 text-white flex justify-center items-center rounded-md hover:bg-gray-900 transition duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
