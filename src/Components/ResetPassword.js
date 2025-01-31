import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from "./Navbar";
import registerImg from "./Images/man-with-glasses-shirt-that-says-happy-money_1322386-32315-scaled.jpg";
import { Box } from "@mui/material";
import "../Components/Register.css";
import "../Components/Forgeted.css";
import API from '../Components/services/api';
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

function ResetPassword() { 
  
  const { token } = useParams(); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Get navigate function

    
  const { t, i18n } = useTranslation(); // Hook for translation

   

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await API.post("/users/reset-password", {
        token,
        newPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
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
        <div className="registerContainer lg:rounded-md lg:absolute lg:top-[37%] lg:bg-[#ffffffd4]  lg:p-7 lg:right-0 lg:left-0">
        <h2 className="text-2xl font-bold text-center mb-4">{t("resetpassword")}</h2>
        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">{t("password")}</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">{t("confirmPassword")}</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {t("resetpassword")}
          </button>
        </form>
           
        </div>
      </div>
    </>
  );
}

export default ResetPassword;