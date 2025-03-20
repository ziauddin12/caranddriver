import axios from 'axios';

// Determine the base URL based on the environment
const baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://drivewill.com/api';

const API = axios.create({
  baseURL: baseURL,
});

export default API;
