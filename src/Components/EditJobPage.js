import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Container, Typography, Box, Grid, Autocomplete  } from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import CarNavbar from "./CarNavbar";
import API from '../Components/services/api';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from "./Footer"; 

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

const EditJobPage = () => {
    const [currency, setCurrency] = useState('');
        const [startDate, setStartDate] = useState(null);
        const [endDate, setEndDate] = useState(null);
        const [shift, setShift] = useState('');
        const [pay, setPay] = useState('');
        const [area, setArea] = useState('');
        const [serviceType, setServiceType] = useState('');
        const [modalMessage, setModalMessage] = useState("");
        const [showModal, setShowModal] = useState(false);
       // const [image, setImage] = useState(null);
        const [country, setCountry] = useState('');
        const [city, setCity] = useState('');
        const [cities, setCities] = useState([]);
    
        const [searchQuery, setSearchQuery] = useState('');
    
        const handleSearchChange = (event, newValue) => {
            setSearchQuery(newValue);
        };
    
        const filteredServiceTypes = serviceTypes.filter(service =>
            service.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const { jobId } = useParams();
    const navigate = useNavigate();
    
    const [dateError, setDateError] = useState('');
    const [formErrors, setFormErrors] = useState({
            currency: '',
            shift: '',
            pay: '',
            location: '',
            serviceType: '',
            country: '',
            city: '',
            area: '',
        });

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await API.get(`/jobs/${jobId}`);
                const job = response.data;
                setArea(job.area);
                setStartDate(new Date(job.startDate));
                setEndDate(new Date(job.endDate));
                setShift(job.shift);
                setPay(job.pay);
                setCity(job.city);
                setCountry(job.country);
                setCurrency(job.currency);
                setServiceType(job.serviceType);
            } catch (error) {
                console.error("Failed to fetch job details", error);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    useEffect(() => {
            // Fetch cities when country changes
            if (country) {
                fetchCities(country);
            }
        }, [country]);
    
        const fetchCities = async (countryCode) => {
            if( countryCode === 'Spain'){
                countryCode = 'ES';
            } else if( countryCode === 'France' ){
                countryCode = 'FR';
            } else if( countryCode === 'Germany' ){
                countryCode = 'GE';
            } else if( countryCode === 'Egypt' ){
                countryCode = 'EG';
            }
    
            try {
                const response = await axios.get(`http://api.geonames.org/searchJSON?country=${countryCode}&maxRows=1000&username=otknews2025`);
                if (response.data && response.data.geonames) {
                    setCities(response.data.geonames.map(city => city.name));
                    setCity('');
                    setArea('');
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
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

        try {
          //  console.log(shift);
            const response = await API.put(`/jobs/${jobId}`, jobData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                console.log('Job update successfully:', response.data);
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

    


    return (
        <>
              <CarNavbar />
                        <Container maxWidth="md" sx={{
                            mt: { xs: 0, sm: 4 },
                            mb: { xs: 0, sm: 4 },
                            p: 3,
                            backgroundColor: "#f9f9f9",
                            borderRadius: { xs: 0, sm: 2 },
                            boxShadow: 3,
                            overflow: "auto",
                        }}>
                            <Typography variant="h6" gutterBottom>Post a Job</Typography>
                            <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
            
                             {/* Shift */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        label="Shift"
                        fullWidth
                        margin="normal"
                        size="small"
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                        error={!!formErrors.shift}
                        helperText={formErrors.shift}
                    >
                        {shiftTypes.map((shift) => (
                            <MenuItem key={shift} value={shift}>{shift}</MenuItem>
                        ))}
                    </TextField>
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
            
                {/* Service Type */}
                <Grid item xs={12} sm={6}>
                <Box display="flex" gap={2} alignItems="center" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
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
                    <TextField
                        select
                        label="Country"
                        fullWidth
                        margin="normal"
                        size="small"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        error={!!formErrors.country}
                        helperText={formErrors.country}
                    >
                        {coutryies.map((country) => (
                            <MenuItem key={country} value={country}>{country}</MenuItem>
                        ))}
                    </TextField>
                    </Box>
                </Grid>
            
                {/* Location */}
                <Grid item xs={12} sm={6}>
                   <Box display="flex" gap={2} alignItems="center">
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
                    <TextField
                        label="Area"
                        fullWidth
                        margin="normal"
                        size="small"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Area"
                        error={!!formErrors.area}
                        helperText={formErrors.area}
                    />
                    </Box>
                </Grid>
            
               
               
            
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
            
                {/* Submit Button */}
                <Grid item xs={12} display="flex" justifyContent="center" mt={1}>
                    <Button variant="contained"  className="!bg-orange-500 hover:!bg-orange-600 text-white" type="submit" sx={{ width: { xs: '100%', sm: '200px' } }}>
                        Update Job
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
            

        </>
    );
};

export default EditJobPage;