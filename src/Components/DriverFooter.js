import React, { useEffect, useState } from 'react';
import { Box, Typography, Badge } from '@mui/material';
import { GoHome } from "react-icons/go";
import { TfiEmail } from "react-icons/tfi";
import { GoBell } from "react-icons/go";
import { TfiWallet } from "react-icons/tfi";
import { CiUser } from "react-icons/ci";
import { useTranslation } from 'react-i18next'; // Assuming translation is used
import { useLocation } from 'react-router-dom'; // Hook to get current path

const DriverFooter = ({ stepstle }) => {
  const { t } = useTranslation(); // For translation if needed
  const location = useLocation(); // Get the current path
  const [newNotifications, setNewNotifications] = useState(0); // Track new notifications

  const baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://drivewill.com/api';
  // Function to check if the current page is active
  //console.log(location.pathname);
  const isActive = (path) => location.pathname === path;

  // Establish SSE connection and listen for new job notifications
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const eventSource = new EventSource(`${baseURL}/jobs/sse/${userId}`, {
      withCredentials: true // If you’re using cookies
    });
  
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received job notification:', data.message);
      setNewNotifications(prev => prev + 1);
    };
  
    eventSource.onerror = (error) => {
      console.error('Error in SSE connection:', error);
      eventSource.close();
    };

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };
  
    return () => {
      eventSource.close();
    };
  }, [baseURL]);
  

  return (
    <div>
      {/* Black Bar for Web View */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' }, // Hide on mobile, show on desktop
          position: stepstle || 'relative', // Use passed 'stepstle' prop, default to 'relative'
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'black',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          py: 1,
          textTransform: 'uppercase',
        }}
      >
        <Typography variant="body1" sx={{ fontSize: '16px' }}>
          {t("rightsReserved")}
        </Typography>
      </Box>

      {/* Footer Menu for Mobile View */}
      <div className="flex justify-around text-3xl lg:hidden text-[#5a3623] mt-4">
        <a href="/myaccount" className={`text-center ${isActive('/myaccount') ? 'text-blue-500' : ''}`}>
          <GoHome />
        </a>
        <a href="/email" className={`text-center ${isActive('/email') ? 'text-blue-500' : ''}`}>
          <TfiEmail />
        </a>
        <a href="/notification" className={`text-center ${isActive('/notification') ? 'text-blue-500' : ''}`}>
          {/* Bell Icon with Notification Counter */}
          <Badge
            badgeContent={newNotifications} // Show the counter if there are new notifications
            color="error"
            invisible={newNotifications === 0} // Only show the badge if there are new notifications
          >
            <GoBell />
          </Badge>
        </a>
        <a href="/wallet" className={`text-center ${isActive('/wallet') ? 'text-blue-500' : ''}`}>
          <TfiWallet />
        </a>
        <a href="/driver-profile" className={`text-center ${isActive('/driver-profile') ? 'text-blue-500' : ''}`}>
          <CiUser />
        </a>
      </div>
    </div>
  );
};

export default DriverFooter;
