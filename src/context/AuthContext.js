import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'; 

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const token=Cookies.get('token');
  console.log(token);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('https://backend-1-sval.onrender.com/api/users/current_user', {
        headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
      });
      console.log(response);
      if (response.data) {
        console.log(response.data.user);
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoadingAuth(false);
  };
  const logout = () => {
    axios
      .post(
        'https://backend-1-sval.onrender.com/api/users/logout',
        { headers: {
          'Authorization': `Bearer ${token}`,
        },},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove('token');
        toast.success('Logged out successfully!');
      })
      .catch((error) => {
        console.error('Error during logout:', error);
        toast.error('Failed to logout. Please try again.');
      });
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout,loadingAuth,fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};