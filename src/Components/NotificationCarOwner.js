import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Avatar, Modal, TextField, IconButton, Checkbox,
   Dialog, DialogActions, DialogContent, DialogTitle,
 } from '@mui/material';
import API from '../Components/services/api';  // Assuming you have an API service to handle requests
import { Link } from 'react-router-dom';  // If you want to link to detailed job offer pages
import CarNavbar from "./CarNavbar";
import IMAGE_API from '../Components/services/ImgBase';
import { CiStar } from "react-icons/ci";
import { Close } from '@mui/icons-material'; 
import Footer from "./Footer"; 
import { useTranslation } from "react-i18next";

const NotificationCarOwner = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Added state for error message

  const [openModal, setOpenModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
   
  
  const userId = localStorage.getItem("userId");

  const [openDialog, setOpenDialog] = useState(false);

   const { t, i18n } = useTranslation(); // Hook for translation

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await API.get(`/proposals/get/${userId}`);

        if (response.data.message) {
          setErrorMessage(response.data.message);
          setOffers([]);
        } else {
          setOffers(response.data.offers);
        }
      } catch (error) {
       // console.error('Error fetching job offers:', error);
        setErrorMessage('No offers found for this user');
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [userId]);

  const handleOpenModal = (offer) => {
     
    setSelectedOffer(offer); 
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOffer(null); 
  };

  const handleOpenDialog = (offer) => {
      setSelectedOffer(offer);
      setOpenDialog(true);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
  
    
    const handleReject = async (offer) => {
      console.log(offer);
      try {
        const response = await API.put(`/proposals/status/${offer?.userId?._id}/${offer.jobId?._id}`);
        if (response.status === 200) {
          setOffers(offers.filter((item) => item.jobId?._id !== offer.jobId?._id));
        }
      } catch (error) {
        console.error('Failed to reject job:', error);
      }
    };
  
    const JobRejectConfirmation = ({ open, onClose, onReject, offer, userId }) => {
      return (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Confirm Rejection</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to reject this job offer?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onReject(offer);
                onClose();
              }}
              color="secondary"
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      );
    };

  
  const renderOffers = () => {
    if (errorMessage) {
      return (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" align="center" color="textSecondary">
            {errorMessage}
          </Typography>
        </Box>
      );
    }

    return offers.map((offer) => (
      <Box key={offer._id} sx={{ boxShadow: 3, borderRadius: 2, p: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'orange', fontWeight: 'bold' }}>{offer.userId?.serviceType[0]}</Typography>
          <Typography variant="body1">{offer.userId?.experience} years</Typography>
          <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => handleOpenDialog(offer)}>✕</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: '500', fontSize: '18px' }}>{offer.userId?.firstName} {offer.userId?.lastName}</Typography>
          <Typography variant="body1" sx={{ fontWeight: '500', ml: 2 }}>MALE</Typography>
          <Typography variant="body1" sx={{ ml: 2 }}>
                {offer.userId?.dateOfBirth
                     ? `${new Date().getFullYear() - new Date(offer.userId.dateOfBirth).getFullYear()} years`
             : 'N/A'}
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'block', justifyContent: 'center', mt: 1 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0, p: 0, fontWeight: '500',  color:'#000' }}>
             <Checkbox sx={{  p: 0, color:'#000' }} checked={!!offer.userId?.uploadCriminalRecord} disabled /> Criminal record  
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 0, p: 0, fontWeight: '500',  color:'#000' }}>
             <Checkbox sx={{  p: 0, color:'#000' }} checked={!!offer.userId?.uploadDrugTest} disabled /> Drug Tested
        </Typography>
         
        </Box>
        <Box sx={{ display: 'block', justifyContent: 'center', mt: 2 }}>
          <Avatar src={offer.userId?.profileImage ? `${IMAGE_API}${offer.userId?.profileImage}` : IMAGE_API} alt="Car Image" sx={{ width: 56, height: 56 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {[...Array(5)].map((_, index) => (
            <CiStar />
          ))}
        </Box>
        </Box>
 
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'back', fontWeight: '500' }}>{offer.jobId?.jobTitle}</Typography>
          <Typography variant="body1"> {offer?.pay} EGP </Typography> 
        </Box>

       
        

        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
        <Button variant="outlined" onClick={() => handleOpenModal(offer)}>Accept</Button>
          <Link to={`/profile-details/${offer.userId?._id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained">Details</Button>
          </Link>
        </Box>
      </Box>
    ));
  };

  return (
    <>
      <CarNavbar />
      <Container maxWidth="lg" sx={{
        minHeight: {
          xs: '60vh', // 60% of the viewport height on mobile
          sm: '70vh', // Keep 70vh on small screens and up
        },
        maxHeight: '80vh',
        overflowY: 'scroll',
        '&:hover': { overflowY: 'scroll' },
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        backgroundColor: {
          xs: '#fff', // For mobile, set paddingBottom to 20px
          sm: 'transparent', // For small screens and up, no bottom padding 
        },
        '@media (max-width: 600px)': {
          height: '100vh',
        },
      }}>
        <Box sx={{ padding: 2 }}>
          {loading && <Typography align="center">Loading...</Typography>}
          {errorMessage ? (
            <Typography
            align="center"
            sx={{
              color: { xs: 'textSecondary', md: 'white' } // White on desktop, textSecondary on mobile
            }}
          >{errorMessage}</Typography>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
              gap={3}
            >
              {renderOffers()}
            </Box>
          )}
        </Box>
      </Container>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs : '80%',
            sm: '40%',
          },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Payment function <br/>3rd milestone task</Typography>
            <IconButton onClick={handleCloseModal}><Close /></IconButton>
          </Box>
           
        </Box>
      </Modal>

      <JobRejectConfirmation
        open={openDialog}
        onClose={handleCloseDialog}
        onReject={handleReject}
        offer={selectedOffer}
        userId={userId}
      />
      
      <Footer/>
       
    </>
  );
};

export default NotificationCarOwner;