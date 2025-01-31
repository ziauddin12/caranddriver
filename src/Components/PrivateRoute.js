import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../Components/services/api';

const PrivateRoute = ({ element, ...rest }) => {
  const isLoggedIn = !!localStorage.getItem('authToken'); // Check for auth token

  useEffect(() => {
    // Function to check if the authToken is expired
    const checkTokenExpiry = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Send a request to the backend to validate the token
          const response = await API.get('/users/validate-token', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status !== 200) {
            throw new Error('Token expired');
          }
        } catch (error) {
          // If token is expired or request fails, clear the localStorage and redirect to login
          localStorage.clear();
          window.location.href = '/login'; // Redirect to login page
        }
      } else {
        // If no token is found, clear localStorage and redirect to login
        localStorage.clear();
        window.location.href = '/login';
      }
    };

    // Check token every hour (60 minutes * 60 seconds * 1000 milliseconds)
    const intervalId = setInterval(checkTokenExpiry, 60 * 60 * 1000);
    
    // Run the check immediately on component mount
    checkTokenExpiry();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;