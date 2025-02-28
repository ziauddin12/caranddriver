import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import registerImg from "./Images/man-with-glasses-shirt-that-says-happy-money_1322386-32315-scaled.jpg";
import { Box } from "@mui/material";
import "../Components/Register.css";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import API from '../Components/services/api';

import Cookies from "js-cookie";

function Register2({ prevStep }) {

  const savedStep1Data = JSON.parse(localStorage.getItem("registerStep1")) || {};

   const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userType: "driver",
          ...savedStep1Data,
       });

  //const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
 
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); // Get navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { t, i18n } = useTranslation(); // Hook for translation

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    /*if (!isChecked) {
      newErrors.checkbox = "You must agree to the terms and conditions.";
    }*/

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await API.post("/users", formData); // Backend API call
        setSuccessMessage(response.data.message);
        console.log("User registered successfully:", response.data);

        navigate('/verify-opt');

        // Clear all data
        localStorage.removeItem("registerStep1");
        setFormData({ firstName: "", lastName: "", userType: "driver" });
      } catch (error) {
        setErrors({
          apiError: error.response?.data.message || "Server error occurred.",
        });
      }
    }
  };

  

  // Load language preference on component mount
        useEffect(() => {
          const savedLang = Cookies.get("language");
          if (savedLang) {
            i18n.changeLanguage(savedLang);
          }
        
           
        }, []);

  return (
    <>
      <div style={{ backgroundColor: "#F4F4F4", height: "auto" }}>
        <Navbar />
        <Box
          component="img"
          sx={{
            height: "auto",
            width: "100%",
          }}
          alt="The house from the offer."
          src={registerImg}
        />
        <div className="registerContainer p-3 rounded-md lg:absolute  lg:top-[30%] lg:bg-[#ffffffd4]  p-7 right-0 left-0">
          <form onSubmit={handleSubmit}>
            <div className="fields">
              <label htmlFor="firstName">{t("firstName")}:</label>
              <input
  className="label-gap4"
  type="text"
  id="firstName"
  name="firstName"
  value={formData.firstName}
  onChange={(e) => {
    const value = e.target.value;
    if (/^[A-Za-z]*$/.test(value)) {
      handleChange(e);
    }
  }}
/>
              {errors.firstName && (
                <p style={{ color: "red" }}>{errors.firstName}</p>
              )}
            </div>

            <div className="fields">
              <label htmlFor="lastName">{t("lastName")}:</label>
              <input
                className="label-gap5"
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[A-Za-z]*$/.test(value)) {
                    handleChange(e);
                  }
                }}
              />
              {errors.lastName && (
                <p style={{ color: "red" }}>{errors.lastName}</p>
              )}
            </div>

            <div className="fields">
              <label htmlFor="phone">{t("phone")}:</label>
              <input
                className="label-gap6"
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p style={{ color: "red" }}>{errors.phone}</p>
              )}
            </div>

            <div className="fields">
            <label htmlFor="userType">{t("iAmA")}:</label>
            <select
              className="label-gap6"
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="driver">{t("driver")}</option>
              <option value="carowner"> {t("carOwner")}</option>
            </select>
          </div>

            <button type="submit" className="registerBtn">
            {t("register")}
            </button>
          </form>

          {errors.apiError && (
              <p style={{ color: "red", fontWeight: "bold" }}>
                {errors.apiError}
              </p>
            )}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
      </div>
    </>
  );
}

export default Register2;
