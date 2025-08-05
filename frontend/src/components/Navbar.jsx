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
    <nav className="bg-gradient-to-r from-slate-900 to-neutral-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/jobs" className="text-white text-2xl font-semibold tracking-wide">
            Elevate Box Job Portal
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/jobs"
                  className="text-gray-200 hover:text-white transition"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/create-job"
                  className="text-gray-200 hover:text-white transition"
                >
                  Post Job
                </Link>
                <Link
                  to="/my-jobs"
                  className="text-gray-200 hover:text-white transition"
                >
                  Posted by Me
                </Link>
                <Link
                  to="/my-applications"
                  className="text-gray-200 hover:text-white transition"
                >
                  My Applications
                </Link>

                {/* Profile + Logout */}
                <div className="flex items-center gap-3 ml-4">
                  <Link to="/profile" className="flex items-center gap-2 text-gray-200 hover:text-white transition">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="hidden md:flex flex-col leading-tight">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-gray-400">
                        ({user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)})
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-900 transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
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
