import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import registerImg from "./Images/man-with-glasses-shirt-that-says-happy-money_1322386-32315-scaled.jpg";
import { Box } from "@mui/material";
import "../Components/Register.css";
import "../Components/Forgeted.css";
import API from '../Components/services/api';
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

function VerifyOPTcode() { 
  
  
  const [optcode, setOptcode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Get navigate function

    
  const { t, i18n } = useTranslation(); // Hook for translation

   // Make an API call to update the user data
  const userId = localStorage.getItem('userId'); 

  const getisVerified = localStorage.getItem('isVerified'); 

  if (getisVerified === true) {
    navigate('/');
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
      const response = await API.post("/users/verify-otp", {
        optcode,
        userId
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleResend = async () => {
    try {
      const response = await API.post("/users/resend-otp", { userId });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  // Load language preference on component mount
  useEffect(() => {
    const savedLang = Cookies.get("language");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <>
      <div style={{ backgroundImage: "#F4F4F4", height: "auto" }}>
        <Navbar />
        <Box
          component="img"
          sx={{ height: "auto", width: "100%" }}
          alt="Forgot Password Image"
          src={registerImg}
        />
        <div className="registerContainer rounded-md lg:absolute  lg:top-[37%] lg:bg-[#ffffffd4]  p-7 right-0 left-0">
        <h2 className="text-2xl font-bold text-center mb-4">{t("VerifyOTP")}</h2>
        <p className="text-gray-600 text-center mb-4">{t("emailVerificationCode")} <span className="text-red-600 cursor-pointer" onClick={handleResend}>Resend</span> </p>
        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4"> 
            <input
              type="text"
              placeholder="Enter Verify OTP Code"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              value={optcode}
              onChange={(e) => setOptcode(e.target.value)}
              required
            />
          </div> 
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {t("VerifyOTP")}
          </button>
        </form>
           
        </div>
      </div>
    </>
  );
}

export default VerifyOPTcode;