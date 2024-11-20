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


  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('https://backend-1-sval.onrender.com/api/users/current_user', {
       
          withCredentials: true,
      });
     
      if (response.data) {
      
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
        {}, // Empty body if not required
        {
          withCredentials: true, // Correct: Passed as config
        }
      )
      .then(() => {
        setUser(null);
        setIsAuthenticated(false);
        Cookies.remove('token'); // May not work as expected (see next section)
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