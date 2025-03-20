import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Typography, Box, Card, CardContent } from '@mui/material';
import API from '../Components/services/api';
import { useNavigate } from 'react-router-dom';
import DriverNavbar from "./DriverNavbar";
import IMAGE_API from '../Components/services/ImgBase';
import DriverFooter from "./DriverFooter";
import AvailableJobs from "./AvailableJobs";


const DriverDashboardPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate(); // Get navigate function
      const [isLoading, setIsLoading] = useState(true);
      useEffect(() => {
        const checkUserProfile = async () => {
            try {
              //  const userIdNew = localStorage.getItem("userId");
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
    }, [navigate, userId]);

    useEffect(() => {
        const fetchCompletedJobs = async () => {
            try {
                const response = await API.get(`/jobs/completed/${userId}`);
                if (response.status === 200) {
                    setJobs(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch completed jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCompletedJobs();
    }, [userId]);

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
                <Typography variant="h4" sx={{ textAlign: 'center', width: '100%', color: '#555', mt: 4 }} gutterBottom textAlign="center">Completed Jobs</Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress color="primary" />
                    </Box>
                ) : jobs.length > 0 ? (
                    <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={3}>
                        {jobs.map((job) => (
                            <Card key={job._id} sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
                                <CardContent>
                                    {job.carimage && (
                                        <img
                                            src={`${IMAGE_API}${job.carimage}`}
                                            alt={job.jobTitle}
                                            style={{ width: '100%', maxHeight: '230px', borderRadius: '5px' }}
                                        />
                                    )}
                                    <Typography variant="h6" sx={{ mt: 2 }}>{job.jobTitle}</Typography>
                                    <Typography variant="body2">Completed on: {new Date(job.endDate).toLocaleDateString()}</Typography>
                                    <Typography variant="body2">Pay: {job.pay} EGP</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', color: '#555', mt: 4 }}>
                        No completed jobs yet.
                    </Typography>
                )}

             
                <Typography variant="h4" sx={{ textAlign: 'center', width: '100%', color: { xs: '#555', md: 'white' }, mt: 4 }} gutterBottom textAlign="center">Jobs available</Typography>
                <AvailableJobs/>
            </Container>

           

            <DriverFooter />
        </>
    );
};

export default DriverDashboardPage;