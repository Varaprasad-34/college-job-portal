import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // ✅ Set Axios Authorization header when token is set
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // ✅ Load user ONLY after initial mount if token exists
  useEffect(() => {
    const autoLogin = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Load user error:', error);
        logout(); // auto-logout on bad token
      } finally {
        setLoading(false);
      }
    };

    autoLogin();
  }, []); // ✅ Empty deps = only run once on mount

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      // ✅ Set token in localStorage and state
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);

      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);

      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/auth/profile', profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
