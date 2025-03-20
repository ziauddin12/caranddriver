import React, { useState, useEffect } from 'react';
import { Container, Box, Card, CardContent, CardMedia, Typography, Button, Grid, TextField } from '@mui/material';
import API from '../Components/services/api';
import CarNavbar from "./CarNavbar";
import IMAGE_API from '../Components/services/ImgBase';
import { CiStar } from "react-icons/ci";
import { Link, useNavigate, useParams } from 'react-router-dom';
import placeholder from "./Images/placeholder.png";

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const { jobId } = useParams();

    useEffect(() => { 
        if (!jobId) {
            navigate('/dashboard');
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await API.get(`/users/driver-users/?page=${currentPage}&search=${searchQuery}&jobId=${jobId}`);
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, searchQuery, jobId, navigate]);

    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleSendOffer = async (userId) => {
        try {
            const response = await API.post('/offers/send', { jobId, userId });
            console.log('Offer sent successfully:', response.data);
            setUsers(prevUsers => prevUsers.map(user => user._id === userId ? { ...user, jobOfferSent: true, statusMessage: "Offer sent successfully." } : user));
        } catch (error) {
            console.error('Error sending offer:', error);
        }
    };

    return (
        <>
        <CarNavbar/>
        <Container maxWidth="lg" sx={{
                maxHeight: users.length > 0 ? '80vh' : 'auto',
                overflowY: 'scroll',
                '&:hover': {
                  overflowY: 'scroll',
                },
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
                backgroundColor: '#fff',
            }}>
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom align="center">
                Driver Lists
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <TextField
                    label="Search for drivers by name, area, and service type."
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{ maxWidth: 400 }}
                />
            </Box>

            {loading && <Typography align="center">Loading...</Typography>}

            <Grid container spacing={2}>
                {users.map((user) => (
                    <Grid item xs={12} sm={6} md={3} key={user._id}>
                        <Card
                            sx={{
                                boxShadow: 3,
                                borderRadius: 2,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                            }}
                        >
                             <Link to={`/driver-profile/${user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <CardMedia
                                component="img"
                                sx={{ width: '100%', height: { xs: 280, sm: 150 }, objectFit: 'cover' }}
                                image={user.profileImage ? IMAGE_API + user.profileImage : placeholder}
                                alt={`${user.firstName} ${user.lastName}`}
                            />
                            </Link>
                            <CardContent>
                                <Link to={`/driver-profile/${user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {user.firstName} {user.lastName}
                                </Link>
                                <Typography variant="body2" color="textSecondary">
                                    {user.area}, {user.city}, {user.country}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <div className="flex py-2 gap-4 bg-transparent outline-none border-[#000000] text-2xl font-bold">
                                        <CiStar /><CiStar /><CiStar /><CiStar /><CiStar />
                                    </div>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Vehicle Type: {user.vehicleType}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                                    {user.jobOfferSent ? (
                                        <Typography variant="body2" color="primary" sx={{ color: 'blue' }}>
                                            {user?.statusMessage}
                                        </Typography>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: '#ff5722', color: '#fff' }}
                                            onClick={() => handleSendOffer(user._id)}
                                        >
                                            Send Offer
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {currentPage < totalPages && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoadMore}
                        sx={{ padding: '10px 20px' }}
                    >
                        Load More
                    </Button>
                </Box>
            )}
        </Box>
        </Container>
        </>
    );
};

export default UserListPage;