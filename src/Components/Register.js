import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import registerImg from "./Images/man-with-glasses-shirt-that-says-happy-money_1322386-32315-scaled.jpg";
import { Box } from "@mui/material";
import "../Components/Register.css";
import API from '../Components/services/api';
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

function Register({ prevStep }) {

  const savedStep1Data = JSON.parse(localStorage.getItem("registerStep1")) || {};

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    ...savedStep1Data,
  });
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); // Get navigate function

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!isChecked) {
      newErrors.checkbox = "You must agree to the terms and conditions.";
    }
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

        navigate('/login');

        // Clear all data
        localStorage.removeItem("registerStep1");
        setFormData({ email: "", password: "", confirmPassword: "" });
      } catch (error) {
        setErrors({
          apiError: error.response?.data.message || "Server error occurred.",
        });
      }
    }
  };

  const { t, i18n } = useTranslation(); // Hook for translation

  // Load language preference on component mount
        useEffect(() => {
          const savedLang = Cookies.get("language");
          if (savedLang) {
            i18n.changeLanguage(savedLang);
          }
        
           
        }, []);

  return (
    <>
      <div style={{ backgroundImage: "#F4F4F4", height: "auto" }}>
        <Navbar />
        {/* <div> 
             <img src={registerImg} alt="Custom" />
             </div> */}
        <Box
          component="img"
          sx={{
            height: "auto",
            width: "100%",
            // maxHeight: { xs: 200, md: 5000 },
            // maxWidth: { xs: 350, md: 250 },
          }}
          alt="The house from the offer."
          src={registerImg}
        />
        <div className="registerContainer">
          <form onSubmit={handleSubmit}>
            <div className="fields">
              <label htmlFor="email">{t("email")}:</label>
              <input
                className="label-gap1"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span style={{ color: "red" }}>{errors.email}</span>
              )}
            </div>

            <div className="fields">
              <label htmlFor="password">{t("password")}:</label>
              <input
                className="label-gap2"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span style={{ color: "red" }}>{errors.password}</span>
              )}
            </div>

            <div className="fields">
              <label htmlFor="confirmPassword">{t("confirmPassword")}:</label>
              <input
                className="label-gap3"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span style={{ color: "red" }}>{errors.confirmPassword}</span>
              )}
            </div>
            <div>
              <input
                className="checkbox"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label>
              {t("agreeToTerms")}
              </label>
              {errors.checkbox && (
                <span style={{ color: "red" }}>{errors.checkbox}</span>
              )}
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

export default Register;
