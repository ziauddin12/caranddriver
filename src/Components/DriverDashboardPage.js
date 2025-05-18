import React, { useEffect, useState, useRef } from 'react';
import { Container, CircularProgress, Typography, Box, Button, Card, CardContent, Tabs, Tab,
    Dialog, DialogActions, DialogContent, DialogTitle
 } from '@mui/material';
import API from '../Components/services/api';
import { useNavigate, Link } from 'react-router-dom';
import DriverNavbar from "./DriverNavbar";
import IMAGE_API from '../Components/services/ImgBase';
import DriverFooter from "./DriverFooter";
import AvailableJobs from "./AvailableJobs";
import PendingJobs from "./PendingJobs";


const DriverDashboardPage = () => {
    const [jobs, setJobs] = useState({ new: [], ending: [], completed: [], canceled: [] });
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [profileDialogOpen, setProfileDialogOpen] = useState(false);

    const tabsRef = useRef(null);

    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                if (!userId) {
                    navigate("/login");
                    return;
                }
                const response = await API.get(`/users/${userId}`);
                const profileData = response.data;
                const requiredFields = ["experience", "dateOfBirth", "licenseNumber", "city", "uploadID", "uploadLicense"];
                const missingFields = requiredFields.filter(field => !profileData[field]);
                if (missingFields.length > 0) {
                    setProfileDialogOpen(true);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                navigate("/driver-profile");
            }
        };
        checkUserProfile();
    }, [navigate, userId]);

    useEffect(() => {
        if (tabsRef.current) {
            if (tabIndex === 3) {
                tabsRef.current.scrollLeft = tabsRef.current.scrollWidth;
            } else if (tabIndex === 1) {
                tabsRef.current.scrollLeft = 0;
            }
        }
    }, [tabIndex]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const responses = await Promise.all([
                    API.get(`/jobs/ending/${userId}`),
                    API.get(`/jobs/completed/${userId}`),
                    API.get(`/jobs/canceled/${userId}`),
                ]);
                setJobs({
                    new: [], // Placeholder since AvailableJobs component will handle new jobs
                    ending: responses[0].data,
                    completed: responses[1].data,
                    canceled: responses[2].data,
                });
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [userId]);

    
    

    const renderJobs = (category) => (
        jobs[category].length > 0 ? (
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={3}>
                {jobs[category].map((job) => (
                    <Card key={job._id} sx={{ backgroundColor: '#4caf50', color: '#fff' }}>
                        <CardContent>
                            {job.carimage && (
                                <img src={`${IMAGE_API}${job.carimage}`} alt={job.jobTitle} style={{ width: '100%', maxHeight: '230px', borderRadius: '5px' }} />
                            )}
                            <Typography variant="h6" sx={{ mt: 2 }}>{job.jobTitle}</Typography>
                            <Typography variant="body2">Date: {new Date(job.endDate).toLocaleDateString()}</Typography>
                            <Typography variant="body2">Pay: {job.pay} {job?.currency}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        ) : (
            <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', color: '#555', mt: 4 }}>
                No jobs found.
            </Typography>
        )
    );

    //const footerPosition = "absolute";

    return (
        <>
         <div className="min-h-screen flex flex-col justify-between">
            <DriverNavbar />
            <Container maxWidth="lg" sx={{
                                 minHeight: {
                                    xs: '75vh', // 60% of the viewport height on mobile
                                    sm: '60vh', // Keep 70vh on small screens and up
                                  },
                             maxHeight: {
                                xs: '75vh', // For mobile (extra small screens), set maxHeight to 100%
                                sm: '100%', // For small screens and up, set maxHeight to 80vh
                              },
                            backgroundColor: {
                                xs: '#fff', // For mobile, set background color to white
                                sm: 'transparent', // For small screens and up, use transparent (or any other color you prefer)
                              },
                            overflowY: 'scroll',
                            '&:hover': {
                              overflowY: 'scroll',
                            },
                            '&::-webkit-scrollbar': {
                              display: 'none',
                            },
                            scrollbarWidth: 'none',
                            paddingBottom: {
                                xs: '20px', // For mobile, set paddingBottom to 20px
                                sm: '0', // For small screens and up, no bottom padding
                              },
                        }}>

              <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', borderBottom:"2px solid #ddd" }}>
                <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}   variant="scrollable" 
                        scrollButtons="auto">
                    <Tab label="New" />
                    <Tab label="Pending" />
                    <Tab label="Completed" />
                    <Tab label="Canceled" />
                </Tabs>
                </Box>
                {loading ? (
                    <Box ref={tabsRef} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <>
                        {tabIndex === 0 && <AvailableJobs />}
                        {tabIndex === 1 && <PendingJobs/>}
                        {tabIndex === 2 && renderJobs("completed")}
                        {tabIndex === 3 && renderJobs("canceled")}
                    </>
                )}
            </Container>
            <Dialog open={profileDialogOpen}>
                <DialogTitle>Profile Incomplete</DialogTitle>
                <DialogContent>
                    <Typography>Please complete your profile before proceeding.</Typography>
                    <Link to="/driver-profile"  style={{ color: "#6698f7" }}>Go to Profile</Link>
                </DialogContent>
            </Dialog>

            <DriverFooter/>

            </div>
        </>
    );
};

export default DriverDashboardPage;