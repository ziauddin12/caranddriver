//const IMAGE_API = "https://drivewill.com"
const IMAGE_API = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://drivewill.com';

export default IMAGE_API;