import React, { useState, useEffect } from "react"; 
import Navbar from "./Navbar";
import registerImg from "./Images/man-with-glasses-shirt-that-says-happy-money_1322386-32315-scaled.jpg";
import { Box } from "@mui/material";
import "../Components/Register.css"; 

import { useTranslation, Trans  } from "react-i18next";
import Cookies from "js-cookie";

function Register({ nextStep }) {

  const [formData, setFormData] = useState({ 
      email: "",
      password: "",
      confirmPassword: "",
    });
  

  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  
 

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

  const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        console.log("Form submitted:", formData);
        // Clear form
       // setFormData({ firstName: "", lastName: "", phone: "" });
       // setErrors({});
       // Save data to localStorage for Step 2
       localStorage.setItem("registerStep1", JSON.stringify(formData));
       nextStep(); // Move to the next step
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
      <div style={{ backgroundColor: "#F4F4F4", height: "auto" }}>
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
        <div className="registerContainer p-3 rounded-md lg:absolute  lg:top-[30%] lg:bg-[#ffffffd4]  p-7 right-0 left-0">
          <form onSubmit={handleSubmit}>
            <div className=" flex flex-wrap items-center">
              <label htmlFor="email" className="w-[250px]">{t("email")}</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
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

            <div className="flex flex-wrap items-center mt-5">
              <label htmlFor="password" className="w-[250px]">{t("password")}</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center mt-5 mb-5">
              <label htmlFor="confirmPassword" className="lg:w-[250px]">{t("confirmPassword")}</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p style={{ color: "red" }}>{errors.confirmPassword}</p>
              )}
            </div>
            <div>
              <input
                className="checkbox"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
             <label dir="auto">
  <Trans i18nKey="agreeToTerms" components={{ 
    1: <a href="/terms" target="_blank" />, 
    2: <a href="/privacy-policy" target="_blank" /> 
  }} />
</label>
              {errors.checkbox && (
                <p style={{ color: "red" }}>{errors.checkbox}</p>
              )}
            </div>
             
            <button type="submit" className="registerBtn">
            {t("register")}
            </button>
          </form>
         
        </div>
      </div>
    </>
  );
}

export default Register;
