import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, DialogContentText, Typography, Box, Card, CardContent, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import API from '../Components/services/api';
import { useNavigate } from 'react-router-dom';
import CarNavbar from "./CarNavbar";
import IMAGE_API from '../Components/services/ImgBase';
import Footer from "./Footer"; 
import { FaTimes  } from "react-icons/fa";
import { FaEdit  } from "react-icons/fa";


const DashboardPage = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loadingJobId, setLoadingJobId] = useState(null);
    const [loading, setLoading] = useState(true); // New loading state

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await API.get(`/jobs/get/${userId}`);
                
                if (response.status === 200) {
                    setJobs(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setLoading(false); // Stop loading after fetching
            }
        };

        fetchJobs();
    }, [userId]);

    const handleEdit = (jobId) => {
        navigate(`/edit-job/${jobId}`);
    };

    const handleFindDriver = (jobId) => {
      //  navigate(`/carowner-notifiction/${jobId}`);
      navigate(`/carowner-notifiction`);
    };

    

    const handlePublish = async (jobId) => {
        setLoadingJobId(jobId);
        try {
            const response = await API.put(`/jobs/publish/${userId}/${jobId}`, { status: 'posted' });
    
            if (response.status === 200) {
                setJobs((prevJobs) =>
                    prevJobs.map((job) =>
                        job._id === jobId ? { ...job, status: 'posted' } : job
                    )
                );
                setModalMessage('Job published successfully!');
                setOpenModal(true);
            }
        } catch (error) {
            console.error('Failed to publish job:', error);
            setModalMessage('Failed to publish job. Please try again.');
            setOpenModal(true);
        }  finally {
            setLoadingJobId(null);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalMessage('');
    };

    const handleCancel = (jobId) => {
        setSelectedJobId(jobId);
        setOpenDialog(true);
    };



    const confirmCancel  = async (jobId) => {
        try {
            const response = await API.delete(`/jobs/${userId}/${selectedJobId}`);
            if (response.status === 200) {
                setJobs(jobs.filter(job => job._id !== selectedJobId));
            }
        } catch (error) {
            console.error('Failed to cancel job:', error);
        } finally {
            setOpenDialog(false);
            setSelectedJobId(null);
        }
    };

    const handlePostNewJob = () => {
        navigate('/post-new-job'); // Add route for posting a new job
    };

    return (
        <>
        <div className="min-h-screen flex flex-col justify-between">
        <CarNavbar/>
        <Container maxWidth="lg" sx={{
             minHeight: {
                xs: '75vh', // 60% of the viewport height on mobile
                sm: '70vh', // Keep 70vh on small screens and up
              },
         maxHeight: {
            xs: '75vh', // For mobile (extra small screens), set maxHeight to 100%
           // sm: '70vh', // For small screens and up, set maxHeight to 80vh
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
    }}>

{jobs.length <= 0 && (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}> 
        <Typography variant="h4" gutterBottom sx={{ color: { xs: 'inherit', lg: '#333' } }}>
            
        </Typography>
        <Button
            variant="contained"
            className="!bg-orange-500 hover:!bg-orange-600 text-white"
            onClick={handlePostNewJob}
            sx={{ borderRadius: '15px', padding: '8px 20px' }}
        >
            Post a new job
        </Button>
    </Box>
)}
            <Typography
  variant="h4"
  gutterBottom
  sx={{
    color: { xs: 'inherit', lg: '#fff' }, // Inherit color on small screens, white on large screens
  }}
>

</Typography>
{loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress color="primary" />
    </Box>
  ) : jobs.length > 0 ? (
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={3}>
           
           {jobs.map((job) => (
                    <Card key={job._id} sx={{  backgroundColor: '#f7f7f7' }}>
                    <CardContent sx={{ p: 0 }}>
                    {job?.user?.profileImage && (
                <div style={{ position: 'relative' }}>
                    <img
                        src={`${IMAGE_API}${job?.user?.profileImage}`}
                        alt={job.serviceType}
                        style={{ width: '100%', height: 'auto', maxHeight: '230px', borderRadius: '0px' }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: job.status === 'posted' ? '#6698f7' : '#6698f7',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '5px',
                            fontWeight: 'normal',
                            letterSpacing: '0.15em',
                            textTransform: "uppercase",
                        }}
                        style={{ borderRadius: '15px', padding: '3px 10px' }}
                    >
                        {job.status}
                              </Typography>
                                    
                         </div>
                     )}
                        <Box sx={{ p: 2,  borderRadius: '8px' }}>

                            <Typography variant="h6" sx={{ textAlign: 'center', fontSize:'35px',  color: '#000', mb:2 }}><strong>{job.serviceType}</strong></Typography>
                
                            <Box display="flex" justifyContent="space-between" textAlign="center" gap={2}>
                                <Typography variant="body2" sx={{  backgroundColor: '#fff', p: 1, borderRadius: '5px',width: '50%', border:"1px solid #ddd" }}><strong> Start </strong>  <br/> {new Date(job.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                                <Typography variant="body2" sx={{  backgroundColor: '#fff', p: 1, borderRadius: '5px', width: '50%', border:"1px solid #ddd"  }} ><strong> End </strong> <br/> {new Date(job.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</Typography>
                            </Box>
                
                            <Box display="flex" justifyContent="space-between" gap={2} textAlign="center" sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{  backgroundColor: '#fff', p: 1, borderRadius: '5px', width: '33.33%', border:"1px solid #ddd"  }}><strong> Shift </strong>  <br/> {job.shift}</Typography>
                                <Typography variant="body2" sx={{  backgroundColor: '#fff', p: 1, borderRadius: '5px', width: '33.33%', border:"1px solid #ddd" }}><strong> Days </strong>  <br/> {Math.ceil((new Date(job.endDate) - new Date(job.startDate)) / (1000 * 60 * 60 * 24))}</Typography>
                                <Typography variant="body2" sx={{  backgroundColor: '#fff', p: 1, borderRadius: '5px', width: '33.33%', border:"1px solid #ddd"  }}><strong> Pay </strong>  <br/> {job.pay} {job.currency}</Typography>
                            </Box>

                            <Box display="flex" justifyContent="space-between" gap={2} textAlign="center" sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{  backgroundColor: '#fff', p: 1, borderRadius: '5px', width: '33.33%', border:"1px solid #ddd",  display: "flex",
      alignItems: "center", justifyContent: "center", textAlign: "center"  }}><strong>{job?.country}</strong></Typography>
                                <Typography variant="body2" sx={{  backgroundColor: '#fff', p: 1, borderRadius: '5px', width: '33.33%', border:"1px solid #ddd",  display: "flex",
      alignItems: "center", justifyContent: "center", textAlign: "center"  }}><strong>{job?.area}</strong></Typography>
                                <Typography variant="body2" sx={{  backgroundColor: '#fff', p: 1, borderRadius: '5px', width: '33.33%', border:"1px solid #ddd",  display: "flex",
      alignItems: "center", justifyContent: "center", textAlign: "center" }}><strong>{job?.city} </strong></Typography>
                                
                            </Box>
                        </Box>
                    </CardContent>
                    <CardActions style={{ display: 'flex', justifyContent: 'center' }}>  
                         
                    <Button
  size="large"
  variant="contained"
  className="!bg-[#fe8735] hover:!bg-orange-600 text-white flex items-center justify-center"
  style={{ borderRadius: '15px', padding: '8px 16px' }}
  onClick={() => handleEdit(job._id)}
>
  <FaEdit
    style={{
      fontSize: '20px',
      color: '#fff',
    }}
  />
</Button>

<Button
  size="large"
  variant="contained"
  className="!bg-[#8cc63e] hover:!bg-orange-600 text-white flex items-center justify-center"
  style={{ borderRadius: '15px', padding: '8px 16px' }}
  onClick={() => handleCancel(job._id)}
>
  <FaTimes
    style={{
      fontSize: '20px',
      color: '#fff',
    }}
  />
</Button>

{job.status === 'draft' && (
    <Button
        size="large"
        variant="contained"
        className="!bg-[#fe8735] hover:!bg-orange-600 text-white"
        style={{ borderRadius: '15px', padding: '4px 15px' }}
        onClick={() => handlePublish(job._id)}
        disabled={loadingJobId === job._id}
    >
        {loadingJobId === job._id
            ? <CircularProgress size={24} sx={{ color: '#fff' }} />
            : "Publish"}
    </Button>
)}
                        
                    </CardActions>
                </Card>
                
            ))}
            </Box>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                         <Typography variant="h6" sx={{ textAlign: 'center', color: '#555' }}>
                             No jobs added at the moment.
                     </Typography>
                </Box>
              )}
        </Container>
         {/* Modal */}
         <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>
                    <Typography>{modalMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">OK</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
    <DialogTitle>Cancel Job</DialogTitle>
    <DialogContent>
        <DialogContentText>
            Are you sure you want to cancel this job?
        </DialogContentText>
    </DialogContent>
    <DialogActions>
  
        <Button
   onClick={() => setOpenDialog(false)}
  variant="contained"
  sx={{ backgroundColor: '#fe8735', '&:hover': { backgroundColor: '#fe8735' } }}
>
  No
</Button>
        <Button
  onClick={confirmCancel}
  variant="contained"
  sx={{ backgroundColor: '#8cc63e', '&:hover': { backgroundColor: '#77b834' } }}
>
  Yes, Cancel
</Button>
    </DialogActions>
</Dialog>
        <Footer/>
        </div>
        </>
    );
};

export default DashboardPage;