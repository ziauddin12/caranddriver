import React, { useState, useEffect  } from 'react';
import { TextField, Button, MenuItem, Container, Typography, Box, Grid, Autocomplete,
     Dialog, DialogActions, DialogContent, DialogTitle
  } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import CarNavbar from "./CarNavbar";
import API from '../Components/services/api';
import { useNavigate, Link } from 'react-router-dom';
import Footer from "./Footer"; 
//import axios from 'axios';
import { Helmet } from "react-helmet-async";

const serviceTypes = ["Rideshare", "Private", "Delivery", "SCHOOL", "BUSINESS", "Intercity Cargo", "Travel"];
//const statusTypes = ["published", "draft"];
const shiftTypes = ["6 hrs day", "6 hrs night", "8 hrs day", "8 hrs night", 
    "12 hrs day", "12 hrs night", "full day"];

const coutryies = ["USA", "Spain", "France", "Germany", "Egypt"];    

const currencies = [
        { code: "USD", label: "USD" },
        { code: "EUR", label: "EUR" },
        { code: "EGP", label: "EGP" }
    ];

const PostJobPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    //const [isProfileComplete, setIsProfileComplete] = useState(true);

    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                  //  navigate("/login"); // Redirect if user is not logged in
                 //   return;
                }

                const response = await API.get(`/users/${userId}`);
                const profileData = response.data;

              //  console.log(profileData);

                // Define required fields
                const requiredFields = ["idNumber", "dateOfBirth", "area", "vehicleType", "uploadID", "uploadLicense", "profileImage"]; // Adjust as needed
                const missingFields = requiredFields.filter(field => !profileData[field]);

                if (missingFields.length > 0) {
                   // navigate("/carowner-profile"); // Redirect to profile edit page if any field is empty
                   // setModalMessage('Please complete your profile to be able to post a job.');
                    //setShowModal(true);
                    setProfileDialogOpen(true);
                    setIsLoading(false);
                   // setIsProfileComplete(false);
                } else {
                    setIsLoading(false); // Allow form to render if profile is complete
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                navigate("/carowner-profile"); // Redirect on error
               //setModalMessage('Please complete your profile to be able to post a job.');
              // setShowModal(true);
            }
        };

        checkUserProfile();
    }, [navigate]);

    const [currency, setCurrency] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [shift, setShift] = useState('');
    const [pay, setPay] = useState('');
    const [area, setArea] = useState('');
    const [serviceType, setServiceType] = useState('');
   
   // const [image, setImage] = useState(null);
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState([]);

    const [states, setStates] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event, newValue) => {
        setSearchQuery(newValue);
    };

    const filteredServiceTypes = serviceTypes.filter(service =>
        service.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

 
    
    const [dateError, setDateError] = useState('');
    const [formErrors, setFormErrors] = useState({
        currency: '',
        shift: '',
        pay: '',
        serviceType: '',
        country: '',
        city: '',
        area: '',
    });

    useEffect(() => {
        // Fetch cities when country changes
        if (country) {
            fetchStates(country);
            if(area){
                fetchCities(country, area);
            }
            
        }
    }, [country, area]);

    const fetchCities = async (countryCode, area) => {
        if( countryCode === 'Spain'){
            countryCode = 'ES';
        } else if( countryCode === 'France' ){
            countryCode = 'FR';
        } else if( countryCode === 'Germany' ){
            countryCode = 'DE';
        } else if( countryCode === 'Egypt' ){
            countryCode = 'EG';
        }

        try {
            const response = await API.get(`/users/city/${countryCode}/${area}`);
            if (response.data && response.data.geonames) {
                setCities(response.data.geonames.map(city => city.name));
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };


    const fetchStates = async (countryCode) => {
        // Use a mapping object for better scalability and readability
        const countryMapping = {
            'Spain': 'ES',
            'France': 'FR',
            'Germany': 'DE', // Corrected country code for Germany
            'Egypt': 'EG'
        };
    
        // Default to the provided countryCode if it's not mapped
        const mappedCountryCode = countryMapping[countryCode] || countryCode;
    
        try {
            const response = await API.get(`/users/state/${mappedCountryCode}`);
            
            if (response.data && response.data.geonames) {
                // Update states only if data is valid
                setStates(response.data.geonames.map(state => state.adminName1));
            } else {
                console.error('No geonames data found in response');
            }
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (endDate && date && endDate <= date) {
            setDateError('End date must be greater than start date');
        } else {
            setDateError('');
        }
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        if (startDate && date && date <= startDate) {
            setDateError('End date must be greater than start date');
        } else {
            setDateError('');
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!currency) errors.currency = "currency is required";
        if (!shift) errors.shift = "Shift is required";
        if (!pay) errors.pay = "Pay is required";
        if (!area) errors.area = "Area is required";
        if (!serviceType) errors.serviceType = "Service Type is required";
        if (!country) errors.country = "Country is required";
        if (!city) errors.city = "City is required";
       // if (!image) errors.image = "Car Image is required";
       
        
        setFormErrors(errors);
        
        // Ensure the form is valid
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (dateError || !validateForm()) return; // Do not submit if there's a date error or form is invalid
        
        const userId = localStorage.getItem("userId");

        const jobData = new FormData();
        jobData.append('currency', currency);
        jobData.append('startDate', startDate);
        jobData.append('endDate', endDate);
        jobData.append('area', area);
        jobData.append('city', city);
        jobData.append('country', country);
        jobData.append('shift', shift);
        jobData.append('pay', pay);
        jobData.append('serviceType', serviceType); 
        jobData.append('userId', userId);
       // if (image) jobData.append('image', image);

        try {
            const response = await API.post('/jobs/post-job/create', jobData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                console.log('Job posted successfully:', response.data);
                setModalMessage(response.data.message);
                setShowModal(true);
                // Optionally reset form or provide success message here
                navigate(`/dashboard`);
            } else {
                setModalMessage(response.data.message);
                setShowModal(true);
            }
        } catch (error) {
            setModalMessage("Failed to post job");
            setShowModal(true);
        }
    };

    const closeModal = () => setShowModal(false);

    /*const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImage(file);
        } else {
            alert('Only JPG and PNG images are allowed');
        }
    };*/

    if (isLoading) return <p>Loading...</p>;


    return (
        <>
           <Helmet>
                <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
            </Helmet>
            <div className="min-h-screen flex flex-col justify-between">
            <CarNavbar />
                         <Container maxWidth="lg" sx={{
                                             minHeight: {
                                                xs: '60vh', // 60% of the viewport height on mobile
                                                sm: '60vh', // Keep 70vh on small screens and up
                                              },
                                         maxHeight: {
                                            xs: '80vh', // For mobile (extra small screens), set maxHeight to 100%
                                            sm: '100%', // For small screens and up, set maxHeight to 80vh
                                          },
                                        backgroundColor: {
                                            xs: '#fff', // For mobile, set background color to white
                                            sm: '#fff', // For small screens and up, use transparent (or any other color you prefer)
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
                <Typography variant="h6" gutterBottom>Post a Job</Typography>
                <form onSubmit={handleSubmit}>
  {/* Service Type */}
  <Grid item xs={12} sm={6}>
    <Autocomplete
            fullWidth
            value={serviceType}
            onChange={(e, newValue) => setServiceType(newValue)}
            options={filteredServiceTypes}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Job Type"
                    fullWidth
                    margin="normal"
                    size="small"
                    error={!!formErrors.serviceType}
                    helperText={formErrors.serviceType}
                />
            )}
            filterOptions={(options, state) => {
                // Limiting the options to a maximum of 3
                const filtered = options.filter((option) =>
                    option.toLowerCase().includes(state.inputValue.toLowerCase())
                );
                return filtered.slice(0, 7);
            }}
            inputValue={searchQuery}
            onInputChange={handleSearchChange}
        />
         
    </Grid>


                <Grid container spacing={2} sx={{
                mt: { xs: 0, sm: "2px" }, 
            }}>

               

     {/* Start Date */}
     <Grid item xs={12} sm={6}>
        <Typography variant="body1" gutterBottom>Start Date</Typography>
        <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()} // Prevent past dates
            customInput={
                <TextField
                    fullWidth
                    size="small"
                    value={startDate ? startDate.toLocaleDateString('en-CA') : ''}
                    placeholder="Select Start Date"
                    InputProps={{
                        endAdornment: <FaCalendarAlt style={{ cursor: 'pointer', color: '#6b7280' }} />
                    }}
                    error={!!formErrors.startDate}
                    helperText={formErrors.startDate}
                />
            }
        />
    </Grid>

    {/* End Date */}
    <Grid item xs={12} sm={6}>
        <Typography variant="body1" gutterBottom>End Date</Typography>
        <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()} // Prevent past dates
            customInput={
                <TextField
                    fullWidth
                    size="small"
                    value={endDate ? endDate.toLocaleDateString('en-CA') : ''}
                    placeholder="Select End Date"
                    InputProps={{
                        endAdornment: <FaCalendarAlt style={{ cursor: 'pointer', color: '#6b7280' }} />
                    }}
                    error={!!formErrors.endDate}
                    helperText={formErrors.endDate}
                />
            }
        />
        {dateError && <Typography color="error" variant="body2">{dateError}</Typography>}
    </Grid>

                 {/* Shift */}
    <Grid item xs={12} sm={6}>
         

        <Autocomplete
                                fullWidth
                                value={shift}
                                onChange={(e, newValue) => setShift(newValue)}
                                options={shiftTypes}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Shift"
                                        fullWidth
                                        margin="normal"
                                        size="small"
                                        error={!!formErrors.shift}
                                        helperText={formErrors.shift}
                                    />
                                )}
                            />
    </Grid>

    {/* Pay & Currency */}
    <Grid item xs={12} sm={6}>
        <Box display="flex" gap={2} alignItems="center">
            <TextField
                label="Pay"
                fullWidth
                margin="normal"
                type="number"
                size="small"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                error={!!formErrors.pay}
                helperText={formErrors.pay}
            />
            <TextField
                select
                label="Currency"
                margin="normal"
                size="small"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                error={!!formErrors.currency}
                helperText={formErrors.currency}
                sx={{ minWidth: 120 }}
            >
                {currencies.map((curr) => (
                    <MenuItem key={curr.code} value={curr.code}>
                        {curr.label}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    </Grid>

   

    {/* Location */}
    <Grid item xs={12} sm={12}>
    <Box 
  display="flex" 
  gap={2} 
  alignItems="center" 
  sx={{ 
    flexDirection: { xs: 'column', sm: 'row' }, // 'column' on mobile (xs), 'row' on larger screens (sm and above)
  }}
>

        <Autocomplete
                                fullWidth
                                value={country}
                                onChange={(e, newValue) => setCountry(newValue)}
                                options={coutryies}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Country"
                                        fullWidth
                                        margin="normal"
                                        size="small"
                                        error={!!formErrors.country}
                                        helperText={formErrors.country}
                                    />
                                )}
                            />

        <Autocomplete
                                fullWidth
                                value={area}
                                onChange={(e, newValue) => setArea(newValue)}
                                options={states}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="State"
                                        fullWidth
                                        margin="normal"
                                        size="small"
                                        error={!!formErrors.area}
                                        helperText={formErrors.area}
                                    />
                                )}
                            />

       <Autocomplete
                                fullWidth
                                value={city}
                                onChange={(e, newValue) => setCity(newValue)}
                                options={cities}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="City"
                                        fullWidth
                                        margin="normal"
                                        size="small"
                                        error={!!formErrors.city}
                                        helperText={formErrors.city}
                                    />
                                )}
                            />
        
        </Box>
    </Grid>

   
   

    

    {/* Submit Button */}
    <Grid item xs={12} display="flex" justifyContent="center" mt={1}>
        <Button variant="contained" className="!bg-[#fe8735] hover:!bg-orange-600 text-white" type="submit" sx={{ width: { xs: '100%', sm: '200px' } }}>
            Submit Job
        </Button>
    </Grid>
</Grid>

                </form>
            </Container>

            {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header text-right justify-content-end"> 
              <button onClick={closeModal} className="close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="close-modal-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer/>
      </div>

      <Dialog open={profileDialogOpen}>
                      <DialogTitle>Profile Incomplete</DialogTitle>
                      <DialogContent>
                          <Typography>Please complete your profile before proceeding.</Typography>
                          <Link to="/carowner-profile" style={{ color: "#6698f7" }}>Go to Profile</Link>
                      </DialogContent>
                  </Dialog>

        </>
    );
};

export default PostJobPage;