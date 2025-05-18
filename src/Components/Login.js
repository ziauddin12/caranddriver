import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import registerImg from "./Images/man-with-glasses-shirt-that-says-happy-money_1322386-32315-scaled.jpg";
import { Box } from "@mui/material";
import "../Components/Register.css";
import API from '../Components/services/api';
import { useTranslation } from "react-i18next";

import Cookies from "js-cookie";

function Login() {
  const navigate = useNavigate(); // Get navigate function

  // Check for verification and user type inside useEffect
  useEffect(() => {
    const getisVerified = localStorage.getItem('isVerified'); // Parse the string into a boolean
    const userType = localStorage.getItem('userType'); 

    // Redirect to verify-opt if not verified
    if (getisVerified === false) {
      navigate('/verify-opt');
      return; // Exit early after navigation
    }

    // Navigate based on userType
    if (userType === 'driver') {
      navigate('/driver-profile');
    } else if (userType === 'carowner') {
      navigate('/carowner-profile');
    }
  }, [navigate]); // Runs on mount

  const [formData, setFormData] = useState({
    email: "",
    password: "", 
  }); 
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { t, i18n } = useTranslation(); // Hook for translation

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await API.post("/users/login", formData); // Backend API call
        localStorage.setItem("authToken", response.data.token); // Save token (if any) for authentication
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("userType", response.data.user.userType);
        localStorage.setItem("userImage", response.data.user.userImage);
        localStorage.setItem("isVerified", JSON.stringify(response.data.user.isVerfied)); // Save as string

        const userType = response.data.user.userType; // Assuming the response includes the user's type (driver/carowner)
        const isVerified = response.data.user.isVerfied;

        if (!isVerified) {
          navigate('/verify-opt');
        } else {
          if (userType === 'driver') {
            navigate('/myaccount');
          } else if (userType === 'carowner') {
            navigate('/dashboard');
          }
        }

        // Clear any messages and reset form
        setSuccessMessage("Login successful!");
        setFormData({ email: "", password: "" });
      } catch (error) {
        setErrors({
          apiError: error.response?.data.message || "Server error occurred.",
        });
      }
    }
  };

  useEffect(() => {
    const savedLang = Cookies.get("language");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <div style={{ backgroundColor: "#F4F4F4", height: "auto" }}>
      <Navbar />
      <Box
        component="img"
        sx={{ height: "auto", width: "100%" }}
        alt="Login Image"
        src={registerImg}
      />
      <div className="registerContainer rounded-md lg:absolute lg:top-[37%] lg:bg-[#ffffffd4] p-7 right-0 left-0">
        <form onSubmit={handleSubmit} className="w-full mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full items-center">
            {/* Email Field */}
            <label htmlFor="email" className="">{t("email")}</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <span className="col-span-2 text-red-500">{errors.email}</span>
            )}

            {/* Password Field */}
            <label htmlFor="password" className="">{t("password")}</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <a href="/forgot-password">{t("forgotPassword")}</a>
            {errors.password && (
              <span className="col-span-2 text-red-500">{errors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="w-full text-right">
            <button type="submit" className="registerBtn w-full mt-4 bg-orange-500 hover:bg-orange-500">
              {t("login")}
            </button>
          </div>
        </form>

        {errors.apiError && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            {errors.apiError}
          </p>
        )}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default Login;