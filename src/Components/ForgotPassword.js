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

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "", 
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { t, i18n } = useTranslation(); // Hook for translation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Clear previous messages
    setError(""); // Clear previous errors

    if (validateForm()) {
      try {
        const response = await API.post("/users/forgot-password", { email: formData.email });
        setSuccessMessage(response.data.message || "Password reset link sent!");
      } catch (err) {
        setError(err.response?.data.message || "An error occurred.");
      }
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
          <form onSubmit={handleSubmit} className="w-full mt-4">
          <h2 className="text-2xl font-semibold mb-4 text-center">
                {t("forgotPassword")}
              </h2>
              <p className="text-gray-600 mb-4 text-center">
                {t("forgotPasswordInstructions")}
              </p>

            <div className="lg:flex w-full items-center">
              
              {/* Email Field */}
              <label htmlFor="email" class="w-[100px]">{t("email")}</label>
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
            </div>

            {/* Submit Button */}
            <div className="w-full text-right">
              <button type="submit" className="registerBtn w-full mt-4">
                {t("sendResetLink")}
              </button>
            </div>
          </form>

          {error && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              {error}
            </p>
          )}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;