import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on mount
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      setToken(response.data.token);
      setUser(response.data);
      localStorage.setItem('token', response.data.token);
      return { success: true };
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('ECONNREFUSED')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please make sure the backend server is running on port 5000.',
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      setToken(response.data.token);
      setUser(response.data);
      localStorage.setItem('token', response.data.token);
      return { success: true };
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('ECONNREFUSED')) {
        return {
          success: false,
          message: 'Cannot connect to server. Please make sure the backend server is running on port 5000.',
        };
      }
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateTheme = async (theme) => {
    try {
      const response = await axios.put(`${API_URL}/auth/theme`, { theme });
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update theme',
      };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateTheme,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

