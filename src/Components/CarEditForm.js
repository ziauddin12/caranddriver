import React, { useEffect, useState } from "react";


//import fromicon from "../assets/formicon.png";

import { FaCalendarAlt } from "react-icons/fa";

//import cloudcomputing from "../assets/cloudcomputing.png";
import { CiStar } from "react-icons/ci";

import { Container } from '@mui/material';

//import { IoCarSportOutline } from "react-icons/io5";
//import car from "../assets/car.webp";
//import Navbar from "./Navbar";
import CarNavbar from "./CarNavbar";

import API from '../Components/services/api';
import IMAGE_API from '../Components/services/ImgBase';
import UserProfile from '../Components/UserProfile';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "./Footer"; 

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subYears } from "date-fns"; // Import date-fns function

const CarEditForm = () => {
  const { t, i18n } = useTranslation(); // Hook for translation

  const navigate = useNavigate(); // Get navigate function
  const userType = localStorage.getItem('userType'); 
  if (userType === 'driver') {
    navigate('/driver-profile');
  }

  const [errors, setErrors] = useState({});
  //const [successMessage, setSuccessMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  const [userData, setUserData] = useState({ 
    firstName: "",
    lastName: "",
    idNumber: "", 
    dateOfBirth: "",
    phone: "",
    email: "",
    password: "",
    vehicleType: "",
    transmission: "",
    airCondition:"",
    insurance:"",
    fuel:"",
    color:"",
    vehicleplate:"",
    area: "",
    city: "",
    country: "",
    ratings: 0,
    confirmPassword: "",
    profileImage:"",
  });

   useEffect(() => {
              // Fetch cities when country changes
              if (userData?.country) {
                  fetchStates(userData?.country);
                  if(userData?.area){
                      fetchCities(userData?.country, userData?.area);
                  }
                  
              }
          }, [userData?.country, userData?.area]);
    
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

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId'); 
    
        // Using template literals for string interpolation
        const response = await API.get(`/users/${userId}`); 
        
        setUserData(response.data); // Adjust based on how your `API` service formats responses

        if(response.data.profileImage){
          setPreviewImage(`${IMAGE_API}${response.data.profileImage}`);
        }
        
        //setTempFirstName(response.data.firstName);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();

  }, []);

  // Convert the dateOfBirth to MM/DD/YYYY for display purposes
const formatDate = (date) => {
  if (!date) return '';
  const newDate = new Date(date);
  const day = String(newDate.getDate()).padStart(2, '0'); // Ensure two-digit day
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
  
  const year = newDate.getFullYear();
  return `${year}-${month}-${day}`;
};

const CustomInput = ({ value, onClick }) => (
  <button 
    onClick={onClick} 
    className="w-full flex items-center justify-between px-3 py-2  rounded-md outline-none bg-white"
  >
    {value || "Select Date"}
    <FaCalendarAlt className="text-gray-500" />
  </button>
);


// Use this formatted date for display purposes
//const formattedDate = formatDate(userData?.dateOfBirth);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(userData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (userData.password && userData.confirmPassword) {

    if (!userData.password) {
      newErrors.password = "Password is required"; 
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"; 
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
  } 
     
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     
    if (validateForm()) {
    try {

      const userId = localStorage.getItem('userId'); 

      // Update userData with the formatted date
      const updatedUserData = { ...userData, dateOfBirth: selectedDate };
      // Use the `put` method from your API service
      const response = await API.put(`/users/${userId}`, updatedUserData); // Ensure the endpoint matches your API
      
      if (response.status === 200) { // Assuming a 200 status code means success 
        setModalMessage("Profile updated successfully!");
        
      } else { 
        setModalMessage("Profile updated Faild!");
      }
      setShowModal(true);
    } catch (error) {
      setModalMessage("Profile updated Faild!");
      setShowModal(true);
    }

    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Show preview
      await handleUpload(file); // Auto-upload the file
    }
  };

  const handleUploadClick = () => {
    document.getElementById("uploadInput").click(); // Trigger file input click
  };

  const handleUpload = async (file) => {
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData(); 
    formData.append("profileImage", file);

    try {
      const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
      const response = await API.put(`/users/${userId}/profileImage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) { 
        setModalMessage("Profile image updated successfully!");
       
      } else {
        setModalMessage("Profile image updated Faild!");
      }
      setShowModal(true);
    } catch (error) {
      setModalMessage("Profile image updated Faild!");
      setShowModal(true);
    }
  };

    
  const handleFileUpload = async (e, fileKey, successMessage) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
        const response = await API.put(`/users/${userId}/${fileKey}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          setModalMessage(successMessage);
        } else {
          setModalMessage(successMessage); // Fallback in case of non-200 status
        }
        setShowModal(true);
      } catch (error) {
        setModalMessage(`Error uploading the ${fileKey.replace("upload", "")}!`);
        setShowModal(true);
      }
    }
  };
  
  const minAgeDate = subYears(new Date(), 18);
  const closeModal = () => setShowModal(false);

   // Fetch dateOfBirth from database (example from localStorage or API)
    useEffect(() => {
      const dateOfBirthFromDB = userData?.dateOfBirth; // Or fetch from API
      if (dateOfBirthFromDB) {
        // Convert to Date object if necessary
        setSelectedDate(new Date(dateOfBirthFromDB));
      }
    }, [userData?.dateOfBirth]);

  return (
    <>
    <div className="min-h-screen flex flex-col justify-between">
    <CarNavbar/>
      
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
              <div className=" bg-[#FFFFFF] lg:p-5">
        <div className="  shadow-md max-w-6xl mx-auto lg:mt-8 border-[1px] lg:border-2  border-[#000000] text-[#000000] ">
          <div className=" pb-4 mt-5 mb-2 lg:mb-20  ">
             <UserProfile userData={userData} setUserData={setUserData} />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2    ">
            <div className=" border-[1px] lg:border-[1px] border-b-0 border-r-0 lg:border-r-2  border-l-0   border-[#000000]">
              <div className="col-span-2  place-items-center">
                <h2 className="text-xl  font-bold py-2   text-center w-full">
                  {t("carOwnerDetails")}
                </h2>

                <table className="w-full border border-[#000000]">
                  <tbody>
                    <tr className="border-b border-[#000000]">
                      <td className="px-4 py-2 w-1/2 font-thin lg:font-semibold text-lg  text-[#000000]">
                         {t("idNumber")}
                      </td>
                      <td className="border-l-2 px-4 border-[#000000]">
                        <input
                          type="number"
                          name="idNumber"
                          value={userData?.idNumber}
                          onChange={handleInputChange}
                          placeholder="Enter ID Number"
                          className="w-full placeholder:text-black bg-transparent outline-none"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-[#000000]">
                      <td className="px-4 py-2 font-thin lg:font-semibold text-lg text-[#000000]">
                         {t("dateOfBirth")}
                      </td>
                      <td className="border-l-2 px-0 border-[#000000]">
                        
                           <DatePicker
                              selected={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                              dateFormat="yyyy-MM-dd"
                              className="w-full outline-none"
                              maxDate={minAgeDate} // Restrict selection to 18+ only
                              showYearDropdown
                              scrollableYearDropdown
                              yearDropdownItemNumber={100} // Show a broader range of years
                              customInput={<CustomInput />}
                            />
                      </td>
                    </tr>
                    <tr className="border-b border-[#000000]">
                      <td className="px-4 py-2 font-thin lg:font-semibold text-lg text-[#000000]">
                         {t("phone")}
                      </td>
                      <td className=" border-l-2 px-4 border-[#000000]">
                        <input
                          type="tel"
                          name="phone"
                          value={userData?.phone}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[+\d]*$/.test(value)) {
                              handleInputChange(e);
                            }
                          }}
                          placeholder="Enter Phone Number"
                          className="w-full placeholder:text-black bg-transparent outline-none"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Login Information Section */}
                <div className="col-span-2 w-full">
                  <h2 className=" border-t-[1px] lg:border-t-2 mb-4 border-b border-[#000000] text-xl font-bold py-2 text-center w-full">
                    {t("loginInformation")}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 text-sm font-medium mb-10 pl-2 mr-2">
                    <div className="lg:flex justify-between items-center">
                      <label
                        htmlFor="email"
                        className="text-lg font-thin lg:font-semibold w-1/3"
                      >
                        {t("email")}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData?.email}
                        onChange={handleInputChange}
                        // placeholder="Enter your email"
                        className="w-full lg:w-2/3 p-2 lg:p-1.5 outline-none lg:ml-[40px] border-[1px] lg:border-2 border-black bg-transparent text-[#000000] placeholder-gray-500"
                      />
                    </div>
                    <div className="lg:flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="text-lg font-thin lg:font-semibold w-1/3"
                      >
                        {t("password")}
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={userData?.password}
                        onChange={handleInputChange}
                        // placeholder="Enter your password"
                        className="w-full lg:w-2/3 p-2 lg:p-1.5 outline-none input lg:ml-[40px] border-[1px] lg:border-2 border-black bg-transparent text-[#000000] placeholder-gray-500"
                      />
                    </div>
                    <div className="lg:flex items-center">
                      <label
                        htmlFor="confirmPassword"
                        className="text-lg lg:w-[38%] p-2 lg:p-1.5 font-thin lg:font-semibold w-auto flex-shrink-0"
                      >
                        {t("confirmPassword")}
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={userData?.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full outline-none p-2 lg:p-1 border-[1px] lg:border-2 border-black bg-transparent text-[#000000] placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Services Section */}
                <div className="col-span-2 w-full">
                  <h2 className="mb-4 border-y uppercase border-[#000000] border-t-[1px] lg:border-t-2 text-xl font-bold py-2 text-center w-full flex justify-center items-center gap-4">
                  {t("vehicleDetails")}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 font-medium pl-4 pr-3">
                    <div className="lg:flex items-center gap-4">
                      <p className="w-[53%] lg:w-1/3 flex-shrink-0 ">{t("makeModelYear")}</p>
                      <input
                        type="text"
                        // placeholder="Enter details"
                        name="modelYear"
                        value={userData?.modelYear}
                        onChange={handleInputChange}
                        className="w-full lg:w-[60%] bg-transparent p-1.5 border-[1px] lg:border-2 border-black outline-none placeholder-gray-400"
                      />
                    </div>

                    <div className="lg:flex items-center gap-4">
                      <p className="w-[79%] lg:w-1/3">{t("vehicleType")}</p>
                      <select
  className="lg:w-[60%] sm:w-[70%] w-full border-[1px] lg:border-2 p-1.5 bg-transparent outline-none border-[#000000]"
  id="vehicleType"
  name="vehicleType"
  value={userData?.vehicleType || ""} // Ensure a fallback value is provided
  onChange={(e) => setUserData((prev) => ({ ...prev, vehicleType: e.target.value }))} // Update state
>
  <option value="">{t("selectVehicleType")}</option> {/* Optional placeholder */}
  <option value="Car">Car</option>
  <option value="Motorcycle">Motorcycle</option>
  <option value="Scooter">Scooter</option>
  <option value="Bicycle">Bicycle</option>
  <option value="Bus">Bus</option>
  <option value="Minibus">Minibus</option>
  <option value="Truck">Truck</option>
  <option value="Van">Van</option>
  <option value="SUV">SUV</option>
  <option value="Pickup Truck">Pickup Truck</option>
  <option value="Dump Truck">Dump Truck</option>
  <option value="Tractor">Tractor</option>
  <option value="Excavator">Excavator</option>
  <option value="Bulldozer">Bulldozer</option>
  <option value="Backhoe">Backhoe</option>
  <option value="Crane">Crane</option>
  <option value="Combine Harvester">Combine Harvester</option>
  <option value="Taxi">Taxi</option>
  <option value="Garbage Truck">Garbage Truck</option>
  <option value="RV (Recreational Vehicle)">RV (Recreational Vehicle)</option>
  <option value="Trailer">Trailer</option>
</select>
                    </div>
                    <div className="lg:flex items-center gap-4">
                      <p className="w-[77%] lg:w-1/3">{t("transmission")}</p>
                      <select
  className="lg:w-[60%] w-full sm:w-[70%] border-[1px] lg:border-2 p-1.5 bg-transparent outline-none border-[#000000]"
  id="transmission"
  name="transmission"
  value={userData?.transmission || ""} // Ensure a fallback value is provided
  onChange={(e) => setUserData((prev) => ({ ...prev, transmission: e.target.value }))} // Update state
>
  <option value="">Select one</option> {/* Optional placeholder */}
  <option value="regular">Regular</option>
  <option value="automatic">Automatic</option>
  </select>
                    </div>
                    <div className="lg:flex items-center gap-4">
                      <p className="w-[79%] lg:w-1/3">{t("airCondition")}</p>
                      <select
  className="lg:w-[60%] w-full sm:w-[70%] border-[1px] lg:border-2 p-1.5 bg-transparent outline-none border-[#000000]"
  id="airCondition"
  name="airCondition"
  value={userData?.airCondition || ""} // Ensure a fallback value is provided
  onChange={(e) => setUserData((prev) => ({ ...prev, airCondition: e.target.value }))} // Update state
>
  <option value="">Select one</option> {/* Optional placeholder */}
  <option value="yes">Yes</option>
  <option value="no">No</option>
  </select>
                    </div>
                    <div className="lg:flex items-center gap-4">
                      <p className="w-[79%] lg:w-1/3">{t("insurance")}</p> 
                      <select
  className="lg:w-[60%] w-full sm:w-[70%] border-[1px] lg:border-2 p-1.5 bg-transparent outline-none border-[#000000]"
  id="insurance"
  name="insurance"
  value={userData?.insurance || ""} // Ensure a fallback value is provided
  onChange={(e) => setUserData((prev) => ({ ...prev, insurance: e.target.value }))} // Update state
>
  <option value="">Select one</option> {/* Optional placeholder */}
  <option value="none">none</option>
  <option value="private">private</option>
  <option value="obilgatory">obilgatory</option>
  </select>
                    </div>
                    <div className="lg:flex items-center gap-4">
                      <p className="w-[79%] lg:w-1/3"> {t("fuel")}</p>
                       
                      <select
  className="lg:w-[60%] w-full sm:w-[70%] border-[1px] lg:border-2 p-1.5 bg-transparent outline-none border-[#000000]"
  id="fuel"
  name="fuel"
  value={userData?.fuel || ""} // Ensure a fallback value is provided
  onChange={(e) => setUserData((prev) => ({ ...prev, fuel: e.target.value }))} // Update state
>
  <option value="">Select one</option> {/* Optional placeholder */}
  <option value="Gasoline">Gasoline</option>
  <option value="Diesel">Diesel</option>
  <option value="CNG">CNG (Compressed Natural Gas)</option>
  <option value="LPG">LPG (Liquefied Petroleum Gas)</option>
  <option value="Ethanol">Ethanol</option>
  <option value="Biodiesel">Biodiesel</option>
  <option value="Electric">Electric</option>
  <option value="Hybrid">Hybrid</option>
  <option value="Hydrogen">Hydrogen</option>
  </select>
                    </div>
                    <div className="lg:flex items-center gap-4">
                      <p className="w-[79%] lg:w-1/3">{t("color")}</p>
                      <input
                        type="text"
                        // placeholder="Enter color"
                        name="color"
                        value={userData?.color}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z]*$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                        className="w-full lg:w-[60%] bg-transparent outline-none placeholder-gray-400 border-[1px] lg:border-2 border-black  mb-2 p-1.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 w-full mt-1">
                  <h2 className="mb-4 border-y border-t-[1px] lg:border-t-2 uppercase border-[#000000] text-xl font-bold py-2 text-center w-full flex justify-center gap-2">
                    <span>{t("uploads")}</span>
                  </h2>
                  <div className="flex justify-evenly items-center text-black text-xs mb-3">
                    {/* ID Upload Button */}
                    <div className="relative text-center justify-center items-center">
                      <input
                        type="file"
                        accept="image/*"
                        id="upload-id"
                        className="hidden"
                        onChange={(e) => {
                          handleFileUpload(e, "uploadID", "ID uploaded successfully!");
                          e.target.value = ""; // Reset the file input after handling the change
                        }}
                      />
                      <label
                        htmlFor="upload-id"
                        className="bg-[#8BC53D] text-2xl font-bold py-2 px-4 rounded-full shadow-md w-16 h-16 flex items-center justify-center border  font flex-col text-xs leading-3 cursor-pointer text-white"
                      >
                        {t("uploadID")}
                      </label>
                    </div>

                    {/* Vehicle License Upload Button */}
                    <div className="relative text-center justify-center items-center">
                      <input
                        type="file"
                        accept="image/*"
                        id="upload-license"
                        className="hidden" 
                        onChange={(e) => {
                          handleFileUpload(e, "uploadLicense", "License uploaded successfully!");
                          e.target.value = ""; // Reset the file input after handling the change
                        }}
                      />
                      <label
                        htmlFor="upload-license"
                        className="bg-[#8BC53D] py-2 px-4 rounded-full shadow-md w-16 h-16 flex items-center justify-center border  font-bold cursor-pointer text-white"
                      >
                        {t("vehicleLicense")}
                      </label>
                    </div>

                    {/* Car Owner Upload Button */}
                    <div className="relative text-center justify-center items-center">
                      <input
                        type="file"
                        accept="image/*"
                        id="upload-car-owner"
                        className="hidden" 
                        onChange={(e) => {
                          handleFileUpload(e, "carowner", "Carowner uploaded successfully!");
                          e.target.value = ""; // Reset the file input after handling the change
                        }}
                      />
                      <label
                        htmlFor="upload-car-owner"
                        className="bg-[#8BC53D] py-2 px-4 text-white rounded-full shadow-md w-16 h-16 flex items-center justify-center border  text-[10px] font-bold flex-col leading-3 cursor-pointer"
                      >
                         
                        {t("carOwner")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end  lg:relative   ">
              <div>
                <div className="">
                  <div className=" bg-white border border-black rounded-lg   pb-6 lg:w-[34.5rem] h-[20rem] lg:h-[32.4rem] flex justify-center items-center   lg:absolute lg:top-[0rem] lg:right-0 ">
                    
{previewImage ? (
    <img
      src={previewImage}
      alt=""
      className="object-cover mt-2 lg:mt-0  w-[26rem] h-[18rem]  lg:h-[26rem]  cursor-pointer"
      onClick={handleUploadClick}
    />
  ) : (
    <div
      className="lg:w-2/3 cursor-pointer py-20"
      onClick={handleUploadClick}
    >
      <span className="ml-2">Upload your personal image</span>
    </div>
  )}
                    
                  </div>

                  <input
        id="uploadInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange} // Automatically upload on file change
      />
                </div>

                {/*  */}

                <div className=" border-[1px] lg:border-2  border-[#000000] border-r-0  border-b-0 ">
                  <h2 className="text-2xl  w-full  mb-4 text-center  font-bold py-1 border-y border-[#000000] ">
                  {t("highlights")}
                  </h2>
                  <div className="grid grid-cols-1 gap-2 mx-3 ">
                    <div className="flex justify-between items-center ">
                      <label className="block text-base  sm:text-lg font-medium">
                      {t("ratings")}
                      </label>
                      <div className="flex border-[1px] lg:border-2 gap-4 w-[60%]  sm:w-[70%]  p-1.5 bg-transparent  outline-none border-[#000000] text-2xl font-bold ">
                        <CiStar />
                        <CiStar />
                        <CiStar />
                        <CiStar />
                        <CiStar />
                      </div>
                    </div>
                    <div className="flex justify-between items-center ">
                      <label className="block  font-medium  text-base  sm:text-lg ">
                      {t("vehiclePlate")}
                      </label>
                      <input
                        type="text"
                        name="vehicleplate"
                        value={userData?.vehicleplate}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                        className="w-[60%]  sm:w-[70%] border-[1px] lg:border-2   p-1.5 bg-transparent  outline-none border-[#000000]"
                      />
                    </div>
                    <div className="flex justify-between items-center ">
                      <label className="block text-base  sm:text-lg font-medium">
                      {t("country")}
                      </label> 
                      <select
  className="w-[60%] sm:w-[70%] border-[1px] lg:border-2 p-1.5 bg-transparent outline-none border-[#000000]"
  id="country"
  name="country"
  value={userData?.country || ""} // Ensure a fallback value is provided
  onChange={(e) => setUserData((prev) => ({ ...prev, country: e.target.value }))} // Update state
>
  <option value="">Select a country</option> {/* Optional placeholder */}
  <option value="USA">USA</option>
  <option value="Spain">Spain</option>
  <option value="France">France</option>
  <option value="Germany">Germany</option>
  <option value="Egypt">Egypt</option>
  
  </select>
                    </div>

                    <div className="flex justify-between items-center ">
                      <label className="block  font-medium text-base  sm:text-lg ">
                      State
                      </label>
                     {/* <input
                        type="text"
                        name="area"
                        value={userData?.area}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z]*$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                        className="w-[60%]  sm:w-[70%] border-[1px] lg:border-2   p-1.5  bg-transparent  outline-none border-[#000000] "
                      /> */}

<select
  className="w-[60%]  sm:w-[70%] border-[1px] lg:border-2 deselect  p-1.5  bg-transparent  outline-none border-[#000000] truncate"
  id="area"
  name="area"
  value={userData?.area || ""} // Ensure a fallback value
  onChange={(e) => setUserData((prev) => ({ ...prev, area: e.target.value }))} // Update state
 
>
  <option value="">Select State</option> {/* Placeholder option */}
  {states.map((state, index) => (
    <option key={index} value={state}>
       {state.length > 12 ? `${state.slice(0, 12)}...` : state}
    </option>
  ))}
</select>

                    </div>
                    <div className="flex justify-between items-center ">
                      <label className="block w-[40%] lg:w-[30%] font-medium text-base  sm:text-lg ">
                      {t("city")}
                      </label>
                     {/* <input
                        type="text"
                        name="city"
                        value={userData?.city}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[A-Za-z]*$/.test(value)) {
                            handleInputChange(e);
                          }
                        }}
                        className="w-[60%]  sm:w-[70%] border-[1px] lg:border-2   p-1.5  bg-transparent  outline-none border-[#000000] "
                      /> */}

<select
  className="w-[60%]  sm:w-[70%] border-[1px] lg:border-2 deselect  p-1.5  bg-transparent  outline-none border-[#000000] truncate"
  id="city"
  name="city"
  value={userData?.city || ""} // Ensure a fallback value
  onChange={(e) => setUserData((prev) => ({ ...prev, city: e.target.value }))} // Update state
 
>
  <option value="">Select City</option> {/* Placeholder option */}
  {cities.map((city, index) => (
    <option key={index} value={city}>
       {city.length > 12 ? `${city.slice(0, 12)}...` : city}
    </option>
  ))}
</select>

                       
                    </div>
                  </div>
                  <div className="mt-6 text-center border-t  border-[#000000]  ">
                    <button className="bg-[#fe8735] text-black py-2  lg:w-auto  px-16  shadow-md hover:bg-orange-600 mt-3 mb-3 lg:mb-2 border border-[#000000] text-lg "
                    onClick={handleSubmit}>
                      {t("save")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Footer Section */}
       {/* Modal */}
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
       
       </div>
       </Container>
      
      <Footer/>
      </div>
    </>
  );
};

export default CarEditForm;
