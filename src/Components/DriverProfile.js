import React, { useEffect, useState } from "react";
//import formimg from "../assets/formimg.jpeg";
import "./Model.css";

import { GoHome } from "react-icons/go";
import { TfiEmail } from "react-icons/tfi";
import { GoBell } from "react-icons/go";
import { TfiWallet } from "react-icons/tfi";
import { CiUser } from "react-icons/ci"; 
//import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import cloudcomputing from "../assets/cloudcomputing.png";
import { CiStar } from "react-icons/ci";
//import Navbar from "./Navbar";
import DriverNavbar from "./DriverNavbar";
import API from '../Components/services/api';
import IMAGE_API from '../Components/services/ImgBase';
import UserProfile from '../Components/UserProfile';
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DriverProfile = () => {
  const { profileId } = useParams();
  const { t, i18n } = useTranslation(); // Hook for translation
  
  //const [successMessage, setSuccessMessage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  

  const [userData, setUserData] = useState({
    experience: "",
    firstName: "",
    lastName: "",
    idNumber: "",
    licenseNumber: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    password: "",
    vehicleType: "",
    area: "",
    city: "",
    country: "",
    ratings: 0,
    confirmPassword: "",
    profileImage:"",
    serviceType: [],
    uploadID:"",
    uploadLicense:"",
    uploadCriminalRecord:"",
    uploadDrugTest:"",
  });

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUserData = async () => {
      try {
        const userId = profileId; 
    
        // Using template literals for string interpolation
        const response = await API.get(`/users/${userId}`); 
        setUserData(response.data); // Adjust based on how your `API` service formats responses

        
        setPreviewImage(`${IMAGE_API}${response.data.profileImage}`);
        //setTempFirstName(response.data.firstName);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();

  }, [profileId]);

  // Convert the dateOfBirth to MM/DD/YYYY for display purposes
const formatDate = (date) => {
  if (!date) return '';
  const newDate = new Date(date);
  const day = String(newDate.getDate()).padStart(2, '0'); // Ensure two-digit day
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
  
  const year = newDate.getFullYear();
  return `${year}-${month}-${day}`;
};



// Use this formatted date for display purposes
const formattedDate = formatDate(userData?.dateOfBirth);



  const publicView = false;
  
  return (
    <>
    <DriverNavbar/>
      <div className=" bg-[#FFFFFF] p-5">
        <div className="  shadow-md max-w-6xl mx-auto mt-8 border-[1px]  lg:border-2 border-[#000000] text-[#000000] ">
          <div className=" pb-4 mt-5  mb-2 lg:mb-20  ">
            <UserProfile userData={userData} setUserData={setUserData} PublicView={publicView} />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2  lg:min-h-[670px]">
            <div className=" border-[1px]  lg:border-2 border-b-0 border-r-0 lg:border-r-2  lg:border-l-0   border-[#000000]">
              <div className="col-span-2  place-items-center">
                <h2 className="text-xl  font-bold py-2  uppercase text-center w-full">
                {t("driverDetails")}
                </h2>

                <table className="w-full border-[#000000]">
                  <tbody>
                    <tr className=" border-y-[1px] lg:border-y-2 border-b-[1px] lg:border-b-2 border-[#000000]">
                      <td className="px-3 font-thin lg:font-semibold text-lg lg:text-xl py-1">
                      {t("experience")}
                      </td>
                      <td className=" border-l-[1px] lg:border-l-2 px-3 border-[#000000]">
                        <p>{userData?.experience}</p>
                      </td>
                    </tr>
                    <tr className=" border-b-[1px] lg:border-b-2 border-[#000000]">
                      <td className="px-3  font-thin lg:font-semibold text-lg lg:text-xl py-1">
                      {t("idNumber")}
                      </td>
                      <td className="border-l-[1px] lg:border-l-2 px-3 border-[#000000]">
                        <p>{userData?.idNumber}</p>
                      </td>
                    </tr>
                    <tr className="border-b-[1px] lg:border-b-2 border-[#000000]">
                      <td className="px-3 font-thin lg:font-semibold text-lg lg:text-xl py-1">
                      {t("licenseNumber")}
                      </td>
                      <td className="border-l-[1px] lg:border-l-2 px-3 border-[#000000]">
                        <p>{userData?.licenseNumber}</p>
                      </td>
                    </tr>
                    <tr className="border-b-[1px] lg:border-b-2 border-[#000000]">
                      <td className="px-3 font-thin lg:font-semibold text-lg lg:text-xl py-1">
                      {t("dateOfBirth")}
                      </td>
                      <td className="border-l-[1px] lg:border-l-2 px-3 border-[#000000]">
                        <div className="flex justify-between items-center">
                          <p>{formattedDate}</p>
                          {/* <img src={calendar} alt="calendar" className="w-6" /> */}
                        </div>
                      </td>
                    </tr>
                    <tr className=" border-[#000000]">
                      <td className="px-3 font-thin lg:font-semibold text-lg lg:text-xl py-1">{t("phone")}</td>
                      <td className="border-l-[1px] lg:border-l-2 px-3 border-[#000000]">
                       <p>{userData?.phone}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Services Section */}
                <div className="col-span-2   w-full ">
                  <h2 className=" mb-4 border-y uppercase border-[#000000] border-t-[1px] lg:border-t-2 text-xl  font-bold py-2  text-center w-full flex justify-center items-center gap-4 ">
                  {t("services")}
                  </h2>
                  <div className="grid grid-cols-1 gap-1 font-medium pl-4 ">
                  {userData?.serviceType && userData.serviceType.length > 0 && (
  <div>
    {userData.serviceType.map((service, index) => (
      <p key={index}>{service}</p>
    ))}
  </div>
)}
                  </div>
                 
                </div>

                <div className="col-span-2   w-full ">
                  <h2 className="mb-4 border-y border-t-[1px] lg:border-t-2 uppercase border-[#000000]  text-xl  font-bold py-2  text-center w-full flex justify-center gap-2 ">
                    <span className="text-3xl ">
                      <img src={cloudcomputing} alt="" className="w-8" />
                    </span>
                    <span>{t("uploads")}</span>
                  </h2>
                  <div className="flex  justify-evenly items-center text-black text-xs mb-3">
                    {/* ID Upload Button */}
                    <div className="relative">
                      {/* Hidden File Input */}
                      <img src={`${IMAGE_API}${userData?.uploadID}`} className=" max-h-20" alt=""></img>
                      {/* Visible Button */}
                      <a href={`${IMAGE_API}${userData?.uploadID}`} alt="">{t("uploadID")}</a>
                    </div>

                    {/* License Upload Button */}
                    <div className="relative">

                    <img src={`${IMAGE_API}${userData?.uploadLicense}`} className=" max-h-20" alt=""></img>
                    <a href={`${IMAGE_API}${userData?.uploadLicense}`} alt="">{t("uploadLicense")}</a>
                      
                    </div>

                    {/* Criminal Record Upload Button */}
                    <div className="relative">

                    <img src={`${IMAGE_API}${userData?.uploadCriminalRecord}`} className=" max-h-20" alt=""></img>
                    <a href={`${IMAGE_API}${userData?.uploadCriminalRecord}`} alt="">{t("uploadCriminalRecord")}</a>
                      
                      
                    </div>

                    {/* Drug Test Upload Button */}
                    <div className="relative">
                    <img src={`${IMAGE_API}${userData?.uploadDrugTest}`} className=" max-h-20" alt=""></img>
                       <a href={`${IMAGE_API}${userData?.uploadDrugTest}`} alt=""> {t("uploadDrugTest")}</a>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex flex-col justify-end  lg:relative ">
              <div>
                <div className="">
                  <div className="bg-white border border-black  rounded-lg    lg:w-[34.5rem] lg:h-[24.7rem] flex justify-center items-center   lg:absolute lg:-top-2 lg:right-0  ">
                    <img
                      src={previewImage}
                      alt=""
                      className=" object-cover  w-[28rem]  h-[20rem] "
                    />
                  </div>
                  <span className="text-3xl bg-white lg:bg-transparent  flex justify-end lg:inline-block   ">
                    
                  </span>
                  {/* Hidden file input */}
      
                </div>

                {/*  */}

                <div className=" border-[1px]  lg:border-1  border-[#000000] border-r-0  border-b-1 ">
                  <h2 className="text-2xl  w-full  mb-4 text-center  font-bold py-1 border-y border-[#000000] ">
                  {t("highlights")}
                  </h2>
                  <div className="grid grid-cols-1 gap-2 mx-3 ">
                    <div className="flex justify-between items-center ">
                      <label className="block text-base  sm:text-lg font-medium">
                      {t("ratings")}
                      </label>
                      <div className="flex border-[1px] lg:border-2 gap-4 w-[60%]  sm:w-[70%]    p-1.5 bg-transparent  outline-none border-[#000000] text-2xl font-bold ">
                        <CiStar />
                        <CiStar />
                        <CiStar />
                        <CiStar />
                        <CiStar />
                      </div>
                    </div>
                    <div className="flex justify-between items-center ">
                      <label className="block  font-medium text-base  sm:text-lg ">
                      {t("vehicleType")}
                      </label>
                      <span>{userData?.vehicleType || ""}</span>
                       
                    </div>
                    <div className="flex justify-between items-center ">
                      <label className="block  font-medium text-base  sm:text-lg ">
                      {t("area")}
                      </label>
                      <p>{userData?.area}</p>
                    </div>
                    <div className="flex justify-between items-center ">
                      <label className="block text-base  sm:text-lg font-medium  ">
                      {t("city")}
                      </label>
                       <p>{userData?.city}</p>
                    </div>
                    <div className="flex justify-between items-center ">
                      <label className="block text-base  sm:text-lg font-medium">
                      {t("country")}
                      </label> 
                      <p>{userData?.country || ""}</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center border-t  border-[#000000]  ">
                    
                  </div>
                  
           
                </div>
              </div>
            </div>
          </div>
        </div>
 {/* Footer Section */}
 
   
 <div>
          {/* Black Bar for Web View */}
          <div className="hidden lg:flex bg-black  mx-auto mt-9 justify-center max-w-6xl text-white py-4 text-center text-lg">
          {t("rightsReserved")}
          </div>

          {/* Footer Menu for Mobile View */}
          <div className="flex justify-around text-3xl lg:hidden text-[#5a3623] mt-4">
            <a href="#"  className="text-center">
              <GoHome />
            </a>
            <a href="#" className="text-center">
              <TfiEmail />
            </a>
            <a href="#" className="text-center">
              <GoBell />
            </a>
            <a href="#" className="text-center">
              <TfiWallet />
            </a>
            <a href="#" className="text-center text-blue-500">
              <CiUser />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverProfile;
