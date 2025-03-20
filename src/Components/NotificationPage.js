import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Avatar, Modal, TextField, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle,
 } from '@mui/material';
import API from '../Components/services/api';  // Assuming you have an API service to handle requests
import { Link } from 'react-router-dom';  // If you want to link to detailed job offer pages
import DriverNavbar from "./DriverNavbar";
import IMAGE_API from '../Components/services/ImgBase';
import { CiStar } from "react-icons/ci";
import { Close } from '@mui/icons-material';
import DriverFooter from "./DriverFooter";
import { useNavigate } from 'react-router-dom';



const NotificationPage = () => {
  const navigate = useNavigate(); // Get navigate function
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkUserProfile = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                navigate("/login"); // Redirect if user is not logged in
                return;
            }

            const response = await API.get(`/users/${userId}`);
            const profileData = response.data;

            // Define required fields
            const requiredFields = ["experience", "dateOfBirth", "licenseNumber", "city", "uploadID", "uploadLicense"]; // Adjust as needed
            const missingFields = requiredFields.filter(field => !profileData[field]);

            if (missingFields.length > 0) {
                navigate("/driver-profile"); // Redirect to profile edit page if any field is empty
            } else {
                setIsLoading(false); // Allow form to render if profile is complete
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            navigate("/driver-profile"); // Redirect on error
        }
    };

    checkUserProfile();
}, [navigate]);

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
            alignItems: 'center',
            height: '90vh',  // Full viewport height
            width: '100%'
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
          <Typography variant="h6" sx={{ color: 'orange', fontWeight: 'bold' }}>{offer.jobId?.serviceType}</Typography>
          <Typography variant="body1">{offer.jobId?.pay} {offer.jobId?.currency} {offer.jobId?.shift}</Typography>
          <Typography variant="body1" sx={{ cursor: 'pointer' }} onClick={() => handleOpenDialog(offer)}>✕</Typography>
        </Box>

       <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{offer.jobId?.area}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', ml: 2 }}>{offer.jobId?.city}</Typography>
                  <Typography variant="body1" sx={{ ml: 2 }}>{offer.jobId?.country}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'block', justifyContent: 'center', mt: 2 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          {offer.jobId?.shift} for {(new Date(offer.jobId?.endDate) - new Date(offer.jobId?.startDate)) / (1000 * 60 * 60 * 24)} days
        </Typography>
        <Typography variant="body2" color="textSecondary">From {new Date(offer.jobId?.startDate).toLocaleDateString('en-GB')}</Typography>
        <Typography variant="body2" color="textSecondary">To {new Date(offer.jobId?.endDate).toLocaleDateString('en-GB')}</Typography>
        <Typography variant="body2" color="textSecondary">{offer.jobId?.location}</Typography>
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
          <Link to={`/job/${offer.jobId?._id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained">Details</Button>
          </Link>
        </Box>
      </Box>
    ));
  };

  return (
    <>
      <DriverNavbar />
      <Container maxWidth="lg" sx={{
        minHeight: {
          xs: '78vh', // 60% of the viewport height on mobile
          sm: '70vh', // Keep 70vh on small screens and up
        },
        maxHeight: {
          xs: '78vh', // For mobile (extra small screens), set maxHeight to 100%
          sm: '70vh', // For small screens and up, set maxHeight to 80vh
        },
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
            <Box  sx={{
              display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             height: '50vh',  // Full viewport height
             width: '100%'
         }}
       >
            <Typography
            align="center"
            sx={{
              color: { xs: 'textSecondary', md: 'white' } // White on desktop, textSecondary on mobile
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

      <DriverFooter stepstle={'absolute'}/>

    </>
  );
};

export default NotificationPage;