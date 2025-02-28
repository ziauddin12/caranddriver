import axios from 'axios';

const API = axios.create({
  baseURL: 'https://drivewill.com/api', // Backend URL
});

export default API;