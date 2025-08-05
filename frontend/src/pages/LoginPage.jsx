import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/jobs');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white shadow-lg rounded-2xl p-8 sm:p-10 w-full max-w-md transition-all">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Welcome Back 👋</h2>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              College Email
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              autoComplete="email"
              placeholder="you@college.edu"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                {...register('password', {
                  required: 'Password is required'
                })}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition sm:text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          By signing in, you agree to our{' '}
          <span className="underline">Terms of Service</span> and{' '}
          <span className="underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
