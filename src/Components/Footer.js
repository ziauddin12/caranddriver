import React from 'react';
import { Box, Typography } from '@mui/material';
import { GoHome } from "react-icons/go";
import { TfiEmail } from "react-icons/tfi";
import { GoBell } from "react-icons/go";
import { TfiWallet } from "react-icons/tfi";
import { CiUser } from "react-icons/ci";
import { useTranslation } from 'react-i18next'; // Assuming translation is used
import { useLocation } from 'react-router-dom'; // Hook to get current path

const Footer = ({ stepstle }) => {
  const { t } = useTranslation(); // For translation if needed
  const location = useLocation(); // Get the current path

  // Function to check if the current page is active
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Black Bar for Web View */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' }, // Hide on mobile, show on desktop
          position: stepstle || 'relative', // Fixed at the bottom
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
        <a href="/dashboard" className={`text-center ${isActive('/dashboard') ? 'text-blue-500' : ''}`}>
          <GoHome />
        </a>
        <a href="/email" className={`text-center ${isActive('/email') ? 'text-blue-500' : ''}`}>
          <TfiEmail />
        </a>
        <a href="/carowner-notifiction" className={`text-center ${isActive('/carowner-notifiction') ? 'text-blue-500' : ''}`}>
          <GoBell />
        </a>
        <a href="/wallet" className={`text-center ${isActive('/wallet') ? 'text-blue-500' : ''}`}>
          <TfiWallet />
        </a>
        <a href="/carowner-profile" className={`text-center ${isActive('/carowner-profile') ? 'text-blue-500' : ''}`}>
          <CiUser />
        </a>
      </div>
    </div>
  );
};

export default Footer;