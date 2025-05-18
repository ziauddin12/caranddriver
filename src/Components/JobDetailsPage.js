import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import API from '../Components/services/api';
import { useNavigate, useParams } from 'react-router-dom';
import DriverNavbar from "./DriverNavbar";
import IMAGE_API from '../Components/services/ImgBase';
import Footer from "./Footer"; 

const JobDetailsPage = () => {
    const [job, setJob] = useState(null);
    const navigate = useNavigate();
    const { jobId } = useParams();

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await API.get(`/jobs/details/${jobId}`);
                if (response.status === 200) {
                    setJob(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch job details:', error);
            }
        };

        fetchJobDetails();
    }, [userId, jobId]);

    if (!job) return <Typography>Loading job details...</Typography>;

    // Filter out any empty items from the job details
    const jobDetails = [
        { label: 'Start', value: new Date(job.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) },
        { label: 'End', value: new Date(job.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) },
        { label: 'Shift', value: job.shift },
        { label: 'Days', value: ((new Date(job.endDate) - new Date(job.startDate)) / (1000 * 60 * 60 * 24)).toFixed(0) },
        { label: 'Pay', value: `${job.pay} ${job?.currency}` },
        { label: 'Vehicle Type', value: job?.user?.vehicleType },
        { label: 'Transmission', value: job?.user?.transmission },
        { label: 'Air Condition', value: job?.user?.airCondition },
        { label: 'Insurance', value: job?.user?.insurance },
        { label: 'Color', value: job?.user?.color },
        { label: 'Vehicle plate', value: job?.user?.vehicleplate },
        { 
            label: 'Location', 
            value: [job?.area, job?.city, job?.country].filter(Boolean).join(', ') // Corrected concatenation
        },
        { label: 'Ratings', value: job?.user?.ratings },
    ].filter(detail => detail.value); // Remove empty values

    return (
        <>
            <DriverNavbar />
            <Container maxWidth="lg" sx={{
                 minHeight: {
                    xs: '70vh', // 60% of the viewport height on mobile
                    sm: '80vh', // Keep 70vh on small screens and up
                  },
                maxHeight: {
                    xs: '85vh', // For mobile (extra small screens), set maxHeight to 100%
                   // sm: '80vh', // For small screens and up, set maxHeight to 80vh
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
                    sm: '30px', // For small screens and up, no bottom padding
                },
                paddingTop: {
                    xs: '20px', // For mobile, set paddingBottom to 20px
                    sm: '30PX', // For small screens and up, no bottom padding 
                }
            }}>
                <Card sx={{ backgroundColor: '#f7f7f7' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            {job?.user?.profileImage && (
                                <Grid item xs={12} sm={6} md={5} sx={{  mb: 0 }}>
                                    <img
                                        src={`${IMAGE_API}${job?.user?.profileImage}`}
                                        alt={job.serviceType}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6} md={7} sx={{  mb: 0 }}>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h4" sx={{ color: '#333', mb: 1, fontSize:'18px' }} gutterBottom>Job Details</Typography>
                                    <Typography variant="h5" sx={{ color: '#333', mb: 1, fontSize:'45px' }}>{job.serviceType}</Typography>

                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        {jobDetails.map((detail, index) => (
                                            <Grid item xs={6} sm={4} key={index}>
                                                <Typography sx={{ backgroundColor: '#fff', p: 1, borderRadius: '5px', textAlign: 'center',  border:"1px solid #ddd"  }}>
                                                   <strong>  {detail.label} </strong><br /> {detail.value}
                                                </Typography>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
            <Footer/>
        </>
    );
};

export default JobDetailsPage;
