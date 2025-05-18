import React, { useState, useEffect } from 'react';
import {  Box, Typography, Button, Avatar, Modal, TextField, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle,
 } from '@mui/material';
import API from '../Components/services/api';  // Assuming you have an API service to handle requests
import { Link } from 'react-router-dom';  // If you want to link to detailed job offer pages 
import IMAGE_API from '../Components/services/ImgBase';
import { CiStar } from "react-icons/ci";
import { Close } from '@mui/icons-material'; 



const AvailableJobs = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Added state for error message

  const [openDialog, setOpenDialog] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [pay, setPay] = useState('');

  const [formError, setFormError] = useState('');
  
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const response = await API.get(`/offers/get/${userId}`);

        if (response.data.message) {
          setErrorMessage(response.data.message);
          setOffers([]);
        } else {
          setOffers(response.data.offers);
        }
      } catch (error) {
       // console.error('Error fetching job offers:', error);
        setErrorMessage('Oops! It looks like there are no offers available for you right now. Please check back later.');
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [userId]);

  const handleOpenModal = (offer) => {
    setFormError("");
    setSelectedOffer(offer);
    setPay(offer.jobId?.pay || '');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOffer(null);
    setPay('');
  };

  const handleOpenDialog = (offer) => {
    setSelectedOffer(offer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  
  const handleReject = async (offer) => {
    try {
      const response = await API.put(`/offers/modify/${userId}/${offer.jobId?._id}`);
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
          <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#fe8735', '&:hover': { backgroundColor: '#fe8735' } }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onReject(offer);
              onClose();
            }}
            variant="contained"
            sx={{ backgroundColor: '#8cc63e', '&:hover': { backgroundColor: '#77b834' } }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleSubmitProposal = async () => {
    if (!pay || parseFloat(pay) <= 0) {
      setFormError('Amount must be greater than 0');
      return;
    }

    try {
      const jobuserId = selectedOffer.jobId?.user?._id;
      const response = await API.post(`/proposals/send/${selectedOffer.jobId?._id}`, { pay, userId, jobuserId });
      //alert(response.data.message);
      setFormError(response.data.message);
      setOffers(offers.filter((offer) => offer.jobId?._id !== selectedOffer.jobId?._id));
      handleCloseModal();
    } catch (error) {
      console.error('Error sending proposal:', error);
      setFormError('Failed to send proposal');
    }
  };
  const renderOffers = () => {
    if (errorMessage) {
      return (
        <Box  sx={{
             display: 'flex',
            justifyContent: 'center',
            width: '100%',
        }}
      >
       <Typography variant="h6" align="center" color="textSecondary">
          {errorMessage}
        </Typography>
      </Box>
      );
    }

    return offers.map((offer) => (
      <Box key={offer._id} sx={{ boxShadow: 3, borderRadius: 2, p: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'orange' }}><strong>{offer.jobId?.serviceType}</strong></Typography>
           <Typography variant="h6"><strong>{offer.jobId?.pay} {offer.jobId?.currency}</strong></Typography>
          <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => handleOpenDialog(offer)}>✕</Typography>
        </Box>

        
          
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                 
                  <Typography variant="h6"><strong>{offer.jobId?.user?.modelYear}</strong></Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'block', justifyContent: 'center', mt: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {offer.jobId?.shift} for {(new Date(offer.jobId?.endDate) - new Date(offer.jobId?.startDate)) / (1000 * 60 * 60 * 24)} days
        </Typography>
        <Typography variant="body2" color="textSecondary">From {new Date(offer.jobId?.startDate).toLocaleDateString('en-GB')}</Typography>
        <Typography variant="body2" color="textSecondary">To {new Date(offer.jobId?.endDate).toLocaleDateString('en-GB')}</Typography>
       
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography variant="body1" color="textSecondary"><strong>{offer.jobId?.country}</strong></Typography>
        <Typography variant="body1" sx={{  ml: 2 }} color="textSecondary"><strong>{offer.jobId?.area}</strong></Typography>
        <Typography variant="body1" sx={{  ml: 2 }} color="textSecondary"><strong>{offer.jobId?.city}</strong></Typography>
        </Box>

        </Box>
        <Box sx={{ display: 'block', justifyContent: 'center', mt: 2 }}>
          <Avatar src={offer.jobId?.user?.profileImage ? `${IMAGE_API}${offer.jobId?.user?.profileImage}` : IMAGE_API} alt="Car Image" sx={{ width: 56, height: 56 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {[...Array(5)].map((_, index) => (
            <CiStar />
          ))}
        </Box>
        </Box>
        </Box>

       
        

        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
        <Button variant="outlined" onClick={() => handleOpenModal(offer)}>Modify</Button>
          <Link to={`/view-profile/${offer.jobId?.user?._id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained">Details</Button>
          </Link>
        </Box>
      </Box>
    ));
  };

  return (
    <> 
       
        <Box sx={{ padding: 2 }}>
          {loading && <Typography align="center">Loading...</Typography>}
          {errorMessage ? (
            <Box  sx={{
              display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             width: '100%',
            minHeight: "65vh"
         }}
       >
            <Typography
            align="center"
            sx={{
              color: { xs: 'textSecondary', md: '#000' } // White on desktop, textSecondary on mobile
            }}
          >{errorMessage}</Typography>
           </Box>
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
            <Typography variant="h6">{selectedOffer?.jobId?.serviceType} - Modify Pay</Typography>
            <IconButton onClick={handleCloseModal}><Close /></IconButton>
          </Box>
          <TextField
            fullWidth
            label="Pay"
            type="number"
            value={pay}
            onChange={(e) => setPay(e.target.value)}
            sx={{ mb: 2 }}
          />
           {formError && <Typography color="error" sx={{ mb: 2 }}>{formError}</Typography>}
          <Button variant="contained" onClick={handleSubmitProposal} fullWidth>
            Submit Proposal
          </Button>
        </Box>
      </Modal>
       {/* Reject confirmation dialog */}
       <JobRejectConfirmation
        open={openDialog}
        onClose={handleCloseDialog}
        onReject={handleReject}
        offer={selectedOffer}
        userId={userId}
      />
 

    </>
  );
};

export default AvailableJobs;